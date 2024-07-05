import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useTmAuth from "../context/AuthProvider";
import useRefreshToken from "./useRefreshToken";


const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const {auth}: any = useTmAuth();

    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`
                }

                return config
            },
            (error) => Promise.reject(error)
        )


        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async(err) => {
                const prevRequest = err.config;
                if(err?.response?.status === 403 && !prevRequest?.sent){
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }

                return Promise.reject(err)
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}


export default useAxiosPrivate;