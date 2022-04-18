import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tag from 'src/db/entities/Tag.entity';
import TagMap from 'src/db/entities/TagMap.entity';
import { Repository } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @Inject(ArticleService)
    private articleService: ArticleService,
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    @InjectRepository(TagMap)
    private tagMapRepo: Repository<TagMap>,
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

  async getTagByName(tagName: string) {
    const ret = await this.tagRepo.findOne({ tag_name: tagName });
    return ret;
  }

  async getTagInfo(tid: string, isBrief: boolean) {
    const tag = await this.tagRepo.findOne({ tid });
    if (isBrief) {
      return tag;
    }
    const tagMaps = await this.tagMapRepo.find({ tid });

    const pids = tagMaps.map(({ pid }) => pid);
    const articles = await this.articleService.getMultiArticles(pids);
    return {
      ...tag,
      articles: articles || [],
    };
  }

  async delete(tid: string) {
    const ret = await this.tagRepo.delete({ tid });
    return ret;
  }
}
