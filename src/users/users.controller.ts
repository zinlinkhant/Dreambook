import { Controller, Get, Body, Patch, UseFilters, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeormExceptionFilter } from '../exceptionfilters/typeorm-exception.filter';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GROUP_USER } from '../utils/group.sealizer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'users', version: '1' })
@UseFilters(TypeormExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [GROUP_USER],
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }



  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    groups: [GROUP_USER]
  })
  @Get('me')
  getLoginUserInfo(
    @Request() req,
  ) {
    return this.usersService.getLoginUserInfo(req.user);
  }


  @Patch()
  @UseInterceptors(FileInterceptor('profileImg'))
  async update( @Request() req,@Body() updateUserDto: UpdateUserDto,@UploadedFile() image: Express.Multer.File,) {
    return this.usersService.update(req.user, updateUserDto,image);
  }
}
