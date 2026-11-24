export type EstablishmentReaction = {
  like_count: number;
  dislike_count: number;
  user_has_liked: boolean;
  user_has_disliked: boolean;
};

export type EstablishmentImage = {
  url: string;
  caption?: string | null;
};

export type Establishment = {
  id: number;
  title: string;
  slug: string;

  type?: string | null;
  type_label?: string | null;

  description?: string | null;

  image_url?: string | null;

  images?: EstablishmentImage[];

  thana?: string | null;
  district?: string | null;
  division?: string | null;

  views_count?: number;

  reactions?: EstablishmentReaction;

  created_at?: string | null;
  updated_at?: string | null;
};