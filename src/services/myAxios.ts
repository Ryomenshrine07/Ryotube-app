import axios from 'axios';

export const BASE_URL = "http://localhost:8080";
// export const BASE_URL = "https://ryotube-app-backend-production.up.railway.app";

export const myAxios = axios.create({
    baseURL:BASE_URL
}); 

myAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      const isPublicRoute = config.url?.includes('/login') || config.url?.includes('/register');
      if(!isPublicRoute && token && config.headers){
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );