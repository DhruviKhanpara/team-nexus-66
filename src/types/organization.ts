export interface Organization {
  _id: string;
  name: string;
  slug: string;
  logo: { url: string | null; publicId: string | null };
  owner: string;
  createdAt: string;
}

export type MembershipScope = 'org' | 'team' | 'channel';
export type MembershipRole =
  | 'OrgOwner' | 'OrgAdmin' | 'OrgMember' | 'OrgGuest'
  | 'TeamOwner' | 'TeamMember' | 'TeamGuest'
  | 'ChannelModerator' | 'ChannelMember';

export interface Membership {
  _id: string;
  userId: string;
  organizationId?: string;
  teamId?: string;
  channelId?: string;
  scope: MembershipScope;
  role: MembershipRole;
  invitedBy?: string;
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string | null;
  organizationId: string;
  createdBy: string;
  avatar: { url: string | null; publicId: string | null };
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  memberCount: number;
  createdAt: string;
}

export type ChannelType = 'text' | 'announcement';

export interface Channel {
  _id: string;
  name: string;
  description: string | null;
  teamId: string;
  organizationId: string;
  createdBy: string;
  type: ChannelType;
  isPrivate: boolean;
  isArchived: boolean;
  memberCount: number;
  lastActivityAt: string;
  createdAt: string;
}
