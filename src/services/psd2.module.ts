import { Module } from '@nestjs/common';
import { PSD2Service } from './psd2.service';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: PSD2Service,
      useValue: new PSD2Service(),
    },
  ],
  exports: [PSD2Service],
})
export class PSD2Module {}
