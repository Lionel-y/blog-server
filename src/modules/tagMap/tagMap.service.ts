import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TagMap from 'src/db/entities/tagMap.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagMapService {
  constructor(
    @InjectRepository(TagMap) private tagMapRepo: Repository<TagMap>,
  ) {}

  async create(pid: string, tids: string[]) {
    const tagMaps = tids.map((tid) => {
      const tagMapItem = new TagMap();
      tagMapItem.pid = pid;
      tagMapItem.tid = tid;
      return tagMapItem;
    });
    return this.tagMapRepo.save(tagMaps);
  }
}
