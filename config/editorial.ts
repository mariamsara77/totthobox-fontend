export interface EditorialProfile {
  name: string;
  role: string;
  title: string;
  bio: string;
  expertise: string[];
}

/**
 * TODO(owner): Supply actual author/editor identities, approved short bios,
 * reviewer names and verified expertise for each category. Do not publish
 * generic team labels, fictional people or unverified credentials.
 */
export const EDITORIAL_PROFILES: Record<string, EditorialProfile> = {
  general: { name: "", role: "", title: "", bio: "", expertise: [] },
  tax: { name: "", role: "", title: "", bio: "", expertise: [] },
  history: { name: "", role: "", title: "", bio: "", expertise: [] },
  islamic: { name: "", role: "", title: "", bio: "", expertise: [] },
  software: { name: "", role: "", title: "", bio: "", expertise: [] },
};

export function getEditorialProfile(category?: string): EditorialProfile {
  if (!category) return EDITORIAL_PROFILES.general;
  return EDITORIAL_PROFILES[category] || EDITORIAL_PROFILES.general;
}
