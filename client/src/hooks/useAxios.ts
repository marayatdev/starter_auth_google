import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://your-api-url.com', // Replace with your API's base URL
    withCredentials: true, // Enables cookies
});

export default axiosInstance;
