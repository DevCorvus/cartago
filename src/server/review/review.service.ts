import { prisma } from '@/lib/prisma';
import { CreateUpdateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';

export class ReviewService {
  async findAll(productId: string, userId?: string): Promise<ReviewDto[]> {
    const reviews = await prisma.productReview.findMany({
      where: { productId },
      select: {
        id: true,
        userId: true,
        content: true,
        rating: true,
        edited: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fullname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map(({ userId: reviewUserId, ...review }) => {
      return { ...review, isOwner: reviewUserId === userId };
    });
  }

  async create(
    productId: string,
    userId: string,
    data: CreateUpdateReviewDto,
  ): Promise<ReviewDto> {
    const newReview = await prisma.productReview.create({
      data: { productId, userId, content: data.content, rating: data.rating },
      select: {
        id: true,
        content: true,
        rating: true,
        edited: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return { ...newReview, isOwner: true };
  }

  async update(id: string, data: CreateUpdateReviewDto): Promise<ReviewDto> {
    const updatedReview = await prisma.productReview.update({
      where: { id },
      data: { ...data, edited: true },
      select: {
        id: true,
        content: true,
        rating: true,
        edited: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return { ...updatedReview, isOwner: true };
  }

  async exists(id: string, userId: string): Promise<boolean> {
    const count = await prisma.productReview.count({ where: { id, userId } });
    return count > 0;
  }

  async userHasProductReview(userId: string, productId: string) {
    const count = await prisma.productReview.count({
      where: { userId, productId },
    });
    return count > 0;
  }
}
