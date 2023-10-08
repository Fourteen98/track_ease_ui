import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

export enum CustomHttpRequestStatus {
    IDLE = 'IDLE',
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED',
}

export type RequestStatusType = CustomHttpRequestStatus;

const useCustomFetch = (
    asyncFunc: () => Promise<AxiosResponse<never, never>>,
    triggerOnLoad = true,
    onSuccess?: (data: never) => void,
) => {
    const [status, setStatus] = useState<RequestStatusType>(
        CustomHttpRequestStatus.IDLE,
    );
    const [trigger, setTrigger] = useState<boolean>(triggerOnLoad);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    const fetchHandler = useCallback(() => {
        setStatus(CustomHttpRequestStatus.PENDING);
        asyncFunc()
            .then((response) => {
                setData(response.data);
                onSuccess && onSuccess(response.data);
                setStatus(CustomHttpRequestStatus.FULFILLED);
            })
            .catch((error) => {
                setError(error);
                setStatus(CustomHttpRequestStatus.REJECTED);
            });
    }, [setData, setStatus, setError, asyncFunc]);

    useEffect(() => {
        trigger && fetchHandler();
        return () => setTrigger(false);
    }, [trigger]);

    return {
        loading: status === CustomHttpRequestStatus.PENDING,
        data,
        error,
        triggerFetch: () => setTrigger(true),
    };
};

export default useCustomFetch;