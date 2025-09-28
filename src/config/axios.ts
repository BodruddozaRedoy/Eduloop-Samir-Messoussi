import axios from 'axios'

export const AxiosPublic = axios.create({
    baseURL: "http://10.10.13.60/api",
    // withCredentials: true
})