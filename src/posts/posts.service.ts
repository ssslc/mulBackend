import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

export interface PaginationQuery {
  pageNum?: number;
  pageSize?: number;
  [key: string]: any; // 允许其他任意属性
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) { }

  // 创建文章
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }

  // 获取文章列表
  async findAll(query: PaginationQuery): Promise<PostsRo> {
    const qb = this.postsRepository.createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id: number): Promise<any> {
    return await this.postsRepository.findOne({ where: { id } }) || {};
  }

  // 更新文章
  async updateById(id: number, post: Partial<PostsEntity>): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id: number) {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}



// 注意创建顺序： 先创建Module, 再创建Controller和Service,
// 这样创建出来的文件在Module中自动注册，
// 反之，后创建Module, Controller和Service,
// 会被注册到外层的app.module.ts