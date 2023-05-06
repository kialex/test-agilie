import { Controller, Get, Query } from '@nestjs/common';
import { ExchangerService } from './exchanger.service';

@Controller('exchanger')
export class ExchangerController {
  constructor(private readonly service: ExchangerService) {}

  @Get('rates')
  getRates(@Query('pairs') stringPairs: string) {
    return this.service.getRates(stringPairs);
  }
}
