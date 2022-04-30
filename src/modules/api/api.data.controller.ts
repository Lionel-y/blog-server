import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { ROLE } from '../auth/role.enum';
import { BlogDataService } from '../blogData/blogData.service';

@Roles(ROLE.ADMIN)
@Controller('/api/data')
export default class ApiDataController {
  constructor(private readonly blogDataService: BlogDataService) {}

  @UseGuards()
  @Get('/card')
  getCardInfo() {
    return this.blogDataService.getCardData();
  }

  @UseGuards()
  @Get('/chart')
  getChartInfo() {
    return this.blogDataService.getChartData();
  }

  @UseGuards()
  @Get('/contribute')
  getContributeInfo() {
    return this.blogDataService.getContributeData();
  }
}
