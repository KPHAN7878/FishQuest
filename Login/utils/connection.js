export const URL = "10.219.66.101:3000";
import axios from "axios";

export const FishQuestClient = axios.create({
  baseURL: `http://${URL}/`,
});
