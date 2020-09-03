const validateRequest = (body) => {
	if (!body.content)
		throw new Error(
			"You need to provide the code inside the body of the request"
		);

	const { content: code, language = "text" } = body;

	if (code.trim() === "") throw new Error("This is not a valid code");

	console.info("Request:", body);

	return { code, language };
};

module.exports = validateRequest;
