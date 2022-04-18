import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TagMap from 'src/db/entities/TagMap.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagMapService {
  constructor(
    @InjectRepository(TagMap) private tagMapRepo: Repository<TagMap>,
  ) {}

  async create(pid: string, tags: string[]) {
    const tagMaps = tags.map((tag) => {
      const tagMapItem = new TagMap();
      tagMapItem.pid = pid;
      tagMapItem.tid = tag;
      return tagMapItem;
    });
    return this.tagMapRepo.save(tagMaps);
  }
}
