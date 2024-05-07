import { RoleType } from './rbac';

export interface UserSession {
  id: string;
  name: string;
  role: RoleType;
  cartId: string;
}
