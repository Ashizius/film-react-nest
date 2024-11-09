import { Test, TestingModule } from '@nestjs/testing';
import { JsonLogger } from './json.logger';
import { log } from 'console';
import { NotFoundException } from '@nestjs/common';

describe('DevLogger', () => {
  let logger: JsonLogger;
  const originalLog=console.log;
  let mockConsoleLog:jest.SpyInstance;
  const optionalParams = ['someParameter0','someParameter1'];
  const mockMessage = 'MockMessage';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonLogger],
    }).compile();
    mockConsoleLog = jest.spyOn(console,'log').mockImplementation((...args)=>{return args.join('')});
    logger = await module.resolve<JsonLogger>(JsonLogger);
  });

  afterEach(() => {
    console.log=originalLog;
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should write log in correct format', () => {
    const mockConsoleMessage=JSON.stringify({level:'log',message:mockMessage,optionalParams});
    logger.log(mockMessage,...optionalParams);
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveReturnedWith(mockConsoleMessage);
  });

  it('should write warning in correct format', () => {
    const mockConsoleMessage=JSON.stringify({level:'warn',message:mockMessage,optionalParams});
    logger.warn(mockMessage,...optionalParams);
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveReturnedWith(mockConsoleMessage);
  });

  it('should write error in correct format', () => {
    const mockConsoleMessage=JSON.stringify({level:'error',message:new NotFoundException(mockMessage),optionalParams});
    logger.error(new NotFoundException(mockMessage),...optionalParams);
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveReturnedWith(mockConsoleMessage);
  });
});
