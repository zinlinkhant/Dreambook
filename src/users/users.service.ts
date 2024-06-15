import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private firebaseService: FirebaseService,
  ) {}

  findAll(email: string) {
    return this.usersRepository.find({
      where: {
        email: email && email,
      },
    });
  }

  async findOne(id: number) {
    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async findOneWithEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async getLoginUserInfo(user: User) {
    return user;
  }

  async update(
    user: User,
    updateUserDto: UpdateUserDto,
    image: Express.Multer.File,
  ) {
    // await this.hasEmail(updateUserDto.email);
    // const user = await this.findOne(id);
    let profileImg = user.profileImg;
    if (image) {
      profileImg = await this.firebaseService.uploadFile(image);
      if (user.profileImg) {
        this.firebaseService.deleteFile(user.profileImg);
      }
    }
    if (updateUserDto.password) {
      const password = updateUserDto.password;
      const hash = await bcrypt.hash(password, 10);
      const updateUser = this.usersRepository.create({
        ...user,
        ...updateUserDto,
        profileImg,
        password: hash,
      });
      return this.usersRepository.save(updateUser);
    }

    const updateUser = this.usersRepository.create({
      ...user,
      ...updateUserDto,
      profileImg,
    });
    return this.usersRepository.save(updateUser);
  }

  async hasEmail(email: string) {
    const hasEmail = await this.findOneWithEmail(email);
    if (hasEmail) throw new ConflictException('Email has exist');
  }
}
