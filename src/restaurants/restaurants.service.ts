import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Facility, Restaurant, Tag, User } from '@prisma/client';
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

  async convertToRestaurantInterface(
    restaurant: Restaurant & {
      facilities: Facility[];
      tags: Tag[];
    },
    user?: User,
  ): Promise<IRestaurant> {
    const favorite = await this.countFavoritesRestaurant(restaurant);

    const result: IRestaurant = {
      ...restaurant,
      tags: restaurant.tags.map((tag) => tag.title),
      facilities: restaurant.facilities.map((facility) => facility.title),
      stars: favorite.averagePoint,
      reviewers: favorite.count,
      coverImageURL: restaurant.images[0],
    };

    if (user) {
      const point = await this.getFavoritePoint(restaurant, user);
      result.user = { stars: point };
    }

    return result;
  }

  async findSlugUnique(slug: string): Promise<string> {
    const count = await this.prismaService.restaurant.count({
      where: {
        slug: {
          startsWith: slug,
        },
      },
    });
    if (count < 1) return slug;
    return `${slug}-${count}`;
  }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<IRestaurant> {
    const { name, tags, facilities } = createRestaurantDto;
    const slug = await this.findSlugUnique(slugify(name));
    console.log(slug);
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

    return this.convertToRestaurantInterface(restaurant);
  }

  async findAll(): Promise<IRestaurant[]> {
    const restaurants = await this.prismaService.restaurant.findMany({
      include: {
        tags: true,
        facilities: true,
      },
    });
    const restaurantsInterface = await Promise.all(
      restaurants.map((restaurant) =>
        this.convertToRestaurantInterface(restaurant),
      ),
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

  async favorite(id: string, point: number, user: User) {
    try {
      const restaurant = await this.prismaService.restaurant.update({
        where: {
          id,
        },
        data: {
          favorites: {
            upsert: {
              where: {
                userId_restaurantId: {
                  userId: user.id,
                  restaurantId: id,
                },
              },
              create: {
                userId: user.id,
                point,
              },
              update: {
                point,
              },
            },
          },
        },
      });
      if (!restaurant) throw new NotFoundException();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException();
        console.error(error.code);
      }
    }
  }

  async countFavoritesRestaurant(
    restaurant: Restaurant,
  ): Promise<{ count: number; averagePoint: number }> {
    const favorites = await this.prismaService.favorite.aggregate({
      _avg: {
        point: true,
      },
      _count: true,
      where: {
        restaurantId: restaurant.id,
      },
    });

    return { count: favorites._count, averagePoint: favorites._avg.point || 0 };
  }

  async getFavoritePoint(restaurant: Restaurant, user: User): Promise<number> {
    const favorite = await this.prismaService.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId: restaurant.id,
        },
      },
    });
    return favorite.point;
  }
}
