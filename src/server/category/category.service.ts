import { prisma } from '@/lib/prisma';
import { CreateUpdateCategoryDto } from '@/shared/dtos/category.dto';
import { Category } from '@prisma/client';

export class CategoryService {
  findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  create(data: CreateUpdateCategoryDto): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  update(id: number, data: CreateUpdateCategoryDto): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }
}
