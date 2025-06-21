import { okAsync, ResultAsync } from "neverthrow";

export const healthCheck = ():ResultAsync<boolean, never> =>
    okAsync(true)