import { Module } from '@nestjs/common';
import { ColabsController } from './colabs.controller';
import { ColabsService } from './colabs.service';

@Module({
  controllers: [ColabsController],
  providers: [ColabsService]
})
export class ColabsModule {}
