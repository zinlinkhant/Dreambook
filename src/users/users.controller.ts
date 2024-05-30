import { Controller, Get, Body, Patch, Param, UseFilters, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeormExceptionFilter } from '../exceptionfilters/typeorm-exception.filter';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GROUP_USER } from '../utils/group.sealizer';

@Controller({ path: 'users', version: '1' })
@UseFilters(TypeormExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @UseGuards(JwtAuthGuard)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
