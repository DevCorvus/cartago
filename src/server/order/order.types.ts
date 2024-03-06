export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type ShipmentStatus =
  | 'PENDING'
  | 'PRE_TRANSIT'
  | 'IN_TRANSIT'
  | 'DELAYED'
  | 'OUT_FOR_DELIVERY'
  | 'FAILED_ATTEMPT'
  | 'DELIVERED'
  | 'PICKUP_READY'
  | 'RETURNED'
  | 'EXCEPTION'
  | 'FAILED';
