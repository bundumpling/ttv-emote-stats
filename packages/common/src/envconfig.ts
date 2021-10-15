import workspacesRoot from "find-yarn-workspace-root";
import env from 'env-var';
import { config } from 'dotenv';
import { EnvConfig } from "../types";

const getEnv = env.get;

const rootDirectory = workspacesRoot();

config({ path: `${rootDirectory}/.env` });

export const envConfig: EnvConfig = {
  clientPort: getEnv('CLIENT_PORT').asPortNumber() || 8080,
  serverPort: getEnv('SERVER_PORT').asPortNumber() || 8081,
  twitch: {
    clientId: getEnv('TWITCH_CLIENT_ID').asString() || "",
    secret: getEnv('TWITCH_SECRET').asString() || "",
    authToken: getEnv('TWITCH_AUTH_TOKEN').asString() || ""
  },
  mongoDB: {
    uri: "mongodb://localhost:27017",
    dbName: "TTVEmoteStats"
  }
};