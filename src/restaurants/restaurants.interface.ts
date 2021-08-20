export interface IRestaurant {
  id: string;
  name: string;
  slug: string;
  stars: number;
  user?: {
    stars: number;
  };
  reviewers: number;
  tags: string[];
  averageCost: number;
  coverImageURL: string;
  images: string[];
  phoneNumber: string;
  address: string;
  facilities: string[];
}
