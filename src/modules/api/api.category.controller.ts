import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FetchInfoResponseInterceptor } from 'src/interceptor/fetchInfoResponse.interceptor';
import { FetchListResponseInterceptor } from 'src/interceptor/fetchListResponse.interceptor';
import { OperationResponseInterceptor } from 'src/interceptor/operationResponse.interceptor';
import { CategoryService } from 'src/modules/category/category.service';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';
import { Roles } from '../auth/decorator/role.decorator';
import { ROLE } from '../auth/role.enum';

type QueryType = 'brief' | 'detail';

@Controller('/api/category')
export class ApiCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(ROLE.ADMIN)
  @UseInterceptors(OperationResponseInterceptor)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('/batchDelete')
  @Roles(ROLE.ADMIN)
  @UseInterceptors(OperationResponseInterceptor)
  batchDelete(@Body() data: { allDel: boolean; cids: string[] }) {
    const { cids, allDel } = data;
    return this.categoryService.batchDelete(cids, allDel);
  }

  @Get(':cid')
  @UseInterceptors(FetchInfoResponseInterceptor)
  getCategoryById(@Param('cid') cid: string, @Query('type') type: QueryType) {
    const isBrief = type === 'brief';
    return this.categoryService.getCategoryByCid(cid, isBrief);
  }

  @Get('/name/:category_name')
  @UseInterceptors(FetchInfoResponseInterceptor)
  getCategoryByName(
    @Param('category_name') category_name: string,
    @Query('type') type: QueryType,
  ) {
    const isBrief = type !== 'detail';
    return this.categoryService.getCategoryByName(category_name, isBrief);
  }

  @Get()
  @UseInterceptors(FetchListResponseInterceptor)
  getCategory() {
    return this.categoryService.getAll();
  }
}
