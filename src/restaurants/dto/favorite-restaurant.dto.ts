import { IsNumber } from 'class-validator';

export class FavoriteRestaurantDto {
  @IsNumber()
  point: number;
}
