import qs from 'querystring';
import { defaultCarbonConfig } from '../constants';
import Code from '../types/Code';

import type { Browser } from 'puppeteer';

function getCodeScreenshot({ language, code }: Code) {
  return async (browser: Browser) => {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    });

    const params = qs.stringify({
      ...defaultCarbonConfig,
      code,
      l: language.toLowerCase(),
    });

    const url = `https://carbon.now.sh/?${params}`;

    await page.goto(url);

    const codeContainerElement = await page.waitForSelector(
      '#export-container',
    );

    const elementBounds = await codeContainerElement?.boundingBox();

    if (!elementBounds)
      throw new Error('Cannot get export container bounding box');

    const screenshot =
      (await codeContainerElement?.screenshot({
        encoding: 'binary',
        clip: {
          ...elementBounds,
          x: Math.round(elementBounds.x),
          height: Math.round(elementBounds.height) - 1,
        },
      })) ?? null;

    await browser.close();

    return screenshot;
  };
}
export default getCodeScreenshot;
