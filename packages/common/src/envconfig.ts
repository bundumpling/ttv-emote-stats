import * as env from 'env-var';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../.env') });

export interface EnvConfig {
  clientPort: number;
  serverPort: number;
}

export const envConfig: EnvConfig = {
  clientPort: env.get('CLIENT_PORT').asPortNumber(),
  serverPort: env.get('SERVER_PORT').asPortNumber(),
};