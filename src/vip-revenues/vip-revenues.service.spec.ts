import { Test, TestingModule } from '@nestjs/testing';
import { VipRevenuesService } from './vip-revenues.service';

describe('VipRevenuesService', () => {
  let service: VipRevenuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VipRevenuesService],
    }).compile();

    service = module.get<VipRevenuesService>(VipRevenuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
