import { CustomError } from "../../interfaces/interfaces";

function createCustomError(errorMessage: string, statusCode: number) {
  const error: CustomError = new Error(errorMessage);
  error.code = statusCode;
  return error;
}

module.exports = createCustomError;
