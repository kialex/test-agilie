import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KrakenConfig {
  constructor(private configService: ConfigService) {}

  /**
   * @return {string}
   */
  get host(): string {
    return this.configService.getOrThrow('KRAKEN_WS_HOST');
  }
}
