const puppeteer = require("puppeteer");

const getCodeScreenshot = require("./utils/getCodeScreenshot");
const validateRequest = require("./utils/validateRequest");

const handleBuffer = (response) => (buffer) =>
	response.contentType("image/jpeg").end(buffer, "binary");

const handleError = (response) => (error) => {
	console.error(error);
	response.status(500).send({
		data: {
			error: e.message,
		},
	});
};

function main(request, response) {
	const { code, language } = validateRequest(request.body);

	const puppeteerOptions = {
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	};

	puppeteer
		.launch(puppeteerOptions)
		.then(getCodeScreenshot(language, code))
		.then(handleBuffer(response))
		.catch(handleError(response));
}

module.exports = main;
