import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { MessengerService } from "../messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { singleton } from "tsyringe";
import { UserService } from "../user/user.service";

@singleton()
export class HttpService {
    private axiosInstance: AxiosInstance | null = null;
    constructor(
        protected messenger: MessengerService,
        protected userService: UserService
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
                if (error.response?.status !== 401) {
                    return Promise.reject(error);
                }

                const refreshedToken = await this.refreshTokenRequest();

                if (!refreshedToken) {
                    return Promise.reject(error);
                }

                const originalRequest = error.config as InternalAxiosRequestConfig;
                const accessToken = this.userService.getAccessToken();

                if (accessToken && originalRequest) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return this.axiosInstance?.request(originalRequest);
            }
        )
    }

    private async refreshTokenRequest(): Promise<string | null> {
        try {
            const refreshToken = this.userService.getRefreshToken();
            if (!refreshToken) {
                this.messenger.send(Messages.OpenSignInPopup);
                return null;
            }

            const response = await this.axiosInstance?.post('/auth/refresh', { token: refreshToken });

            this.userService.saveUserData(response?.data);
            return response?.data.accessToken;
        } catch (e) {
            this.messenger.send(Messages.OpenSignInPopup);
            return null;
        }
    }
}