import { Module } from '@nestjs/common';
import { EXCHANGER_SERVICE } from './exchanger.interface';
import { KrakenService } from './kraken/kraken.service';
import { ExchangerService } from './exchanger.service';
import { ExchangerController } from './exchanger.controller';
import { KrakenConfig } from './kraken/kraken-config';

@Module({
  controllers: [ExchangerController],
  providers: [
    ExchangerService,
    KrakenConfig,
    {
      useClass: KrakenService,
      provide: EXCHANGER_SERVICE,
    },
  ],
  exports: [ExchangerService],
})
export class ExchangerModule {}
