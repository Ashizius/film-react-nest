import { Test, TestingModule } from '@nestjs/testing';
import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let provider: DevLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevLogger],
    }).compile();

    provider = await module.resolve<DevLogger>(DevLogger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
