import { Test, TestingModule } from '@nestjs/testing';
import { WeatherForecastController } from './weatherForecast.controller';

describe('WeatherForecastController', () => {
  let controller: WeatherForecastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherForecastController],
    }).compile();

    controller = module.get<WeatherForecastController>(
      WeatherForecastController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
