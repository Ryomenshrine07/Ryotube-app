import axios from 'axios';

// export const BASE_URL = "http://localhost:8080";
export const BASE_URL = "http://ryotube-application-env.eba-erah6sxf.eu-north-1.elasticbeanstalk.com";

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