import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DogsController } from './dogs/dogs.controller';
import { PostsModule } from './posts/posts.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts/posts.entity';

//@Module() 装饰器接收四个属性：providers、controllers、imports、exports
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 设置为全局
      envFilePath: [envConfig.path]
    }),
    TypeOrmModule.forRootAsync({ // 连接数据库，typeOrmModule是对数据库操作的封装
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity],  // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'),   // 用户名
        password: configService.get('DB_PASSWORD', 'liu.6632022'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    PostsModule],
  controllers: [AppController, DogsController],
  providers: [AppService],
})
export class AppModule { }
// 这是一个根模块，它将包含应用程序的所有其他模块。
// 提供了用来启动应用的引导机制，可以包含很多功能模块，比如数据库连接、中间件、全局模块等。
