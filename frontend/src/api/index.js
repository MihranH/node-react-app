import axios from 'axios';

const apiAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

apiAxios.interceptors.response.use(async (res) => res);

apiAxios.interceptors.request.use(async (req) => {
  if (req) {
    const token = localStorage.getItem('token');
    req.headers.Authorization = token;
    return req;
  }
  return {};
});

export default apiAxios;
