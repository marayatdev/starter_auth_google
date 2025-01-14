import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";

interface UseAxiosProps<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
    refetch: () => void;
}

export const useAxiosWithCookies = <T = any>(
    config: AxiosRequestConfig,
    immediate: boolean = true // Optionally set this to false if you don't want to fetch immediately
): UseAxiosProps<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios({
                ...config,
                withCredentials: true, // Include cookies with the request
            });
            setData(response.data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate]);

    return { data, error, loading, refetch: fetchData };
};
