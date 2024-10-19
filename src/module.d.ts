declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    REDIS_HOST: string;
    REDIS_PORT: number;
    TIME_TO_LIVE: number;
    MESSAGE_HISTORY_AMOUNT: number;
  }
}
