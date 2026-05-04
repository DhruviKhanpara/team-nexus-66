export interface MyDetailDTO {
  id: string;
  email: string;
  name: string;
  iconUrl: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: { url: string | null; publicId: string | null };
  organizationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type Presence = "online" | "offline" | "away";
export type UserStatusType =
  | "active"
  | "busy"
  | "do_not_disturb"
  | "be_right_back"
  | "appear_away"
  | "appear_offline";

export interface UserStatus {
  _id: string;
  userId: string;
  presence: Presence;
  status: UserStatusType;
  statusMessage: string | null;
  lastSeenAt: string | null;
  activeSocketId: string | null;
}

//#region Value Objects
export interface MyDetailVO {
  id: string;
  email: string;
  name: string;
  iconUrl: string;
}
