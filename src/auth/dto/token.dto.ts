import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYnJvd25pZSBrdW5nIiwiZW1haWwiOiJ1c2VyMUBnbWFpbC5jb20iLCJpYXQiOjE2MjkzOTcyNjN9.ngLiwLRmEstmcFMAoK532cKGTucA8VAglnfrjUa_ABC',
  })
  @IsString()
  accessToken: string;
}
