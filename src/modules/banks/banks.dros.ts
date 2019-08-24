import { ApiModelProperty } from '@nestjs/swagger';

class Bank {
  @ApiModelProperty({ example: 'Alior Bank' })
  readonly name: string;

  @ApiModelProperty({ example: 'api.aliorbank.pl' })
  readonly apiUrl: string;

  @ApiModelProperty({ example: 'aliorbank.pl' })
  readonly panelUrl: string;

  @ApiModelProperty({
    example: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
  })
  readonly appID: string;
}
export class GetAllBanksDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty({ type: [Bank] })
  readonly integratedBanks: Bank[];
}

export class GetBankAppIDDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly appID: string;
}
