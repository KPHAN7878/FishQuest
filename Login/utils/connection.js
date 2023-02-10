export const URL = "10.219.66.101:3000";
import axios from "axios";
import { configure } from "axios-hooks";

export const Client = axios.create({
  baseURL: `http://${URL}/`,
  withCredentials: true,
  responseType: "json",
});

// configure({ axios });
