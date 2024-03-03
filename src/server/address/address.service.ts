import { prisma } from '@/lib/prisma';
import {
  AddressDto,
  AddressMinimalDto,
  CreateUpdateAddressDto,
} from '@/shared/dtos/address.dto';

export class AddressService {
  async findAll(userId: string): Promise<AddressDto[]> {
    const addresses = await prisma.address.findMany({
      where: { userId },
      select: {
        id: true,
        nickname: true,
        contactName: true,
        phoneNumber: true,
        state: {
          select: {
            id: true,
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
        street: true,
        streetDetails: true,
        default: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return addresses.map((address) => {
      return {
        id: address.id,
        nickname: address.nickname,
        contactName: address.contactName,
        phoneNumber: address.phoneNumber,
        country: address.state.country,
        state: {
          id: address.state.id,
          name: address.state.name,
        },
        city: address.city,
        postalCode: address.postalCode,
        street: address.street,
        streetDetails: address.streetDetails,
        default: address.default,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      };
    });
  }

  async findAllMinimal(userId: string): Promise<AddressMinimalDto[]> {
    return prisma.address.findMany({
      where: { userId },
      select: {
        id: true,
        nickname: true,
        default: true,
      },
    });
  }

  async create(
    userId: string,
    data: CreateUpdateAddressDto,
  ): Promise<AddressDto> {
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
          nickname: true,
          contactName: true,
          phoneNumber: true,
          state: {
            select: {
              id: true,
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
      nickname: newAddress.nickname,
      contactName: newAddress.contactName,
      phoneNumber: newAddress.phoneNumber,
      country: newAddress.state.country,
      state: {
        id: newAddress.state.id,
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

  async update(
    id: string,
    userId: string,
    data: CreateUpdateAddressDto,
  ): Promise<AddressDto> {
    const updatedAddress = await prisma.$transaction(async (tx) => {
      if (data.default) {
        await tx.address.updateMany({
          where: { userId },
          data: { default: false },
        });
      }

      return tx.address.update({
        where: { id, userId },
        data,
        select: {
          id: true,
          nickname: true,
          contactName: true,
          phoneNumber: true,
          state: {
            select: {
              id: true,
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
      id: updatedAddress.id,
      nickname: updatedAddress.nickname,
      contactName: updatedAddress.contactName,
      phoneNumber: updatedAddress.phoneNumber,
      country: updatedAddress.state.country,
      state: {
        id: updatedAddress.state.id,
        name: updatedAddress.state.name,
      },
      city: updatedAddress.city,
      postalCode: updatedAddress.postalCode,
      street: updatedAddress.street,
      streetDetails: updatedAddress.streetDetails,
      default: updatedAddress.default,
      createdAt: updatedAddress.createdAt,
      updatedAt: updatedAddress.updatedAt,
    };
  }

  async exists(id: string, userId?: string): Promise<boolean> {
    const count = await prisma.address.count({ where: { id, userId } });
    return count > 0;
  }

  async delete(id: string) {
    await prisma.address.delete({ where: { id } });
  }
}
