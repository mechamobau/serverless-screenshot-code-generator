const REGEX = /#CodeBot\s(\w+)\n(((.*)\n)+)/;

const isValidContent = (content) => {
	return REGEX.test(content);
};

exports.helloWorld = (req, res) => {
	try {
		if (!req.body.content)
			throw new Error(
				"You need to provide the content of tweet inside the body of request"
			);

		const { content } = req.body;

		if (isValidContent(content)) {
			const contentMatches = content.match(REGEX);

			const language = contentMatches[1];

			const code = contentMatches[2];

			res.send({
				language,
				code,
			});
		} else {
			throw new Error("Not a valid code");
		}
	} catch (e) {
		res.status(500).send({
			data: {
				error: e.message,
			},
		});
	}
};
