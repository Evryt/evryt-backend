import { ApiModelProperty } from '@nestjs/swagger';

export class PayloadError {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly code: number;

  @ApiModelProperty()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class AuthorizationError {
  @ApiModelProperty()
  readonly code: number = 401;

  @ApiModelProperty()
  readonly error: boolean = true;

  @ApiModelProperty()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class NoErrorResponse {
  @ApiModelProperty()
  readonly error: boolean;
}
