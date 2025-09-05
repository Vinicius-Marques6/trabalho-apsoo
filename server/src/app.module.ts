import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherForecastController } from './weather/weatherForecast.controller';

@Module({
  imports: [],
  controllers: [AppController, WeatherForecastController],
  providers: [AppService],
})
export class AppModule {}
