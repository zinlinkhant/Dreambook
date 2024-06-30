import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseFilters, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormExceptionFilter } from '../exceptionfilters/typeorm-exception.filter';
import { AuthDto } from './dto/auth.dto';
import { GROUP_USER } from '../utils/group.sealizer';

@Controller({ path: 'auth', version: '1' })
@UseFilters(TypeormExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

   
  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    groups: [GROUP_USER]
  })
  signIn(
    @Body() authDto: AuthDto
  ) {
    return this.authService.signIn(authDto);
  }
}
