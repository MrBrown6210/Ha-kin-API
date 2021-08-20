import { Injectable } from '@nestjs/common';
import { Restaurant } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { IRestaurant } from './restaurants.interface';
import {} from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prismaService: PrismaService) {}

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
    return {
      ...restaurant,
      tags: restaurant.tags.map((tag) => tag.title),
      facilities: restaurant.facilities.map((facility) => facility.title),
      stars: 0,
      reviewers: 0,
      coverImageURL: restaurant.images[0],
    };
  }

  //   async findAll(): Promise<Restaurant[]> {
  //     const restaurants = await this.prismaService.restaurant.findMany();
  //     return restaurants;
  //   }

  //   async findOne(slug: string): Promise<Restaurant> {
  //     const restaurant = await this.prismaService.restaurant.findUnique({
  //       where: {
  //         slug,
  //       },
  //     });
  //     return restaurant;
  //   }

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

  //   async remove(slug: string) {
  //     await this.prismaService.restaurant.delete({
  //       where: {
  //         slug,
  //       },
  //     });
  //   }
}
