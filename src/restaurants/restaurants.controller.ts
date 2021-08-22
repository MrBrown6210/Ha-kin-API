import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { IRestaurant } from './restaurants.interface';

@Controller('restaurants')
@ApiTags('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<IRestaurant> {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Restaurant> {
    return this.restaurantsService.findOne(slug);
  }

  // @Patch(':slug')
  // update(
  //   @Param('slug') slug: string,
  //   @Body() updateRestaurantDto: UpdateRestaurantDto,
  // ): Promise<Restaurant> {
  //   return this.restaurantsService.update(slug, updateRestaurantDto);
  // }

  @Delete(':slug')
  @HttpCode(204)
  remove(@Param('slug') slug: string): Promise<void> {
    return this.restaurantsService.remove(slug);
  }
}
