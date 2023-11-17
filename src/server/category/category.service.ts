import { prisma } from '@/lib/prisma';
import {
  CategoryTagDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { Category } from '@prisma/client';

export class CategoryService {
  findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  findAllTags(): Promise<CategoryTagDto[]> {
    return prisma.category.findMany({ select: { id: true, title: true } });
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
