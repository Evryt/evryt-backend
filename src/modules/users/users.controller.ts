import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto, LoginUserDto } from './users.dtos';
import { randomBytes } from 'crypto';
import { SHA256, enc } from 'crypto-js';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UserRegistrationDro, UserLoginDro } from './users.dros';
import { PayloadError, AuthorizationError } from 'src/utils/responses';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiResponse({ status: 201, type: UserRegistrationDro })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const session = SHA256(randomBytes(64).toString('utf8')).toString(enc.Hex);
    await this.usersService.create({ ...registerUserDto, session });
    return { error: false, session };
  }

  @Post('login')
  @ApiResponse({ status: 201, type: UserLoginDro })
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 401, type: AuthorizationError })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);

    if (!user) {
      return new PayloadError('User with given email does not exist');
    }
    const areCredentialsValid = user.passwordHash === loginUserDto.passwordHash;
    if (!areCredentialsValid) {
      return new AuthorizationError('Invalid credentials');
    }

    const session = SHA256(randomBytes(64).toString('utf8')).toString(enc.Hex);

    await this.usersService.updateUsersSession(user.email, session);

    return { error: false, session };
  }
}
