import { UserRole } from "./generated/prisma";

export function isAdmin(role?: UserRole) {
  return role === UserRole.ADMIN;
}

export function isDealer(role?: UserRole) {
  return role === UserRole.DEALER;
}

export function isUser(role?: UserRole) {
  return role === UserRole.USER;
}
