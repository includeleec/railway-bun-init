export interface ReqJson {
  created_at: number;
  type: string;
  data: CastData;
}

export interface CastData {
  object: string;
  hash: string;
  author: Author;
  thread_hash: string;
  parent_hash: null | string;
  parent_url: string;
  root_parent_url: string;
  parent_author: ParentAuthor;
  text: string;
  timestamp: string;
  embeds: any[];
  channel: Channel;
  reactions: Reactions;
  replies: Replies;
  mentioned_profiles: Record<string, any>[];
  author_channel_context: AuthorChannelContext;
  event_timestamp: string;
}

export interface Author {
  object: string;
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  profile: Record<string, any>;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: Record<string, any>;
  verified_accounts: any[];
  power_badge: boolean;
  experimental: Record<string, any>;
}

export interface ParentAuthor {
  fid: null | number;
}

export interface Channel {
  object: string;
  id: string;
  name: string;
  image_url: string;
}

export interface Reactions {
  likes_count: number;
  recasts_count: number;
  likes: any[];
  recasts: any[];
}

export interface Replies {
  count: number;
}

export interface AuthorChannelContext {
  role: string;
  following: boolean;
}
