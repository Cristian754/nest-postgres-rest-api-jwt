import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestWithUser } from './interface/request.with.user';
import { Role } from '../common/enums/roles.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto, @Body('password') password: string){
    return this.authService.register(password, registerDto)
  }

  @Get('profile')
  @Auth(Role.USER)
  profile(@Request() req: RequestWithUser){
    return this.authService.profile(req.user)
  }

}
