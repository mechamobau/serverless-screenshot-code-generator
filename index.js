const puppeteer = require("puppeteer");

const qs = require("querystring");

async function closeFullpageBanner(page) {
	await page.evaluate(() => {
		const div = document.querySelector("#DIGITAL_CLIMATE_STRIKE");
		if (!div) return;
		div.parentElement.removeChild(div);
	});
}

const defaultCarbonConfig = {
	// Theme
	t: "dracula",
	// Language
	l: "auto",
	// Background
	bg: "#ADB7C1",
	// Window theme
	// none, sharp, bw
	wt: "none",
	// Window controls
	wc: true,
	// Font family
	fm: "Hack",
	// Font size
	fs: "18px",
	// Line numbers
	ln: false,
	// Drop shadow
	ds: false,
	// Drop shadow offset
	dsyoff: "20px",
	// Drop shadow blur
	dsblur: "68px",
	// Auto adjust width
	wa: true,
	// Line height
	lh: "133%",
	// Padding vertical
	pv: "0",
	// Padding horizontal
	ph: "0",
	// Squared image
	si: false,
	// Watermark
	wm: false,
	// Export size
	// 1x, 2x, 4x
	es: "2x",
};

exports.helloWorld = async (req, res) => {
	try {
		if (!req.body.content)
			throw new Error(
				"You need to provide the code inside the body of the request"
			);

		const { content: code, language = "text" } = req.body;

		console.info("Request:", req.body);

		if (!!code.trim()) {
			const timeout = 2000;

			const browser = await puppeteer.launch({
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			});
			const page = await browser.newPage();

			await page.setViewport({
				width: 2560,
				height: 1080,
				deviceScaleFactor: 2,
			});

			const params = qs.stringify({
				...defaultCarbonConfig,
				code,
				l: language.toLowerCase(),
			});

			const url = `https://carbon.now.sh/?${params}`;

			await page.goto(url);

			await closeFullpageBanner(page);

			const exportContainer = await page.waitForSelector("#export-container");
			const elementBounds = await exportContainer.boundingBox();

			if (!elementBounds)
				throw new Error("Cannot get export container bounding box");

			const buffer = await exportContainer.screenshot({
				encoding: "binary",
				clip: {
					...elementBounds,
					x: Math.round(elementBounds.x),
					height: Math.round(elementBounds.height) - 1,
				},
			});

			await page.waitFor(timeout);

			await browser.close();

			res.contentType("image/jpeg").end(buffer, "binary");
		} else {
			throw new Error("Not a valid code");
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({
			data: {
				error: e.message,
			},
		});
	}
};
