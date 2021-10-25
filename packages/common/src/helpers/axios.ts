import { AxiosError } from 'axios';

export function handleAxiosError(error: unknown, errorMessage: string) {
  const { response } = error as AxiosError;
  if (response) {
    const { status, statusText } = response;
    throw Error(`${status}: ${statusText} | ${errorMessage}`);
  } else {
    console.log(errorMessage);
    throw error;
  }
}