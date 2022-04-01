import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { FetchListResponseInterceptor } from 'src/interceptor/fetchListResponse.interceptor';
import { OperationResponseInterceptor } from 'src/interceptor/operationResponse.interceptor';
import { CreateTagDto } from 'src/modules/tag/dto/create-tag.dto';
import { TagService } from 'src/modules/tag/tag.service';

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
}
