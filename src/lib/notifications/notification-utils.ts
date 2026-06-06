export type NotificationTypeValue = "LEAD" | "QUOTE" | "INVENTORY" | "DEALER" | "SYSTEM";
export type NotificationRoleValue = "ADMIN" | "DEALER" | "USER";

export interface NotificationHrefInput {
  type: NotificationTypeValue | string;
  entityType?: string | null;
  entityId?: string | null;
  role?: NotificationRoleValue | string;
}

export function buildNotificationHref(notification: NotificationHrefInput) {
  if (notification.entityType === "Lead") {
    return notification.role === "ADMIN" && notification.entityId
      ? `/admin/leads/${notification.entityId}`
      : "/dealer/quotes";
  }

  if (notification.entityType === "Quote") {
    return notification.role === "ADMIN"
      ? "/admin/quotes"
      : "/dealer/quotes";
  }

  if (notification.entityType === "Inventory") {
    return "/admin/inventory";
  }

  if (notification.entityType === "Dealer") {
    return "/admin/dealers";
  }

  if (notification.entityType === "Compatibility") {
    return "/admin/compatibility";
  }

  return "/notifications";
}

export function getNotificationTypeLabel(type: NotificationTypeValue | string) {
  switch (type) {
    case "LEAD":
      return "Lead";
    case "QUOTE":
      return "Quote";
    case "INVENTORY":
      return "Inventory";
    case "DEALER":
      return "Dealer";
    case "SYSTEM":
    default:
      return "System";
  }
}
