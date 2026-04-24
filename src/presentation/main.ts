import puppeteer from 'puppeteer';

import type { Response, Request } from 'express';

import getCodeScreenshot from './utils/getCodeScreenshot';
import validateRequest from './utils/validateRequest';
import handleBuffer from './handlers/handleBuffer';
import handleError from './handlers/handleError';

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
