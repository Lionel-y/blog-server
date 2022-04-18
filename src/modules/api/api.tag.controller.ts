import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FetchInfoResponseInterceptor } from 'src/interceptor/fetchInfoResponse.interceptor';
import { FetchListResponseInterceptor } from 'src/interceptor/fetchListResponse.interceptor';
import { OperationResponseInterceptor } from 'src/interceptor/operationResponse.interceptor';
import { CreateTagDto } from 'src/modules/tag/dto/create-tag.dto';
import { TagService } from 'src/modules/tag/tag.service';

type QueryType = 'brief' | 'detail';

@Controller('/api/tag')
export class ApiTagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseInterceptors(OperationResponseInterceptor)
  create(@Body() createTagDto: CreateTagDto) {
    console.log(createTagDto);
    return this.tagService.create(createTagDto);
  }

  @Get()
  @UseInterceptors(FetchListResponseInterceptor)
  getTags() {
    return this.tagService.getAll();
  }

  @Get(':tid')
  @UseInterceptors(FetchInfoResponseInterceptor)
  getTagInfo(@Param('tid') tid: string, @Query('type') type: QueryType) {
    const isBrief = type === 'brief';
    return this.tagService.getTagInfo(tid, isBrief);
  }

  @Get('/name/:tagName')
  @UseInterceptors(FetchInfoResponseInterceptor)
  getTagByName(@Param('tagName') tagName: string) {
    return this.tagService.getTagByName(tagName);
  }

  @Delete('/:tid')
  @UseInterceptors(OperationResponseInterceptor)
  DeleteTag(@Param('tid') tid: string) {
    return this.tagService.delete(tid);
  }
}
