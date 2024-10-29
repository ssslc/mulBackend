import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('list')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('add')
  create(): string {
    return 'This action adds a new item';
  }
}

// @Controller('items')
// export class ItemsController {
//   constructor(private readonly appService: AppService) {}

//   @Get('subProjects') // 路由映射为 /items/subProjects
//   findAll(): string {
//     return 'This action returns a # of items'
//   }
// }
