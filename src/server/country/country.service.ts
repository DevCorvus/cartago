import { prisma } from '@/lib/prisma';
import { CountryDto } from '@/shared/dtos/country.dto';

export class CountryService {
  findAll(): Promise<CountryDto[]> {
    return prisma.country.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.country.count({ where: { id } });
    return count > 0;
  }
}
