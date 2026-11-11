export interface EditorialProfile {
  name: string;
  role: string;
  title: string;
  bio: string;
  expertise: string[];
}

export const EDITORIAL_PROFILES: Record<string, EditorialProfile> = {
  general: {
    name: "তথ্যবক্স সম্পাদকীয় টিম",
    role: "কন্টেন্ট রিসার্চ ও ভেরিফিকেশন ডেস্ক",
    title: "Totthobox Editorial Board",
    bio: "বাংলা ভাষা, উন্মুক্ত নাগরিক তথ্য ও ডিজিটাল ইউটিলিটি টুলসের সঠিকতা নিয়মিত নিরীক্ষণ ও হালনাগাদে নিয়োজিত বিশেষজ্ঞ টিম।",
    expertise: ["নাগরিক তথ্য", "গাণিতিক অ্যালগরিদম", "বাংলা প্রমিত বানান"],
  },
  tax: {
    name: "আর্থিক ও কর নীতি নিরীক্ষা সেল",
    role: "ট্যাক্স ও আর্থিক নীতি বিশ্লেষক",
    title: "Finance & Taxation Review Desk",
    bio: "জাতীয় রাজস্ব বোর্ড (NBR) এর অর্থ আইন, আয়কর অধ্যাদেশ ও ভ্যাট নির্দেশিকা অনুযায়ী তথ্য ও ক্যালকুলেটরের হিসাব যাচাইকারী।",
    expertise: ["আয়কর আইন", "এনবিআর স্ল্যাব", "ভ্যাট হিসাব", "মুদ্রা রূপান্তর"],
  },
  history: {
    name: "ঐতিহাসিক ও সাংস্কৃতিক গবেষণা ডেস্ক",
    role: "ইতিহাস ও ঐতিহ্য গবেষক",
    title: "History & Cultural Heritage Desk",
    bio: "মুক্তিযুদ্ধের দলিলপত্র, প্রত্নতাত্ত্বিক গবেষণা এবং সরকারি গেজেট ও জাতীয় আর্কাইভসের তথ্যের ভিত্তিতে প্রামাণ্যতা রক্ষাকারী।",
    expertise: ["মুক্তিযুদ্ধের ইতিহাস", "প্রত্নতত্ত্ব", "জাতীয় ঐতিহ্য", "বাংলাদেশের ভূগোল"],
  },
  islamic: {
    name: "ইসলামিক গবেষণা ও দাওয়াহ ডেস্ক",
    role: "ইসলামিক কন্টেন্ট নিরীক্ষক",
    title: "Islamic Content Verification Desk",
    bio: "পবিত্র কুরআন ও সিহাহ সিত্তাহ এর সহিহ হাদিসের মানদণ্ডে মাসনুন দোয়া ও মৌলিক জ্ঞান যাচাইকারী।",
    expertise: ["কুরআন ও হাদিস রেফারেন্স", "মাসনুন দোয়া", "ইসলামের আরকান"],
  },
  software: {
    name: "প্রযুক্তি ও সাইবার নিরাপত্তা সেল",
    role: "সফটওয়্যার ও নিরাপত্তা বিশ্লেষক",
    title: "Technology & Software Security Desk",
    bio: "শুধুমাত্র অফিশিয়াল ভেরিফায়েড সোর্স, ওপেন সোর্স রিপোজিটরি ও ভাইরাস-মুক্ত সফটওয়্যার লিংক নিশ্চিতকারী টিম।",
    expertise: ["সাইবার নিরাপত্তা", "ওপেন সোর্স লাইসেন্স", "বাংলা টাইপিং ও ফন্ট"],
  },
};

export function getEditorialProfile(category?: string): EditorialProfile {
  if (!category) return EDITORIAL_PROFILES.general;
  return EDITORIAL_PROFILES[category] || EDITORIAL_PROFILES.general;
}
