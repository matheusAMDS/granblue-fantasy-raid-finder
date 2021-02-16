import axios, { AxiosInstance } from "axios"

import { TWITTER_BASE_URL, TWITTER_BEARER_TOKEN } from "../../config"

export interface APIClient extends AxiosInstance {}

const Client: APIClient = axios.create({
  baseURL: TWITTER_BASE_URL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`
  }
})

export default Client