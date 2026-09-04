export interface SearchItem {
  _search_title: string;
  _search_subtitle?: string | null;
  _search_label: string;
  _search_url: string;
  _search_image?: string | null;
  _search_icon?: string | null;
  _search_color?: string;
  _search_type?: string;
  _search_slug?: string;
  _search_extra?: {
    category?: string | null;
    [key: string]: any;
  };
}

export interface SearchResponse {
  items: SearchItem[];
  scope: string | null;
  hasMore: boolean;
  total: number;
}

export interface MetaResponse {
  prefixes: string[];
  hints: Record<string, string>;
}