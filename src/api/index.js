import { ofetch } from "ofetch";

export const api = ofetch.create({
  baseURL: "http://localhost:3000",
});

export const apiPost = (endPoint, payload) =>
  api(endPoint, {
    method: "post",
    body: payload,
  });

export const apiPut = (endPoint, payload) =>
  api(endPoint, {
    method: "put",
    body: payload,
  });

export const apiPatch = (endPoint, payload) =>
  api(endPoint, {
    method: "patch",
    body: payload,
  });
