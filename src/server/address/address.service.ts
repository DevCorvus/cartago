import { prisma } from '@/lib/prisma';
import { AddressDto, CreateAddressDto } from '@/shared/dtos/address.dto';

export class AddressService {
  async create(userId: string, data: CreateAddressDto): Promise<AddressDto> {
    const newAddress = await prisma.$transaction(async (tx) => {
      if (data.default) {
        await tx.address.updateMany({
          where: { userId },
          data: { default: false },
        });
      }

      return tx.address.create({
        data: { userId, ...data },
        select: {
          id: true,
          contactName: true,
          phoneNumber: true,
          state: {
            select: {
              name: true,
              country: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          city: true,
          postalCode: true,
          default: true,
          street: true,
          streetDetails: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    return {
      id: newAddress.id,
      contactName: newAddress.contactName,
      phoneNumber: newAddress.phoneNumber,
      country: newAddress.state.country,
      state: {
        name: newAddress.state.name,
      },
      city: newAddress.city,
      postalCode: newAddress.postalCode,
      street: newAddress.street,
      streetDetails: newAddress.streetDetails,
      default: newAddress.default,
      createdAt: newAddress.createdAt,
      updatedAt: newAddress.updatedAt,
    };
  }
}
