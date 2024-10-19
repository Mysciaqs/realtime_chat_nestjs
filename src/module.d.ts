declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    REDIS_URL: string;
    TIME_TO_LIVE: number;
    MESSAGE_HISTORY_AMOUNT: number;
  }
}
