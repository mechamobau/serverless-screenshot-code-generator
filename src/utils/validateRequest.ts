import { Code } from '../@types/code';

const validateRequest = ({ code, language = 'text' }: Partial<Code>) => {
  console.info('Request:', { code, language });

  if (!code)
    throw new Error(
      'You need to provide the code inside the body of the request',
    );

  if (code.trim() === '') throw new Error('This is not a valid code');

  return { code, language };
};

export default validateRequest;
