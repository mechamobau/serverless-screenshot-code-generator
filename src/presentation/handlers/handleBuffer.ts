import type { Response } from 'express';

function handleBuffer(response: Response) {
  return (buffer: Buffer | string | null) => {
    if (!buffer) {
      response.status(404);
      response.end();
      return;
    }
    response.status(200).contentType('image/jpeg').end(buffer, 'binary');
  };
}

export default handleBuffer;
