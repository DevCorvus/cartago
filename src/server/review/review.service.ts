import { prisma } from '@/lib/prisma';
import { CreateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';

export class ReviewService {
  async findAll(productId: string): Promise<ReviewDto[]> {
    return prisma.productReview.findMany({
      where: { productId },
      select: {
        content: true,
        rating: true,
        edited: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(
    productId: string,
    userId: string,
    data: CreateReviewDto,
  ): Promise<ReviewDto> {
    return prisma.productReview.create({
      data: { productId, userId, content: data.content, rating: data.rating },
      select: {
        content: true,
        rating: true,
        edited: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
