export interface UserProfile {
  id: number;
  name: string;
  slug: string;
  email: string;
  profession: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string;
  division_id: number | null;
  district_id: number | null;
  thana_id: number | null;
  class_level_id: number | null;
  selected_role: string;
  roles: string[];
  division?: { id: number; name: string } | null;
  district?: { id: number; name: string } | null;
  thana?: { id: number; name: string } | null;
  class_level?: { id: number; name: string } | null;
  email_verified: boolean;
  created_at: string;
}

export interface PublicProfile {
  id: number;
  name: string;
  slug: string;
  profession: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string;
  roles: string[];
  class_level: string | null;
  division: string | null;
  district: string | null;
  thana: string | null;
  member_since: string;
  member_id: string;
  is_verified: boolean;
}

export interface SelectOption {
  id: number;
  name: string;
}