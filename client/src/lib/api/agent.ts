import axios from "axios";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

agent.interceptors.request.use((config) => {
  store.uiStore.isBusy();
  return config;
});

agent.interceptors.response.use(async (response) => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    console.log("Error in response interceptor:", error);
    return await Promise.reject(error);
  } finally {
    store.uiStore.isIdle();
  }
});

export default agent;
