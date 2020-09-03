import puppeteer from 'puppeteer';

import type { Response, Request } from 'express';

import getCodeScreenshot from './utils/getCodeScreenshot';
import validateRequest from './utils/validateRequest';

type RuntimeError = {
  message?: string;
};

const handleBuffer = (response: Response) => (buffer: Buffer) =>
  response.status(200).contentType('image/jpeg').end(buffer, 'binary');

const handleError = (response: Response) => (error: RuntimeError) => {
  console.error(error);

  response.status(500).send({
    data: {
      error: error.message,
    },
  });
};

async function main(request: Request, response: Response) {
  try {
    const { code, language } = validateRequest(request.body);

    const puppeteerOptions = {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

    await puppeteer
      .launch(puppeteerOptions)
      .then(getCodeScreenshot({ language, code }))
      .then(handleBuffer(response));
  } catch (e) {
    handleError(response)(e);
  }
}

export default main;
