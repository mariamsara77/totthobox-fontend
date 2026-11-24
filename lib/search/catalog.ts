import type { SearchItem } from "@/types/search";

export interface CatalogItem {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  url: string;
  type: string;
  icon?: string;
  color?: string;
  keywords: string[];
}

export const PLATFORM_SEARCH_CATALOG: CatalogItem[] = [
  // --- ONLINE TOOLS ---
  {
    id: "tool-age",
    title: "বয়স ক্যালকুলেটর",
    subtitle: "সঠিক বয়স, মাস, দিন, ঘণ্টা ও পরবর্তী জন্মদিনের নিখুঁত হিসাব",
    label: "টুলস",
    url: "/tools/age-calculator",
    type: "tool",
    icon: "calendar",
    color: "blue",
    keywords: [
      "বয়স", "ক্যালকুলেটর", "জন্ম তারিখ", "জন্মদিন", "বয়স নির্ণয়", "বয়স গণক",
      "age", "calculator", "boyos", "calc", "birthday", "birth date", "jonmodin", "age calculator"
    ],
  },
  {
    id: "tool-tax",
    title: "আয়কর ও ভ্যাট গণক",
    subtitle: "এনবিআর ২০২৪-২৫ অর্থবছর অনুযায়ী কর ও ভ্যাট নির্ধারণ",
    label: "টুলস",
    url: "/tools/tax-vat-calculator",
    type: "tool",
    icon: "calculator",
    color: "emerald",
    keywords: [
      "আয়কর", "ভ্যাট", "কর", "ট্যাক্স", "এনবিআর", "রিটার্ন", "কর গণক", "ট্যাক্স ক্যালকুলেটর",
      "tax", "vat", "income tax", "nbr", "aykor", "tax calculator", "vat calculator"
    ],
  },
  {
    id: "tool-resizer",
    title: "ছবি ও স্বাক্ষর রিসাইজার",
    subtitle: "সরকারি চাকরি ও ভর্তির নির্ধারিত ৩০০×৩০০ পিক্সেল ছবি ও স্বাক্ষর রূপান্তর",
    label: "টুলস",
    url: "/tools/image-resizer",
    type: "tool",
    icon: "photo",
    color: "purple",
    keywords: [
      "ছবি রিসাইজার", "স্বাক্ষর", "৩০০x৩০০", "চাকরি ছবি", "ফটো রিসাইজ", "ইমেজ রিসাইজার",
      "image resizer", "photo resizer", "resize", "300x300", "signature", "chobi resize", "shakkhor"
    ],
  },
  {
    id: "tool-speed",
    title: "ইন্টারনেট স্পিড টেস্ট",
    subtitle: "রিয়েল-টাইম ব্যান্ডউইথ ডাউনলোড ও আপলোড স্পিড পরীক্ষা",
    label: "টুলস",
    url: "/tools/internet-speed-test",
    type: "tool",
    icon: "wifi",
    color: "amber",
    keywords: [
      "ইন্টারনেট স্পিড", "স্পিড টেস্ট", "নেট গতি", "ব্যান্ডউইথ", "এমবিপিএস",
      "speed test", "internet speed", "net speed", "bandwidth", "mbps", "ping"
    ],
  },
  {
    id: "tool-password",
    title: "পাসওয়ার্ড জেনারেটর",
    subtitle: "শক্তিশালী ও নিরাপদ পাসওয়ার্ড তাৎক্ষণিক তৈরি করুন",
    label: "টুলস",
    url: "/tools/password-generator",
    type: "tool",
    icon: "key",
    color: "rose",
    keywords: [
      "পাসওয়ার্ড", "পাসওয়ার্ড জেনারেটর", "নিরাপদ পাসওয়ার্ড", "সিকিউরিটি",
      "password", "password generator", "strong password", "security", "pass"
    ],
  },
  {
    id: "tool-percentage",
    title: "শতকরা ক্যালকুলেটর",
    subtitle: "যেকোনো সংখ্যার শতকরা, বৃদ্ধি ও হ্রাসের সহজ হিসাব",
    label: "টুলস",
    url: "/tools/percentage-calculator",
    type: "tool",
    icon: "calculator",
    color: "indigo",
    keywords: [
      "শতকরা", "পার্সেন্টেজ", "শতাংশ", "শতকরা হিসাব",
      "percentage", "percent", "shotkora", "percentage calculator"
    ],
  },
  {
    id: "tool-qrcode",
    title: "কিউআর কোড জেনারেটর",
    subtitle: "যেকোনো টেক্সট বা লিংকের জন্য কাস্টম QR কোড তৈরি করুন",
    label: "টুলস",
    url: "/tools/qrcode-generator",
    type: "tool",
    icon: "qr-code",
    color: "cyan",
    keywords: [
      "কিউআর কোড", "বারকোড", "কিউআর জেনারেটর", "লিংক কিউআর",
      "qr code", "qr", "qrcode generator", "barcode"
    ],
  },
  {
    id: "tool-word-count",
    title: "শব্দ ও অক্ষর কাউন্টার",
    subtitle: "বাংলা ও ইংরেজি অনুচ্ছেদের শব্দ, অক্ষর ও পড়ার সময় গণনা",
    label: "টুলস",
    url: "/tools/word-and-character-counter",
    type: "tool",
    icon: "document-text",
    color: "teal",
    keywords: [
      "শব্দ গণক", "অক্ষর গণক", "ওয়ার্ড কাউন্টার", "প্যারাগ্রাফ কাউন্ট",
      "word counter", "character counter", "word count", "shobdo gonona"
    ],
  },
  {
    id: "tool-writing",
    title: "বাংলা টাইপিং অনুশীলন",
    subtitle: "বাংলা কিবোর্ডে দ্রুত ও নির্ভুল টাইপিং শেখার অনলাইন প্ল্যাটফর্ম",
    label: "টুলস",
    url: "/tools/writing-practice",
    type: "tool",
    icon: "keyboard",
    color: "sky",
    keywords: [
      "টাইপিং", "বাংলা টাইপিং", "অনুশীলন", "অভ্র", "বিজয়", "কিবোর্ড",
      "bangla typing", "typing practice", "typing test", "avro typing", "bijoy typing"
    ],
  },
  {
    id: "tool-zodiac",
    title: "রাশিফল ও রাশি ক্যালকুলেটর",
    subtitle: "জন্ম তারিখ অনুযায়ী আপনার রাশি ও রাশিফল জানুন",
    label: "টুলস",
    url: "/tools/zodiac-calculator",
    type: "tool",
    icon: "sparkles",
    color: "violet",
    keywords: [
      "রাশি", "রাশিফল", "রাশি ক্যালকুলেটর", "ভাগ্য", "জ্যোতিষ",
      "zodiac", "rashi", "rashifol", "horoscope", "zodiac calculator"
    ],
  },
  {
    id: "tool-pdf",
    title: "পিডিএফ এডিটর ও কনভার্টার",
    subtitle: "ব্রাউজারেই দ্রুত পিডিএফ ফাইল সম্পাদনা, একত্রীকরণ ও রূপান্তর",
    label: "টুলস",
    url: "/pdf-editor",
    type: "tool",
    icon: "document",
    color: "red",
    keywords: [
      "পিডিএফ", "পিডিএফ এডিটর", "মার্জ", "কনভার্ট", "পিডিএফ সাইজ",
      "pdf editor", "pdf merge", "pdf", "edit pdf"
    ],
  },

  // --- CONVERTERS ---
  {
    id: "converter-area",
    title: "জমি ও ক্ষেত্রফল পরিমাপ",
    subtitle: "শতক, কাঠা, বিঘা, একর ও বর্গফুটের সঠিক পরিমাপ ও রূপান্তর",
    label: "কনভার্টার",
    url: "/converter/area",
    type: "converter",
    icon: "calculator",
    color: "emerald",
    keywords: [
      "জমি", "পরিমাপ", "শতক", "কাঠা", "বিঘা", "একর", "ভূমি পরিমাপ", "ক্ষেত্রফল", "দলিল",
      "land", "measurement", "area converter", "jomi", "shotok", "katha", "bigha", "ekor", "bhumi"
    ],
  },
  {
    id: "converter-currency",
    title: "লাইভ মুদ্রা রূপান্তরকারী",
    subtitle: "ডলার, ইউরো, রিয়াল, পাউন্ড ও টাকার রিয়েল-টাইম বিনিময় হার",
    label: "কনভার্টার",
    url: "/converter/currency",
    type: "converter",
    icon: "banknotes",
    color: "emerald",
    keywords: [
      "মুদ্রা", "কারেন্সি", "ডলার", "টাকা", "ইউরো", "রিয়াল", "দিরহাম", "পাউন্ড", "রূপান্তর",
      "currency", "currency converter", "dollar", "euro", "taka", "forex", "mudra", "exchange"
    ],
  },
  {
    id: "converter-number-word",
    title: "সংখ্যা থেকে কথায় রূপান্তর",
    subtitle: "যেকোনো সংখ্যাকে বাংলা ও ইংরেজি কথায় রূপান্তর করুন",
    label: "কনভার্টার",
    url: "/converter/number-to-word",
    type: "converter",
    icon: "document-text",
    color: "indigo",
    keywords: [
      "সংখ্যা থেকে কথায়", "কথায় লিখুন", "টাকার অংক কথায়", "চেকের অংক",
      "number to word", "kothay lekha", "shongkha", "cheque amount"
    ],
  },
  {
    id: "converter-unit",
    title: "একক রূপান্তর (Unit Converter)",
    subtitle: "দৈর্ঘ্য, ওজন, আয়তন, তাপমাত্রা ও চাপ রূপান্তরের সর্বজনীন সমাধান",
    label: "কনভার্টার",
    url: "/converter/unit",
    type: "converter",
    icon: "arrows-right-left",
    color: "blue",
    keywords: [
      "একক", "রূপান্তর", "ইউনিট", "মিটার", "কেজি", "লিটার", "ইঞ্চি",
      "unit converter", "unit", "rupantor", "measurement converter"
    ],
  },
  {
    id: "converter-length",
    title: "দৈর্ঘ্য ও দূরত্ব রূপান্তর",
    subtitle: "মিটার, কিলোমিটার, মাইল, ফুট, ইঞ্চি ও গজের নিখুঁত রূপান্তর",
    label: "কনভার্টার",
    url: "/converter/length",
    type: "converter",
    icon: "arrows-right-left",
    color: "blue",
    keywords: ["দৈর্ঘ্য", "দূরত্ব", "মিটার", "ফুট", "ইঞ্চি", "মাইল", "length converter", "meter", "foot", "inch"],
  },
  {
    id: "converter-weight",
    title: "ওজন ও ভর রূপান্তর",
    subtitle: "কেজি, গ্রাম, মণ, সের, পাউন্ড ও আউন্সের হিসাব রূপান্তর",
    label: "কনভার্টার",
    url: "/converter/weight",
    type: "converter",
    icon: "scale",
    color: "amber",
    keywords: ["ওজন", "ভর", "কেজি", "গ্রাম", "মণ", "সের", "পাউন্ড", "weight converter", "kg", "gram", "mon", "pound"],
  },
  {
    id: "converter-temp",
    title: "তাপমাত্রা রূপান্তর",
    subtitle: "সেলসিয়াস, ফারেনহাইট ও কেলভিনের রিয়েল-টাইম তাপমাত্রা রূপান্তর",
    label: "কনভার্টার",
    url: "/converter/temperature",
    type: "converter",
    icon: "sun",
    color: "orange",
    keywords: ["তাপমাত্রা", "সেলসিয়াস", "ফারেনহাইট", "কেলভিন", "temperature converter", "celsius", "fahrenheit"],
  },
  {
    id: "converter-storage",
    title: "ডিজিটাল স্টোরেজ রূপান্তর",
    subtitle: "বাইট, কেবি, এমবি, জিবি ও টিবি ডাটা রূপান্তরের সহজ গণক",
    label: "কনভার্টার",
    url: "/converter/digital-storage",
    type: "converter",
    icon: "server",
    color: "cyan",
    keywords: ["স্টোরেজ", "ডাটা", "এমবি", "জিবি", "টিবি", "কেবি", "digital storage", "mb", "gb", "tb", "storage converter"],
  },
  {
    id: "converter-time",
    title: "সময় রূপান্তর",
    subtitle: "সেকেন্ড, মিনিট, ঘণ্টা, দিন ও সপ্তাহের সময় গণনা রূপান্তর",
    label: "কনভার্টার",
    url: "/converter/time",
    type: "converter",
    icon: "clock",
    color: "slate",
    keywords: ["সময় রূপান্তর", "ঘণ্টা", "মিনিট", "সেকেন্ড", "time converter", "hour", "minute", "second"],
  },
  {
    id: "converter-adarshalipi",
    title: "আদর্শলিপি ও বাংলা বর্ণমালা",
    subtitle: "বাংলা স্বরবর্ণ, ব্যঞ্জনবর্ণ ও যুক্তবর্ণের ইন্টারঅ্যাক্টিভ পাঠশালা",
    label: "কনভার্টার",
    url: "/converter/adarshalipi",
    type: "converter",
    icon: "book-open",
    color: "pink",
    keywords: ["আদর্শলিপি", "বর্ণমালা", "স্বরবর্ণ", "ব্যঞ্জনবর্ণ", "যুক্তবর্ণ", "adarshalipi", "bangla alphabet", "bornomala"],
  },

  // --- CORE SERVICES & REFERENCE SECTIONS ---
  {
    id: "service-emergency",
    title: "জাতীয় জরুরি সেবা ও হটলাইন",
    subtitle: "৯৯৯, ৩৩৩, ১০৯, ফায়ার সার্ভিস, পুলিশ ও অ্যাম্বুলেন্স জরুরি নম্বর",
    label: "জরুরি সেবা",
    url: "/contact/emergency",
    type: "contact",
    icon: "phone",
    color: "red",
    keywords: [
      "999", "৯৯৯", "জরুরি", "সেবা", "পুলিশ", "অ্যাম্বুলেন্স", "ফায়ার সার্ভিস", "হটলাইন", "জরুরি নম্বর",
      "emergency", "hotline", "police", "ambulance", "fire service", "333", "৩৩৩", "১০৯", "109", "16122"
    ],
  },
  {
    id: "service-calendar",
    title: "বাংলা ক্যালেন্ডার ও পঞ্জিকা",
    subtitle: "বঙ্গাব্দ ১৪৩২ আজকের বাংলা তারিখ, ঋতু ও সরকারি ছুটির দিনপঞ্জি",
    label: "ক্যালেন্ডার",
    url: "/bangla/calendar",
    type: "calendar",
    icon: "calendar",
    color: "red",
    keywords: [
      "বাংলা ক্যালেন্ডার", "পঞ্জিকা", "আজকের বাংলা তারিখ", "তারিখ", "বঙ্গাব্দ", "১৪৩২",
      "bangla calendar", "bengali calendar", "ponjika", "bangla date today", "tarikh"
    ],
  },
  {
    id: "service-holiday",
    title: "সরকারি ও ঐচ্ছিক ছুটির তালিকা",
    subtitle: "২০২৬ সালের সকল সরকারি, জাতীয় ও ধর্মীয় ছুটির অনুমোদিত তালিকা",
    label: "ছুটির দিন",
    url: "/bangla/holiday",
    type: "holiday",
    icon: "calendar",
    color: "amber",
    keywords: [
      "ছুটি", "ছুটির তালিকা", "সরকারি ছুটি", "ঈদের ছুটি", "পূজার ছুটি", "২০২৬ ছুটি",
      "holiday", "govt holiday", "chuti", "holiday list", "public holiday"
    ],
  },
  {
    id: "service-country",
    title: "আন্তর্জাতিক দেশ পরিচিতি",
    subtitle: "বিশ্বের ১৯৫+ দেশের রাজধানী, জনসংখ্যা, আয়তন, মুদ্রা ও পতাকা",
    label: "আন্তর্জাতিক",
    url: "/international/country",
    type: "country",
    icon: "globe",
    color: "blue",
    keywords: [
      "দেশ", "আন্তর্জাতিক", "বিশ্বের দেশ", "রাজধানী", "জনসংখ্যা", "পতাকা",
      "country", "international country", "world countries", "capital", "desh"
    ],
  },
  {
    id: "service-dialing",
    title: "আন্তর্জাতিক ডায়ালিং কোড",
    subtitle: "বিশ্বের সকল দেশের আন্তর্জাতিক টেলিফোন ও কান্ট্রি ডায়ালিং কোড",
    label: "আন্তর্জাতিক",
    url: "/international/dialing-code",
    type: "dialing_code",
    icon: "phone",
    color: "indigo",
    keywords: [
      "ডায়ালিং কোড", "কান্ট্রি কোড", "ফোন কোড", "আন্তর্জাতিক কল", "+880",
      "dialing code", "country code", "calling code", "phone code"
    ],
  },
  {
    id: "service-world-clock",
    title: "বিশ্ব সময় ও লাইভ টাইম জোন",
    subtitle: "লন্ডন, নিউইয়র্ক, দুবাই, টোকিওসহ বিশ্বের প্রতিটি শহরের লাইভ সময়",
    label: "আন্তর্জাতিক",
    url: "/international/world-clock",
    type: "world_clock",
    icon: "clock",
    color: "slate",
    keywords: [
      "বিশ্ব সময়", "ঘড়ি", "টাইম জোন", "লন্ডন সময়", "দুবাই সময়", "নিউইয়র্ক সময়",
      "world clock", "time zone", "live time", "time in", "shomoy"
    ],
  },
  {
    id: "service-forex",
    title: "বৈদেশিক মুদ্রার লাইভ রেট",
    subtitle: "বাংলাদেশ ব্যাংক ও উন্মুক্ত বাজারের আজকের লাইভ কারেন্সি এক্সচেঞ্জ রেট",
    label: "আন্তর্জাতিক",
    url: "/international/forex",
    type: "forex",
    icon: "banknotes",
    color: "emerald",
    keywords: [
      "ফরেক্স", "মুদ্রার রেট", "ডলারের দাম", "ডলার রেট", "রিয়াল রেট", "কারেন্সি এক্সচেঞ্জ",
      "forex", "dollar rate", "currency exchange", "live forex rate", "taka rate"
    ],
  },
  {
    id: "service-software",
    title: "বাংলা সফটওয়্যার সম্ভার",
    subtitle: "অভ্র কিবোর্ড, বিজয় একুশে ও প্রয়োজনীয় বাংলা সফটওয়্যারের ডাউনলোড গাইড",
    label: "সফটওয়্যার",
    url: "/software/all",
    type: "software",
    icon: "arrow-down-tray",
    color: "blue",
    keywords: [
      "সফটওয়্যার", "অভ্র কিবোর্ড", "বিজয়", "বাংলা সফটওয়্যার", "ডাউনলোড",
      "software", "avro", "avro keyboard", "bijoy", "bangla software", "download"
    ],
  },
  {
    id: "service-signs",
    title: "বাংলা ইশারা ভাষা অভিধান",
    subtitle: "বধির ও শ্রবণপ্রতিবন্ধীদের বাংলা বর্ণমালা ও শব্দের চিত্রভিত্তিক ইশারা",
    label: "সাইন ভাষা",
    url: "/signs/alphabets",
    type: "sign",
    icon: "hand-raised",
    color: "teal",
    keywords: [
      "ইশারা ভাষা", "সাইন ল্যাঙ্গুয়েজ", "বধির ভাষা", "হাত দিয়ে ভাষা",
      "sign language", "bangla sign language", "ishara bhasha", "signs"
    ],
  },
  {
    id: "service-livetv",
    title: "লাইভ টিভি ও সংবাদ চ্যানেল",
    subtitle: "বাংলাদেশের জাতীয় ও সংবাদ টেলিভিশন চ্যানেলের হালনাগাদ তথ্য",
    label: "লাইভ টিভি",
    url: "/live-tv",
    type: "news",
    icon: "tv",
    color: "red",
    keywords: ["লাইভ টিভি", "টিভি চ্যানেল", "সংবাদ", "খবর চ্যানেল", "live tv", "bangla news", "tv channel"],
  },
  {
    id: "service-news",
    title: "শীর্ষ সংবাদ ও হেডলাইন",
    subtitle: "জাতীয়, আন্তর্জাতিক ও অর্থনীতির সর্বশেষ নির্ভরযোগ্য খবর",
    label: "সংবাদ",
    url: "/news",
    type: "news",
    icon: "newspaper",
    color: "red",
    keywords: ["সংবাদ", "খবর", "হেডলাইন", "আজকের খবর", "news", "headlines", "khobor"],
  },
  {
    id: "service-islam-basic",
    title: "ইসলামিক মৌলিক জ্ঞান ও আকীদা",
    subtitle: "কালেমা, ঈমান, সালাত, সাওম, যাকাত ও হজের নির্ভরযোগ্য সারসংক্ষেপ",
    label: "ইসলাম",
    url: "/islam/basic",
    type: "islam",
    icon: "moon",
    color: "emerald",
    keywords: ["ইসলাম", "কালেমা", "নামাজ", "রোজা", "হজ", "যাকাত", "কুরআন", "islam", "namaz", "roza", "quran", "hadith"],
  },
  {
    id: "service-islam-dua",
    title: "দৈনন্দিন প্রয়োজনীয় দোয়া ও মোনাজাত",
    subtitle: "কুরআন ও সহীহ হাদিসভিত্তিক প্রতিদিনের প্রয়োজনীয় দোয়ার অর্থ ও উচ্চারণ",
    label: "দোয়া",
    url: "/islam/dowan",
    type: "dowa",
    icon: "heart",
    color: "emerald",
    keywords: ["দোয়া", "মোনাজাত", "প্রতিদিনের দোয়া", "dua", "dowa", "monajat", "islamic dua"],
  },
  {
    id: "service-tourism",
    title: "বাংলাদেশের দর্শনীয় স্থান ও পর্যটন গাইড",
    subtitle: "কক্সবাজার, সুন্দরবন, সাজেকসহ ৬৪ জেলার জনপ্রিয় পর্যটন কেন্দ্রের বিস্তারিত তথ্য",
    label: "পর্যটন",
    url: "/bangladesh/tourism",
    type: "tourism",
    icon: "map-pin",
    color: "sky",
    keywords: ["পর্যটন", "ভ্রমণ", "দর্শনীয় স্থান", "কক্সবাজার", "সাজেক", "সুন্দরবন", "tourism", "tourist spots", "travel", "vromon"],
  },
  {
    id: "service-history",
    title: "বাংলাদেশের ইতিহাস ও ঐতিহ্য",
    subtitle: "প্রাচীন বাংলা, ১৯৪৭, ১৯৫২ ভাষা আন্দোলন ও ১৯৭১ মহান মুক্তিযুদ্ধের ইতিহাস",
    label: "ইতিহাস",
    url: "/bangladesh/history",
    type: "history",
    icon: "book-open",
    color: "amber",
    keywords: ["ইতিহাস", "মুক্তিযুদ্ধ", "ভাষা আন্দোলন", "১৯৭১", "১৯৫২", "history", "bangladesh history", "liberation war", "itishash"],
  },
  {
    id: "service-establishment",
    title: "বাংলাদেশের ঐতিহ্যবাহী প্রতিষ্ঠান",
    subtitle: "জাতীয় সংসদ, বাংলাদেশ ব্যাংক, পাবলিক বিশ্ববিদ্যালয় ও গুরুত্বপূর্ণ প্রতিষ্ঠান",
    label: "প্রতিষ্ঠান",
    url: "/bangladesh/establishment",
    type: "establishment",
    icon: "building-office",
    color: "teal",
    keywords: ["প্রতিষ্ঠান", "বিশ্ববিদ্যালয়", "জাতীয় সংসদ", "বাংলাদেশ ব্যাংক", "establishment", "institutions", "protishthan"],
  },
  {
    id: "service-person",
    title: "প্রখ্যাত ব্যক্তিত্ব ও গুণীজন",
    subtitle: "বঙ্গবন্ধু, জাতীয় চার নেতা, ভাষা শহীদ, বিজ্ঞানী ও সাহিত্যিকদের জীবনকথা",
    label: "গুণীজন",
    url: "/bangladesh/public-figure",
    type: "person",
    icon: "user",
    color: "indigo",
    keywords: ["ব্যক্তিত্ব", "গুণীজন", "বঙ্গবন্ধু", "মুক্তিযোদ্ধা", "কবি", "সাহিত্যিক", "person", "public figure", "gunijon", "biography"],
  },
];

