import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TagMap from 'src/db/entities/tagMap.entity';
import { TagMapService } from './tagMap.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagMap])],
  exports: [TagMapService],
  providers: [TagMapService],
  controllers: [],
})
export class TagMapModule {}
