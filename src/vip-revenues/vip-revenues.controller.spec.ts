import { Test, TestingModule } from '@nestjs/testing';
import { VipRevenuesController } from './vip-revenues.controller';

describe('VipRevenuesController', () => {
  let controller: VipRevenuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VipRevenuesController],
    }).compile();

    controller = module.get<VipRevenuesController>(VipRevenuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
