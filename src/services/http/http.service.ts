import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { MessengerService } from "../messenger/messenger.service";
import { Messages } from "../../constants/messages";
import { singleton } from "tsyringe";
import { UserService } from "../user/user.service";
import { AuthorizationData } from "../../types/AuthorizationData";
import { BackgroundMessages } from "../../constants/backgroundMessages";
import { URL } from "../../constants/urls";

@singleton()
export class HttpService {
    private readonly MAX_LIMIT = 1;
    private limit = 0;
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

    public get(url: string, config?: AxiosRequestConfig) {
        return this.axiosInstance?.get(url, config);
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
                        this.messenger.sendToBackground(BackgroundMessages.UserAuthorized, { isAuthorized: false });
                        return Promise.reject(error);
                    }

                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return this.axiosInstance?.request(originalRequest);
                } catch (refreshError) {
                    this.messenger.sendToBackground(BackgroundMessages.UserAuthorized, { isAuthorized: false });
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
            this.messenger.sendToBackground(BackgroundMessages.UserAuthorized, { isAuthorized: false });
            this.messenger.send(Messages.OpenSignInPopup);
            return null;
        }
    }
}