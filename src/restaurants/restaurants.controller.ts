import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { IRestaurant } from './restaurants.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { FavoriteRestaurantDto } from './dto/favorite-restaurant.dto';

@Controller('restaurants')
@ApiTags('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(AuthGuard())
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

  @Patch(':id/favorite')
  @HttpCode(201)
  @UseGuards(AuthGuard())
  favorite(
    @Param('id') id: string,
    @Body() favoriteRestaurantDto: FavoriteRestaurantDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { point } = favoriteRestaurantDto;
    return this.restaurantsService.favorite(id, point, user);
  }
}
