import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FetchInfoResponseInterceptor } from 'src/interceptor/fetchInfoResponse.interceptor';
import { FetchListResponseInterceptor } from 'src/interceptor/fetchListResponse.interceptor';
import { OperationResponseInterceptor } from 'src/interceptor/operationResponse.interceptor';
import { CategoryService } from 'src/modules/category/category.service';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';

@Controller('/api/category')
export class ApiCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseInterceptors(OperationResponseInterceptor)
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
  @Post('/batchDelete')
  @UseInterceptors(OperationResponseInterceptor)
  batchDelete(@Body() data: { allDel: boolean; cids: string[] }) {
    const { cids, allDel } = data;
    return this.categoryService.batchDelete(cids, allDel);
    // console.log(cids);
  }
  @Get(':cid')
  getCategoryById(@Param('cid') cid: string) {
    console.log(cid);
    return cid;
  }

  @Get('/name/:category_name')
  @UseInterceptors(FetchInfoResponseInterceptor)
  getCategoryByName(@Param('category_name') category_name: string) {
    return this.categoryService.getCategoryByName(category_name);
  }
  @UseInterceptors(FetchListResponseInterceptor)
  @Get()
  getCategory() {
    return this.categoryService.getAll();
  }
}
