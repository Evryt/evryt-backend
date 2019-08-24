import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './users.dtos';
import { randomBytes } from 'crypto';
import { SHA256, enc } from 'crypto-js';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UserRegistrationDro } from './users.dros';

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
}
