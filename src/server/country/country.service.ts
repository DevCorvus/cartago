import { prisma } from '@/lib/prisma';
import { CountryDto } from '@/shared/dtos/country.dto';

export class CountryService {
  findAll(): Promise<CountryDto[]> {
    return prisma.country.findMany({
      select: {
        id: true,
        name: true,
        phoneCode: true,
        states: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.country.count({ where: { id } });
    return count > 0;
  }

  async stateExists(stateId: number, countryId?: string): Promise<boolean> {
    const count = await prisma.state.count({
      where: { id: stateId, countryId },
    });
    return count > 0;
  }
}
