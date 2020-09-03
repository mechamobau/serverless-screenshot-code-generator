const qs = require('querystring');
const { defaultCarbonConfig } = require('../constants');

const getCodeScreenshot = (language, code) => async (browser) => {
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

  const codeContainerElement = await page.waitForSelector('#export-container');

  const elementBounds = await codeContainerElement.boundingBox();

  if (!elementBounds)
    throw new Error('Cannot get export container bounding box');

  return await codeContainerElement.screenshot({
    encoding: 'binary',
    clip: {
      ...elementBounds,
      x: Math.round(elementBounds.x),
      height: Math.round(elementBounds.height) - 1,
    },
  });
};

module.exports = getCodeScreenshot;
