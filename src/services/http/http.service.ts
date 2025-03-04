import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { MessengerService } from "../messenger/messenger.service";
import { singleton } from "tsyringe";
import { UserService } from "../user/user.service";
import { AuthorizationData } from "../../types/AuthorizationData";
import { URL } from "../../constants/urls";
import { SettingsNames } from "../../constants/settingsNames";
import { SettingsService } from "../settings/settings.service";

@singleton()
export class HttpService {
    private readonly MAX_LIMIT = 1;
    private limit = 0;
    private axiosInstance: AxiosInstance | null = null;
    constructor(
        protected messenger: MessengerService,
        protected userService: UserService,
        protected settingsService: SettingsService
    ) {
        this.axiosInstance = axios.create({
            baseURL: process.env.API_URL,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
            }
        })

        this.axiosInstance.defaults.timeout = 10000;

        this.initAuthInterceptor();
        this.detectAccessTokenExpiration();
    }

    public post(url: string, data: any, config?: AxiosRequestConfig) {
        return this.axiosInstance?.post(url, data, config);
    }

    public put(url: string, data: any, config?: AxiosRequestConfig) {
        return this.axiosInstance?.put(url, data, config);
    }

    public get(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance?.get(url, config);
    }

    public delete(url: string, requestParams?: any, config?: AxiosRequestConfig) {
        if (requestParams) {
            url += `?${new URLSearchParams(requestParams).toString()}`;
        }
        return this.axiosInstance?.delete(url, config);
    }

    private initAuthInterceptor() {
        if (!this.axiosInstance) return;

        this.axiosInstance.interceptors.request.use((request) => {
            const accessToken = this.userService.getAccessToken();
            if (accessToken) {
                request.headers.Authorization = `Bearer ${accessToken}`;
            }
            return request;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    private detectAccessTokenExpiration() {
        if (!this.axiosInstance) return;

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig;

                if (error.response?.status !== 401 || originalRequest.url === URL.auth.refreshToken) {
                    return Promise.reject(error);
                }

                try {
                    this.limit++;
                    if (this.limit > this.MAX_LIMIT) {
                        throw Error;
                    }

                    const data = await this.refreshTokenRequest();

                    if (!data) {
                        throw Error;
                    }

                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return this.axiosInstance?.request(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        );
    }

    public async refreshTokenRequest(): Promise<AuthorizationData | null> {
        try {
            const refreshToken = this.userService.getRefreshToken();

            const response = await this.post(URL.auth.refreshToken, { token: refreshToken });

            this.userService.saveUserData(response?.data);
            return response?.data;
        } catch (e) {
            this.settingsService.set(SettingsNames.User, null);
            return null;
        }
    }
}