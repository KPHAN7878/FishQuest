import axios from "axios";
import { configure } from "axios-hooks";
import { API_URL, S3_ACCESS_KEY, S3_SECRET } from "@env";
import AWS from "aws-sdk";

export const Client = axios.create({
  baseURL: `http://${API_URL}/`,
  withCredentials: true,
  responseType: "json",
});

AWS.config.update({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET,
  region: "us-east-2",
  signatureVersion: "v4",
});

export const S3 = new AWS.S3({});

configure({ axios });
