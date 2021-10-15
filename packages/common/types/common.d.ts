export interface EnvConfig {
  clientPort: number;
  serverPort: number;
  twitch: {
    clientId: string;
    secret: string;
    authToken: string;
  },
  mongoDB: {
    uri: string;
    dbName: string;
  }
}

export declare const envConfig: EnvConfig;