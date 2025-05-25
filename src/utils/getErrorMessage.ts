// Parses unknown error, and returns a user-friendly error message
export const getErrorMessage = (error: unknown, defaultMessage?: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (defaultMessage) {
    return defaultMessage;
  }

  return "Something went wrong, please try again later.";
};
