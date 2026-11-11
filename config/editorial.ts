export interface EditorialProfile {
  name: string;
  role: string;
  title: string;
  bio: string;
  expertise: string[];
}

/**
 * These are editorial desk labels, not named people or claims of professional
 * accreditation. Add a real reviewer only when their identity and credentials
 * have been confirmed and approved by the site owner.
 */
export const EDITORIAL_PROFILES: Record<string, EditorialProfile> = {
  general: {
    name: "তথ্যবক্স সম্পাদকীয় দল",
    role: "লেখা প্রস্তুতি ও সম্পাদনা",
    title: "Totthobox Editorial Team",
    bio: "তথ্যবক্সের সম্পাদকীয় দল বাংলা ভাষায় তথ্য, ব্যাখ্যা ও ডিজিটাল সেবার সহায়ক নির্দেশনা প্রস্তুত করে। কোনো নির্দিষ্ট তথ্যের হালনাগাদ বা সংশোধনের অনুরোধ যোগাযোগ পাতায় জানানো যায়।",
    expertise: ["নাগরিক তথ্য", "বাংলা ভাষা", "ডিজিটাল টুলস"],
  },
  tax: {
    name: "তথ্যবক্স সম্পাদকীয় দল",
    role: "কর ও আর্থিক তথ্যের কনটেন্ট ডেস্ক",
    title: "Tax Information Desk",
    bio: "এই পাতার কর-সংক্রান্ত ব্যাখ্যা সাধারণ তথ্য হিসেবে প্রকাশিত। করের হার, ছাড় ও প্রযোজ্যতা নির্ধারণে সংশ্লিষ্ট অর্থ আইন এবং জাতীয় রাজস্ব বোর্ডের সর্বশেষ নির্দেশনা যাচাই করা প্রয়োজন।",
    expertise: ["আয়কর", "ভ্যাট", "আর্থিক হিসাব"],
  },
  history: {
    name: "তথ্যবক্স সম্পাদকীয় দল",
    role: "ইতিহাস ও ঐতিহ্য বিষয়ক কনটেন্ট ডেস্ক",
    title: "History Content Desk",
    bio: "ইতিহাস বিষয়ক নিবন্ধে রেফারেন্স ও উন্মুক্ত গবেষণা-উপকরণ ব্যবহার করার চেষ্টা করা হয়। নির্দিষ্ট ঘটনা বা তারিখের ক্ষেত্রে সংশ্লিষ্ট প্রাথমিক নথি ও গ্রন্থের সূত্র মিলিয়ে দেখা উচিত।",
    expertise: ["বাংলাদেশের ইতিহাস", "ঐতিহ্য", "ভূগোল"],
  },
  islamic: {
    name: "তথ্যবক্স সম্পাদকীয় দল",
    role: "ইসলামিক বিষয়ক কনটেন্ট ডেস্ক",
    title: "Islamic Content Desk",
    bio: "ধর্মীয় বিষয়বস্তু সাধারণ শিক্ষামূলক তথ্য হিসেবে দেওয়া হয়। দোয়া, হাদিসের মান, ফিকহি মতভেদ বা ব্যক্তিগত মাসআলা যাচাইয়ের জন্য মূল গ্রন্থ ও যোগ্য আলেমের পরামর্শ প্রয়োজন।",
    expertise: ["কুরআন", "হাদিস", "ইসলামের মৌলিক বিষয়"],
  },
  software: {
    name: "তথ্যবক্স সম্পাদকীয় দল",
    role: "প্রযুক্তি বিষয়ক কনটেন্ট ডেস্ক",
    title: "Software Information Desk",
    bio: "সফটওয়্যার পরিচিতি, বৈশিষ্ট্য ও ডাউনলোডের তথ্য প্রস্তুতে সংশ্লিষ্ট নির্মাতার অফিসিয়াল ওয়েবসাইটকে অগ্রাধিকার দেওয়া হয়। সংস্করণ ও লাইসেন্স পরিবর্তিত হতে পারে।",
    expertise: ["সফটওয়্যার", "ওপেন সোর্স", "ডিজিটাল নিরাপত্তা"],
  },
};

export function getEditorialProfile(category?: string): EditorialProfile {
  if (!category) return EDITORIAL_PROFILES.general;
  return EDITORIAL_PROFILES[category] || EDITORIAL_PROFILES.general;
}
