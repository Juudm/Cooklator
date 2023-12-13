import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const onRequest = async (config) => {
  try {
    const token = await AsyncStorage.getItem('@TOKEN_KEY');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    // Lide com erros ao obter o token de AsyncStorage aqui
    console.error('Erro ao obter o token de AsyncStorage:', error);
    return config;
  }
};

const setupInterceptorsTo = (axiosInstance) => {
  axiosInstance.interceptors.request.use(onRequest);
  return axiosInstance;
};

const API = axios.create();
setupInterceptorsTo(API);
export default API;