import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @ApiProperty({ example: 'Cozy royale' })
  name: string;

  @IsArray()
  @ApiProperty({ example: ['burger', 'lunch', 'family'] })
  tags: string[];

  @IsNumber()
  @ApiProperty({ example: 300 })
  averageCost: number;

  @IsArray()
  @ApiProperty({
    example: [
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80',
      'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudCUyMGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1457460866886-40ef8d4b42a0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    ],
  })
  images: [string];

  @IsString()
  @ApiProperty({ example: '1-941-871-0498' })
  phoneNumber: string;

  @IsString()
  @ApiProperty({ example: '882 Dooley Row Suite 584' })
  address: string;

  @IsArray()
  @ApiProperty({ example: ['Home Delivery', 'WiFi'] })
  facilities: string[];
}
