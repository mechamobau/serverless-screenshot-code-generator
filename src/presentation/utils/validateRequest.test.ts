import validateRequest from './validateRequest';

const consoleLogMock = jest.fn();

describe('validateRequest', () => {
  beforeEach(() => {
    Object.defineProperty(console, 'info', {
      value: consoleLogMock,
      writable: false,
    });
  });
  afterEach(jest.clearAllMocks);
  it('returns error when no code is passed', () => {
    expect(() => validateRequest({ code: '' })).toThrow(
      'You need to provide the code inside the body of the request',
    );
    expect(consoleLogMock).toBeCalledWith('Request:', {
      code: '',
      language: 'text',
    });
  });
  it('defines text as default language when no language is passed', () => {
    expect(validateRequest({ code: 'Hello' })).toEqual({
      code: 'Hello',
      language: 'text',
    });
    expect(consoleLogMock).toBeCalledWith('Request:', {
      code: 'Hello',
      language: 'text',
    });
  });
  it('returns error if only spaces is passed as code', () => {
    expect(() => validateRequest({ code: '    ' })).toThrow(
      'This is not a valid code',
    );
    expect(consoleLogMock).toBeCalledWith('Request:', {
      code: '    ',
      language: 'text',
    });
  });
});
