export const Roles = {
  CLIENT: 'CLIENT',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;

export const Permissions = {
  VIEW_PRODUCT: 'view_product',
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  CREATE_CATEGORY: 'create_category',
  EDIT_CATEGORY: 'edit_category',
  DELETE_CATEGORY: 'delete_category',
  VIEW_SELLER_PANEL: 'view_seller_panel',
  VIEW_ADMIN_PANEL: 'view_admin_panel',
} as const;

export type RoleType = (typeof Roles)[keyof typeof Roles];
export type PermissionType = (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions: Record<RoleType, Set<PermissionType>> = {
  CLIENT: new Set([Permissions.VIEW_PRODUCT]),
  SELLER: new Set([
    Permissions.VIEW_PRODUCT,
    Permissions.CREATE_PRODUCT,
    Permissions.EDIT_PRODUCT,
    Permissions.DELETE_PRODUCT,
    Permissions.VIEW_SELLER_PANEL,
  ]),
  ADMIN: new Set([
    Permissions.VIEW_PRODUCT,
    Permissions.CREATE_PRODUCT,
    Permissions.EDIT_PRODUCT,
    Permissions.DELETE_PRODUCT,
    Permissions.CREATE_CATEGORY,
    Permissions.EDIT_CATEGORY,
    Permissions.DELETE_CATEGORY,
    Permissions.VIEW_SELLER_PANEL,
    Permissions.VIEW_ADMIN_PANEL,
  ]),
} as const;
