import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }


  findAll(
    email: string
  ) {
    // ? pagination
    return this.usersRepository.find({
      where: {
        email: email && email
      }
    });
  }

  async findOne(id: number) {
    return this.usersRepository.findOneOrFail({
      where: {
        id
      }
    });
  }

  async findOneWithEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email
      }
    });
  }

  async getLoginUserInfo(
    user: User
  ) {
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.hasEmail(updateUserDto.email);
    const user = await this.findOne(id);
    console.log(user);

    const updateUser = this.usersRepository.create({
      ...user,
      ...updateUserDto,
    });

    console.log(updateUser);

    return this.usersRepository.save(updateUser);
  }

  async hasEmail(email: string) {
    const hasEmail = await this.findOneWithEmail(email);
    if (hasEmail) throw new ConflictException('Email has exist');
  }
}
