import { NextRequest, NextResponse } from "next/server";
import {
  getCountryPage,
  type CountrySort,
} from "@/lib/international/countries";

const ALLOWED_SORTS: CountrySort[] = [
  "name",
  "population_desc",
  "population_asc",
  "area_desc",
  "area_asc",
];

const DEFAULT_PER_PAGE = 24;
const MAX_PER_PAGE = 48;

function isValidSort(value: string): value is CountrySort {
  return ALLOWED_SORTS.includes(value as CountrySort);
}

async function parseRequest(request: NextRequest) {
  // Prefer body for POST (infinite scroll), fall back to query for GET
  let search = "";
  let region = "";
  let sort: CountrySort = "name";
  let page = 1;
  let perPage = DEFAULT_PER_PAGE;

  if (request.method === "POST") {
    try {
      const body = await request.json();
      search = String(body.search ?? "").trim();
      region = String(body.region ?? "").trim();
      const sortParam = String(body.sort ?? "name");
      sort = isValidSort(sortParam) ? sortParam : "name";
      page = Math.max(1, Math.floor(Number(body.page) || 1));
      perPage = Math.min(
        MAX_PER_PAGE,
        Math.max(1, Math.floor(Number(body.perPage) || DEFAULT_PER_PAGE)),
      );
    } catch {
      // fall through to query
    }
  }

  // Always allow query params (GET + fallback)
  const params = request.nextUrl.searchParams;
  if (!search) search = params.get("search")?.trim() ?? "";
  if (!region) region = params.get("region")?.trim() ?? params.get("regionFilter")?.trim() ?? "";
  const sortParam = params.get("sort") ?? params.get("sortBy") ?? "name";
  if (!isValidSort(sort)) {
    sort = isValidSort(sortParam) ? sortParam : "name";
  }
  if (page === 1) {
    const p = Number(params.get("page") ?? "1");
    page = Number.isFinite(p) && p > 0 ? Math.floor(p) : 1;
  }
  if (perPage === DEFAULT_PER_PAGE) {
    const pp = Number(params.get("perPage") ?? String(DEFAULT_PER_PAGE));
    perPage = Number.isFinite(pp) && pp > 0
      ? Math.min(MAX_PER_PAGE, Math.floor(pp))
      : DEFAULT_PER_PAGE;
  }

  return { search, region, sort, page, perPage };
}

async function handleRequest(request: NextRequest) {
  try {
    const { search, region, sort, page, perPage } = await parseRequest(request);

    const result = await getCountryPage({
      search,
      region,
      sort,
      page,
      perPage,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
        Vary: "Accept",
      },
    });
  } catch (error) {
    console.error("Country API error:", error);
    return NextResponse.json(
      {
        countries: [],
        page: 1,
        perPage: DEFAULT_PER_PAGE,
        total: 0,
        totalPages: 1,
        hasMore: false,
        error: "দেশের তথ্য লোড করা সম্ভব হয়নি।",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      Allow: "GET, POST, HEAD, OPTIONS",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, HEAD, OPTIONS" },
  });
}