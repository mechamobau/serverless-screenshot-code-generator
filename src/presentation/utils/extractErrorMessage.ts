function extractErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (error instanceof Error) {
    return error.message;
  }

  return `${error}`;
}

export default extractErrorMessage;
