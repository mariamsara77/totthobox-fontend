import {
  Wrench,
  ArrowLeftRight,
  MapPin,
  Globe,
  BookOpen,
  Cpu,
  PhoneCall,
  ShieldAlert,
  Newspaper,
  Tv,
  Image as ImageIcon,
  Clock,
  Calculator,
  Percent,
  QrCode,
  Key,
  Type,
  Gauge,
  FileText,
  Edit3,
  Compass,
  Layers,
  DollarSign,
  Scale,
  Ruler,
  Box,
  Thermometer,
  Hourglass,
  Zap,
  HardDrive,
  CalendarDays,
  Calendar,
  Landmark,
  Building2,
  Award,
  Flag,
  CircleDollarSign,
  Heart,
  Sparkles,
  Monitor,
  Smartphone,
  Laptop,
  ShieldCheck,
  Flame,
  Truck,
  HeartHandshake,
  AlertTriangle,
  Radio,
  Volume2,
} from "lucide-react";
import type { CompactServiceItem } from "@/components/home/CategorySection";

export interface CatalogCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Wrench;
  iconColor: string;
  viewAllHref: string;
  items: CompactServiceItem[];
}

export const SERVICES_CATALOG: CatalogCategory[] = [
  // 1. Calculators & Utility Tools
  {
    id: "tools",
    title: "ক্যালকুলেটর ও ইউটিলিটি টুলস",
    subtitle: "দৈনন্দিন হিসাব, মাপজোখ ও অনলাইন ফটো এডিটিং টুলস",
    icon: Wrench,
    iconColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    viewAllHref: "/services#tools",
    items: [
      {
        href: "/tools/image-resizer",
        label: "ছবি রিসাইজার",
        icon: ImageIcon,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        badge: "টুল",
      },
      {
        href: "/tools/age-calculator",
        label: "বয়স ক্যালকুলেটর",
        icon: Clock,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/tools/tax-vat-calculator",
        label: "আয়কর ও ভ্যাট",
        icon: Calculator,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        badge: "এনবিআর",
      },
      {
        href: "/tools/percentage-calculator",
        label: "শতকরা হিসাব",
        icon: Percent,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        href: "/tools/qrcode-generator",
        label: "QR কোড তৈরি",
        icon: QrCode,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
      {
        href: "/tools/password-generator",
        label: "নিরাপদ পাসওয়ার্ড",
        icon: Key,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
      {
        href: "/tools/word-and-character-counter",
        label: "শব্দ ও অক্ষর গণক",
        icon: Type,
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/tools/internet-speed-test",
        label: "স্পিড টেস্ট",
        icon: Gauge,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        href: "/pdf-editor",
        label: "অনলাইন PDF",
        icon: FileText,
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        badge: "নতুন",
      },
      {
        href: "/tools/writing-practice",
        label: "হস্তলিপি চর্চা",
        icon: Edit3,
        color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      },
    ],
  },

  // 2. Smart Converters
  {
    id: "converters",
    title: "স্মার্ট কনভার্টার হাব",
    subtitle: "জমি, মুদ্রা, ওজন ও পরিমাপের নির্ভুল রূপান্তর",
    icon: ArrowLeftRight,
    iconColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    viewAllHref: "/services#converters",
    items: [
      {
        href: "/converter/land",
        label: "জমির পরিমাপ",
        icon: Layers,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        badge: "জনপ্রিয়",
      },
      {
        href: "/converter/number-to-word",
        label: "কথায় রূপান্তর",
        icon: FileText,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/converter/currency",
        label: "মুদ্রা রূপান্তর",
        icon: DollarSign,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/converter/weight",
        label: "ওজন পরিমাপ",
        icon: Scale,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        href: "/converter/length",
        label: "দৈর্ঘ্য রূপান্তর",
        icon: Ruler,
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/converter/area",
        label: "ক্ষেত্রফল রূপান্তর",
        icon: Box,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/converter/temperature",
        label: "তাপমাত্রা",
        icon: Thermometer,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
      {
        href: "/converter/time",
        label: "সময় গণনা",
        icon: Hourglass,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
      {
        href: "/converter/speed",
        label: "গতিবেগ",
        icon: Zap,
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      },
      {
        href: "/converter/data",
        label: "ডাটা স্টোরেজ",
        icon: HardDrive,
        color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
      },
    ],
  },

  // 3. Bangladesh Information & Services
  {
    id: "bangladesh",
    title: "বাংলাদেশ পরিচিতি ও ঐতিহ্য",
    subtitle: "ইতিহাস, পর্যটন, গুণীজন, প্রশাসন ও ক্যালেন্ডার",
    icon: MapPin,
    iconColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    viewAllHref: "/bangladesh/introduction",
    items: [
      {
        href: "/bangla/calendar",
        label: "বাংলা ক্যালেন্ডার",
        icon: Calendar,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        badge: "১৪৩২",
      },
      {
        href: "/bangla/holiday",
        label: "ছুটির তালিকা",
        icon: CalendarDays,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/bangladesh/introduction",
        label: "দেশ পরিচিতি",
        icon: Flag,
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/bangladesh/history",
        label: "ইতিহাস ও ঐতিহ্য",
        icon: Landmark,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/bangladesh/tourism",
        label: "দর্শনীয় পর্যটন",
        icon: Compass,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/bangladesh/establishment",
        label: "গুরুত্বপূর্ণ স্থাপনা",
        icon: Building2,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
      {
        href: "/bangladesh/public-figure",
        label: "জাতীয় গুণীজন",
        icon: Award,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
      {
        href: "/contact/police",
        label: "প্রশাসনিক সেবা",
        icon: PhoneCall,
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      },
    ],
  },

  // 4. World & International
  {
    id: "international",
    title: "বিশ্বকোষ ও আন্তর্জাতিক তথ্য",
    subtitle: "বিশ্বের দেশসমূহ, বিশ্ব ঘড়ি ও আন্তর্জাতিক ডায়ালিং কোড",
    icon: Globe,
    iconColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    viewAllHref: "/international/all-country",
    items: [
      {
        href: "/international/all-country",
        label: "বিশ্বের সকল দেশ",
        icon: Globe,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        badge: "২৫০+",
      },
      {
        href: "/international/world-clock",
        label: "বিশ্ব ঘড়ি",
        icon: Clock,
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/international/calling-codes",
        label: "ডায়ালিং কোড",
        icon: PhoneCall,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/international/crypto-forex",
        label: "ফরেক্স রেট",
        icon: CircleDollarSign,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
    ],
  },

  // 5. Islamic Knowledge
  {
    id: "islam",
    title: "ইসলামিক জ্ঞান ও আমল",
    subtitle: "কালেমা, নামাজের নিয়ম ও প্রয়োজনীয় দোয়া-কালাম",
    icon: BookOpen,
    iconColor: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
    viewAllHref: "/islam/basic",
    items: [
      {
        href: "/islam/basic",
        label: "মৌলিক জ্ঞান",
        icon: BookOpen,
        color: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
        badge: "দ্বীন",
      },
      {
        href: "/islam/dowan",
        label: "প্রয়োজনীয় দোয়া",
        icon: Sparkles,
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
      {
        href: "/islam/basic",
        label: "কালেমা ও অর্থ",
        icon: Heart,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/islam/basic",
        label: "নামাজের নিয়ম",
        icon: Compass,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    ],
  },

  // 6. Software & Utilities
  {
    id: "software",
    title: "সফটওয়্যার ও প্রযুক্তি হাব",
    subtitle: "উইন্ডোজ, অ্যান্ড্রয়েড, ম্যাক ও বাংলা ফন্ট প্যাকেজ",
    icon: Cpu,
    iconColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    viewAllHref: "/software/all",
    items: [
      {
        href: "/software/all",
        label: "সকল সফটওয়্যার",
        icon: Cpu,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/software/all/windows",
        label: "উইন্ডোজ অ্যাপ",
        icon: Monitor,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/software/all/android",
        label: "অ্যান্ড্রয়েড টুলস",
        icon: Smartphone,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/software/all/mac",
        label: "ম্যাক ও অ্যাপল",
        icon: Laptop,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
      {
        href: "/software/all/fonts",
        label: "বাংলা ফন্ট",
        icon: Type,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        badge: "ফ্রি",
      },
    ],
  },

  // 7. Emergency Helplines
  {
    id: "emergency",
    title: "জরুরি সেবা ও হটলাইন",
    subtitle: "জাতীয় জরুরি হেল্পলাইন ও সার্বক্ষণিক সহায়তা নম্বর",
    icon: PhoneCall,
    iconColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    viewAllHref: "/contact/police",
    items: [
      {
        href: "/contact/police",
        label: "জরুরি সেবা ৯৯৯",
        icon: ShieldAlert,
        color: "bg-red-500/10 text-red-600 dark:text-red-400",
        badge: "২৪/৭",
      },
      {
        href: "/contact/police",
        label: "ফায়ার সার্ভিস",
        icon: Flame,
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      },
      {
        href: "/contact/police",
        label: "অ্যাম্বুলেন্স",
        icon: Truck,
        color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
      {
        href: "/contact/police",
        label: "হাসপাতাল",
        icon: Building2,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        href: "/contact/police",
        label: "শিশু হেল্পলাইন",
        icon: HeartHandshake,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/contact/police",
        label: "নারী সহায়তা ১০৯",
        icon: ShieldCheck,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
    ],
  },

  // 8. Signs & Safety Rules
  {
    id: "signs",
    title: "সংকেত ও নিরাপত্তা নিয়ম",
    subtitle: "ট্রাফিক সাইন, স্বাস্থ্য সচেতনতা ও অগ্নিনির্বাপণ সংকেত",
    icon: ShieldAlert,
    iconColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    viewAllHref: "/signs/all",
    items: [
      {
        href: "/signs/trafik-sain",
        label: "ট্রাফিক সাইন",
        icon: AlertTriangle,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        badge: "বিআরটিএ",
      },
      {
        href: "/signs/emergency",
        label: "জরুরি সংকেত",
        icon: ShieldCheck,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/signs/agun",
        label: "অগ্নি সংকেত",
        icon: Flame,
        color: "bg-red-500/10 text-red-600 dark:text-red-400",
      },
      {
        href: "/signs/all",
        label: "সকল সংকেত",
        icon: ShieldAlert,
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      },
    ],
  },

  // 9. News Headlines (No-index safe)
  {
    id: "news",
    title: "সংবাদ শিরোনাম ও আপডেট",
    subtitle: "শীর্ষস্থানীয় জাতীয় দৈনিকের সর্বশেষ খবরের এক ঝলক",
    icon: Newspaper,
    iconColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    viewAllHref: "/news/headlines",
    items: [
      {
        href: "/news/headlines",
        label: "শীর্ষ খবর",
        icon: Newspaper,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        badge: "তাজা খবর",
      },
      {
        href: "/news/headlines",
        label: "জাতীয় সংবাদপত্র",
        icon: FileText,
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      },
      {
        href: "/news/headlines",
        label: "আন্তর্জাতিক খবর",
        icon: Globe,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/news/headlines",
        label: "মিডিয়া সোর্স",
        icon: Radio,
        color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      },
    ],
  },

  // 10. Live TV & Public Broadcast
  {
    id: "livetv",
    title: "লাইভ সম্প্রচার ও জাতীয় টিভি",
    subtitle: "রাষ্ট্রীয় টেলিভিশন ও তথ্য সম্প্রচার ডিরেক্টরি",
    icon: Tv,
    iconColor: "bg-red-500/10 text-red-600 dark:text-red-400",
    viewAllHref: "/live-tv",
    items: [
      {
        href: "/live-tv",
        label: "বিটিভি জাতীয়",
        icon: Tv,
        color: "bg-red-500/10 text-red-600 dark:text-red-400",
        badge: "লাইভ",
      },
      {
        href: "/live-tv",
        label: "সংসদ টেলিভিশন",
        icon: Radio,
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        href: "/live-tv",
        label: "বিটিভি ওয়ার্ল্ড",
        icon: Globe,
        color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
      {
        href: "/live-tv",
        label: "বাংলাদেশ বেতার",
        icon: Volume2,
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    ],
  },
];
