import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly passwordHash: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly cipheredPrivateKey: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly pubkey: string;
}
