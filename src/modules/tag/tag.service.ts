import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tag from 'src/db/entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = new Tag();
    tag.tag_name = createTagDto.tag_name;
    const ret = await this.tagRepo.insert(tag);
    return ret;
  }

  async getAll() {
    return await this.tagRepo.findAndCount();
  }
}
