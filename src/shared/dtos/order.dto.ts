import { OrderStatus } from '@/server/order/order.types';
import { ProductImageDto } from './product.dto';

export interface OrderItemDto {
  title: string;
  description: string;
  amount: number;
  price: number;
  image: ProductImageDto;
}

export interface OrderDto {
  id: string;
  total: number;
  status: OrderStatus;
  items: OrderItemDto[];
  createdAt: Date;
}
