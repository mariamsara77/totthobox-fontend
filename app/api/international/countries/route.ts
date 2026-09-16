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

function isValidSort(value: string): value is CountrySort {
  return ALLOWED_SORTS.includes(value as CountrySort);
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const search = params.get("search")?.trim() ?? "";

    const region = params.get("region")?.trim() ?? "";

    const sortParam = params.get("sort") ?? "name";

    const sort: CountrySort = isValidSort(sortParam)
      ? sortParam
      : "name";

    const page = Math.max(
      1,
      Number(params.get("page") ?? "1"),
    );

    const perPage = Math.min(
      48,
      Math.max(
        1,
        Number(params.get("perPage") ?? "24"),
      ),
    );

    const result = await getCountryPage({
      search,
      region,
      sort,
      page,
      perPage,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      {
        countries: [],
        page: 1,
        perPage: 24,
        total: 0,
        totalPages: 1,
        hasMore: false,
        error: "দেশের তথ্য লোড করা সম্ভব হয়নি।",
      },
      {
        status: 500,
      },
    );
  }
}