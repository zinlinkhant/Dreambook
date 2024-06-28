import { Book } from "src/books/entities/book.entity";
import { Category } from "src/categories/entities/category.entity";
import { ChapterProgress } from "src/chapter-progress/entities/chapter-progress.entity";
import { Chapter } from "src/chapters/entities/chapter.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Favourite } from "src/favourite/entities/favourite.entity";
import { History } from "src/history/entities/history.entitiy";
import { InterestedCategory } from "src/interested-category/entities/interested-category.entity";
import { User } from "src/users/entities/user.entity";
import { ModeEnum } from "src/utils/mode.enum";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
const sslReject = process.env.MODE === ModeEnum.Production ? {
  ssl: {
    rejectUnauthorized: false,
  },
} 
: null;
const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User, Book, Category, Chapter, ChapterProgress, Favourite, InterestedCategory, Comment , History
  ],
  ...sslReject,
  synchronize: true,
};
export default config;