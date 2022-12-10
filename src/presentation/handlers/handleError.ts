import type { Response } from 'express';
import extractErrorMessage from '../utils/extractErrorMessage';

function handleError(response: Response) {
  return (error: unknown) => {
    console.error(error);

    response.status(500).send({
      data: {
        error: extractErrorMessage(error) ?? 'Unknown Error',
      },
    });
  };
}

export default handleError;
