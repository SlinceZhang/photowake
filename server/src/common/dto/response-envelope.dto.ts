import { ApiProperty } from '@nestjs/swagger';

export class ResponseEnvelopeDto<TData = unknown> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Request successful' })
  message!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2024-07-22T12:34:56.000Z',
  })
  timestamp!: string;

  data!: TData;
}
