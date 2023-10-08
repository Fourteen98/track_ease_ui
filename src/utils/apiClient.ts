import axios from "axios";
import {notification} from "antd";
import Cookies from "js-cookie";

export enum CustomHttpRequestStatus {
    IDLE = 'IDLE',
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED',
}

export type RequestStatusType = CustomHttpRequestStatus;

export default class {
    success;

    error;

    axiosInstance = axios.create({
        baseURL: "http://localhost:8000/parcel/api/v1/",
    });

    requestStatus: RequestStatusType = CustomHttpRequestStatus.IDLE;

    constructor(base_url?: string) {
        base_url && (this.axiosInstance.defaults.baseURL = base_url);
        this.axiosInstance.interceptors.response.use(
            this.successInterceptor,
            this.rejectedInterceptor
        );
        this.axiosInstance.defaults.onUploadProgress = () => {
            this.requestStatus = CustomHttpRequestStatus.PENDING;
        };
    }

    successInterceptor = (response) => {
        this.requestStatus = CustomHttpRequestStatus.FULFILLED;
        this.success = response.data.data;
        return response;
    };

    rejectedInterceptor = (error: { response: any }) => {
        this.requestStatus = CustomHttpRequestStatus.REJECTED;
        const response = error?.response;
        const status = response?.status;
        if (response) {
            if (status === 400) {
                const message = response?.data?.message || response?.data?.detail || 'Something unexpected occuried, try again';
                notification.error({
                    message: "",
                    description: message,
                });
            }
        }
        this.success = null;
        this.error = status;
        return Promise.reject({ status });
    };



    getInstance = (base_url?: string) => {
        base_url && (this.axiosInstance.defaults.baseURL = base_url);
        return this.axiosInstance;
    };

    post = (url: string, payload: any) => this.axiosInstance.post(url, payload);

    get = (url: string) => this.axiosInstance.get(url);

    put = (url: string, payload: any) => this.axiosInstance.put(url, payload);

    patch = (url: string, payload?: any) =>
        payload
            ? this.axiosInstance.patch(url, payload)
            : this.axiosInstance.patch(url);

    delete = (url: string) => this.axiosInstance.delete(url);
}