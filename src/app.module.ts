import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { Book } from './books/entities/book.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { ChaptersModule } from './chapters/chapters.module';
import { Chapter } from './chapters/entities/chapter.entity';
import { ChapterProgressModule } from './chapter-progress/chapter-progress.module';
import { ChapterProgress } from './chapter-progress/entities/chapter-progress.entity';
import { FavouriteModule } from './favourite/favourite.module';
import { Favourite } from './favourite/entities/favourite.entity';
import { InterestedCategoryModule } from './interested-category/interested-category.module';
import { InterestedCategory } from './interested-category/entities/interested-category.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensure that ConfigModule is globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User,Book,Category,Chapter,ChapterProgress,Favourite,InterestedCategory,Comment],
        synchronize: true, 
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    CategoriesModule,
    ChaptersModule,
    ChapterProgressModule,
    FavouriteModule,
    InterestedCategoryModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
