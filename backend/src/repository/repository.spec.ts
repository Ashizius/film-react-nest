import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryProvider } from './repository.provider';

describe('RepositoryProvider', () => {
  let provider: RepositoryProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepositoryProvider],
    }).compile();

    provider = module.get<RepositoryProvider>(RepositoryProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
