export type Gender = "MALE" | "FEMALE" | "UNSPECIFIED";

export type Role = 'GUEST' | 'ADMIN' | 'USER';

// Pages Model
export interface Pages {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Users Model
export interface Users {
  id: string;
  email: string;
  password: string;
  username: string;
  gender: Gender;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  groups?: Group[]; // Optional relation
  userGroups?: UserGroup[]; // Optional relation
}

// Group Model
export interface Group {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Permission[]; // Optional relation
  users?: Users[]; // Optional relation
  userGroups?: UserGroup[]; // Optional relation
  groupPermissions?: GroupPermission[]; // Optional relation
}

// Permission Model
export interface Permission {
  id: string;
  action: string;
  resource: string;
  createdAt: Date;
  updatedAt: Date;
  groups?: Group[]; // Optional relation
  groupPermissions?: GroupPermission[]; // Optional relation
}

// UserGroup Model (Join Table)
export interface UserGroup {
  userId: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: Users; // Optional relation
  group?: Group; // Optional relation
}

// GroupPermission Model (Join Table)
export interface GroupPermission {
  groupId: string;
  permissionId: string;
  createdAt: Date;
  updatedAt: Date;
  group?: Group; // Optional relation
  permission?: Permission; // Optional relation
}

// Versions Model
export interface Versions {
  id: number;
  version: string;
  releaseDate: Date;
  changelog: string;
  createdAt: Date;
  updatedAt: Date;
}