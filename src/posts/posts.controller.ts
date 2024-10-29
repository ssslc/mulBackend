import { CreatePostDto } from './dto/post.dto';
import { PostsService, PostsRo } from './posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  Post,
} from '@nestjs/common';

// @Controller('posts')
// export class PostsController {
//   constructor(private readonly postsService: PostsService) { }
// }
/**
 * @desc 创建文章
 */
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get('list')
  async findAll(@Query() query: any): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }

  @Post('createText')
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }
}