import axios from "axios";
import { configure } from "axios-hooks";
import { API_URL } from "@env";

export const Client = axios.create({
  baseURL: `http://${API_URL}/`,
  withCredentials: true,
  responseType: "json",
});

configure({ axios });
