import { prisma } from '@/lib/prisma';
import {
  CategoryTagDto,
  CategoryWithProducts,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';

export class CategoryService {
  findAllTags(): Promise<CategoryTagDto[]> {
    return prisma.category.findMany({ select: { id: true, title: true } });
  }

  async findByIdWithProducts(id: number): Promise<CategoryWithProducts | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: {
              take: 1,
              select: {
                path: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  create(data: CreateUpdateCategoryDto): Promise<CategoryTagDto> {
    return prisma.category.create({
      data,
      select: {
        id: true,
        title: true,
      },
    });
  }

  update(id: number, data: CreateUpdateCategoryDto): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }
}
