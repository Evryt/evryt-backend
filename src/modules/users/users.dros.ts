import { ApiModelProperty } from '@nestjs/swagger';

export class UserRegistrationDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly session: string;
}

export class UserLoginDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly session: string;
}
