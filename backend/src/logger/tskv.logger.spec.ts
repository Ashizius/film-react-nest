import { Test, TestingModule } from '@nestjs/testing';
import { TskvLogger } from './tskv.logger';
import { NotFoundException } from '@nestjs/common';

describe('DevLogger', () => {
  let logger: TskvLogger;
  const originalLog = console.log;
  let mockConsoleLog: jest.SpyInstance;
  const optionalParams = ['someParameter0', 'someParameter1'];
  const mockMessage = 'MockMessage';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TskvLogger],
    }).compile();
    mockConsoleLog = jest
      .spyOn(console, 'log')
      .mockImplementation((...args) => {
        return args.join('');
      });
    logger = await module.resolve<TskvLogger>(TskvLogger);
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should write log in correct format', () => {
    const mockConsoleMessage = `level=log\tmessage=${mockMessage}\toptionalParams[0]=${optionalParams[0]}\toptionalParams[1]=${optionalParams[1]}`;
    logger.log(mockMessage, ...optionalParams);
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveReturnedWith(mockConsoleMessage);
  });

  it('should write warning in correct format', () => {
    const mockConsoleMessage = `level=warn\tmessage=${mockMessage}\toptionalParams[0]=${optionalParams[0]}\toptionalParams[1]=${optionalParams[1]}`;
    logger.warn(mockMessage, ...optionalParams);
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveReturnedWith(mockConsoleMessage);
  });

  it('should write error in correct format', () => {
    const mockConsoleMessage = `level=error\tmessage.status=404\tmessage.message=${mockMessage}\tmessage.name=NotFoundException\tmessage.response.message=${mockMessage}\tmessage.response.error=Not Found\tmessage.response.statusCode=404`;
    logger.error(new NotFoundException(mockMessage));
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveReturnedWith(mockConsoleMessage);
  });
});
