import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../auth/guard/jwt.guard';
import { BlogDataService } from '../blogData/blogData.service';

@Controller('/api/data')
export default class ApiDataController {
  constructor(private readonly blogDataService: BlogDataService) {}

  @UseGuards(AdminJwtGuard)
  @Get('/card')
  getCardInfo() {
    return this.blogDataService.getCardData();
  }

  @UseGuards(AdminJwtGuard)
  @Get('/chart')
  getChartInfo() {
    return this.blogDataService.getChartData();
  }

  @UseGuards(AdminJwtGuard)
  @Get('/contribute')
  getContributeInfo() {
    return this.blogDataService.getContributeData();
  }
}
