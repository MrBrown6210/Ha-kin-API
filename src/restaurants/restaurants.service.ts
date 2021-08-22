import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Facility, Restaurant, Tag } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { IRestaurant } from './restaurants.interface';
import {} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class RestaurantsService {
  constructor(private prismaService: PrismaService) {}

  convertToRestaurantInterface(
    restaurant: Restaurant & {
      facilities: Facility[];
      tags: Tag[];
    },
  ): IRestaurant {
    return {
      ...restaurant,
      tags: restaurant.tags.map((tag) => tag.title),
      facilities: restaurant.facilities.map((facility) => facility.title),
      stars: 0,
      reviewers: 0,
      coverImageURL: restaurant.images[0],
    };
  }

  async findSlugUnique(slug: string): Promise<string> {
    const count = await this.prismaService.restaurant.count({
      where: {
        slug,
      },
    });
    if (count < 1) return slug;
    return `${slug}-${count}`;
  }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<IRestaurant> {
    const { name, tags, facilities } = createRestaurantDto;
    const slug = await this.findSlugUnique(slugify(name));
    const insertTags = tags.map((tag) => {
      return {
        where: {
          title: tag,
        },
        create: {
          title: tag,
        },
      };
    });
    const insertFacilities = facilities.map((facility) => {
      return {
        where: {
          title: facility,
        },
        create: {
          title: facility,
        },
      };
    });
    const restaurant = await this.prismaService.restaurant.create({
      data: {
        slug,
        ...createRestaurantDto,
        tags: {
          connectOrCreate: insertTags,
        },
        facilities: {
          connectOrCreate: insertFacilities,
        },
      },
      include: {
        tags: true,
        facilities: true,
      },
    });
    // restaurant.
    return this.convertToRestaurantInterface(restaurant);
  }

  async findAll(): Promise<IRestaurant[]> {
    const restaurants = await this.prismaService.restaurant.findMany({
      include: {
        tags: true,
        facilities: true,
      },
    });
    const restaurantsInterface = restaurants.map((restaurant) =>
      this.convertToRestaurantInterface(restaurant),
    );
    return restaurantsInterface;
  }

  async findOne(slug: string): Promise<IRestaurant> {
    const restaurant = await this.prismaService.restaurant.findUnique({
      where: {
        slug,
      },
      include: {
        tags: true,
        facilities: true,
      },
    });
    if (!restaurant) throw new NotFoundException();
    return this.convertToRestaurantInterface(restaurant);
  }

  //   async update(
  //     slug: string,
  //     updateRestaurantDto: UpdateRestaurantDto,
  //   ): Promise<Restaurant> {
  //     const { name } = updateRestaurantDto;
  //     const restaurant = await this.prismaService.restaurant.update({
  //       where: {
  //         slug,
  //       },
  //       data: {
  //         name,
  //       },
  //     });
  //     return restaurant;
  //   }

  async remove(slug: string) {
    try {
      const restaurant = await this.prismaService.restaurant.delete({
        where: {
          slug,
        },
      });
      if (!restaurant) throw new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
