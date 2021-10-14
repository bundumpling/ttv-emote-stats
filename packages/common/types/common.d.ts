export interface EnvConfig {
  clientPort: number;
  serverPort: number;
  twitch: {
    clientId: string;
    secret: string;
    authToken: string;
  }
}

export declare const envConfig: EnvConfig;