// Helper: Normalize text for matching
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .trim();
}

export function searchLocalCatalog(query: string, limit = 10): SearchItem[] {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  // Parse prefix if any on raw query (e.g. "টুলস: বয়স" or "tools: age")
  let targetType: string | null = null;
  let term = trimmed;
  const prefixMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
  if (prefixMatch) {
    const rawPrefix = prefixMatch[1].trim().toLowerCase();
    term = prefixMatch[2].trim();
    if (["টুলস", "টুল", "tools", "tool"].includes(rawPrefix)) targetType = "tool";
    else if (["কনভার্টার", "converter"].includes(rawPrefix)) targetType = "converter";
    else if (["জরুরি", "জরুরি সেবা", "emergency"].includes(rawPrefix)) targetType = "contact";
    else if (["দেশ", "country"].includes(rawPrefix)) targetType = "country";
    else if (["ছুটি", "ছুটির দিন", "holiday"].includes(rawPrefix)) targetType = "holiday";
    else if (["ক্যালেন্ডার", "calendar"].includes(rawPrefix)) targetType = "calendar";
    else if (["সফটওয়্যার", "software"].includes(rawPrefix)) targetType = "software";
    else if (["পর্যটন", "tourism"].includes(rawPrefix)) targetType = "tourism";
    else if (["প্রতিষ্ঠান", "establishment"].includes(rawPrefix)) targetType = "establishment";
    else if (["ইতিহাস", "history"].includes(rawPrefix)) targetType = "history";
    else if (["গুণীজন", "গুনীজন", "person"].includes(rawPrefix)) targetType = "person";
    else if (["ইসলাম", "islam"].includes(rawPrefix)) targetType = "islam";
    else if (["দোয়া", "dua"].includes(rawPrefix)) targetType = "dowa";
  }

  const cleanTerm = normalizeText(term);
  if (!cleanTerm && !targetType) return [];

  const tokens = term.split(/\s+/).filter(Boolean);

  const scored: Array<{ item: CatalogItem; score: number }> = [];

  for (const item of PLATFORM_SEARCH_CATALOG) {
    if (targetType && item.type !== targetType) continue;

    const normTitle = normalizeText(item.title);
    const normSub = normalizeText(item.subtitle);
    let score = 0;

    // Exact or prefix match on title
    if (normTitle === term) {
      score += 120;
    } else if (normTitle.startsWith(term)) {
      score += 80;
    } else if (normTitle.includes(term)) {
      score += 50;
    }

    // Keyword match
    for (const kw of item.keywords) {
      const normKw = normalizeText(kw);
      if (normKw === term) {
        score += 70;
      } else if (normKw.startsWith(term)) {
        score += 45;
      } else if (normKw.includes(term)) {
        score += 25;
      }
    }

    // Subtitle match
    if (normSub.includes(term)) {
      score += 15;
    }

    // Multi-token match
    if (tokens.length > 1) {
      const allMatch = tokens.every(
        (t) =>
          normTitle.includes(t) ||
          normSub.includes(t) ||
          item.keywords.some((k) => normalizeText(k).includes(t)),
      );
      if (allMatch) {
        score += 40;
      }
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ item }) => ({
    _search_title: item.title,
    _search_subtitle: item.subtitle,
    _search_label: item.label,
    _search_url: item.url,
    _search_icon: item.icon || "sparkles",
    _search_color: item.color || "blue",
    _search_type: item.type,
    _search_slug: item.url.split("/").filter(Boolean).pop() || item.id,
    _search_extra: { category: item.label },
  }));
}
