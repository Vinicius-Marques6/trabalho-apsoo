import { Controller, Get } from '@nestjs/common';

@Controller('WeatherForecast')
export class WeatherForecastController {
  @Get()
  getWeather(): object[] {
    const summaries = [
      'Freezing',
      'Bracing',
      'Chilly',
      'Cool',
      'Mild',
      'Warm',
      'Balmy',
      'Hot',
      'Sweltering',
      'Scorching',
    ];

    const result = Array.from({ length: 5 }, (_, i) => {
      const temperatureC = Math.floor(Math.random() * 76) - 20;
      return {
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        temperatureC: temperatureC,
        temperatureF: 32 + Math.floor(temperatureC / 0.5556),
        summary: summaries[Math.floor(Math.random() * summaries.length)],
      };
    });
    return result;
  }
}
