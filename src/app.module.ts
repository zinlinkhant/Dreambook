import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './typeorm/typeorm.config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { ChaptersModule } from './chapters/chapters.module';
import { ChapterProgressModule } from './chapter-progress/chapter-progress.module';
import { FavouriteModule } from './favourite/favourite.module';
import { InterestedCategoryModule } from './interested-category/interested-category.module';
import { CommentsModule } from './comments/comments.module';
import { HistoryModule } from './history/history.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';



@Module({
  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
   TypeOrmModule.forRoot(config),
    AuthModule,
    UsersModule,
    BooksModule,
    CategoriesModule,
    ChaptersModule,
    ChapterProgressModule,
    FavouriteModule,
    InterestedCategoryModule,
    CommentsModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [{
     provide: APP_GUARD,
     useClass: ThrottlerGuard,
   },AppService],
})
export class AppModule {}
