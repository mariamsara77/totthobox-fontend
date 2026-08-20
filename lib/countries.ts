export type Currency = { code: string; name: string; symbol: string };

export type Neighbor = {
  name: string;
  slug: string;
  flag_emoji: string;
  flag: string | null;
  code: string;
  cca3: string;
};

export type Country = {
  slug: string;
  name: string;
  official_name: string;
  name_bengali: string | null;
  name_arabic: string | null;
  name_french: string | null;
  name_spanish: string | null;
  name_chinese: string | null;
  name_russian: string | null;
  name_german: string | null;
  name_hindi: string | null;
  name_japanese: string | null;
  demonym: string;
  demonym_f: string;
  independent: string;
  un_member: string;
  status: string;
  code: string;
  cca3: string;
  ccn3: string;
  cioc: string;
  fifa: string;
  region: string;
  subregion: string;
  continent: string;
  capital: string;
  all_capitals: string[];
  capital_lat: number | null;
  capital_lng: number | null;
  coords: string;
  lat: number | null;
  lng: number | null;
  landlocked: string;
  area: number;
  borders: string[];
  borders_count: number;
  tld: string[];
  population: number;
  density: string;
  languages: string[];
  languages_raw: Record<string, string>;
  currencies: Currency[];
  phone_code: string;
  all_phone_codes: string[];
  timezones: string[];
  start_of_week: string;
  driving_side: string;
  car_signs: string;
  postal_code_format: string | null;
  flag: string;
  flag_svg: string;
  flag_emoji: string;
  coat_of_arms: string | null;
  google_maps: string;
  google_maps_embed: string | null;
  open_street_maps: string | null;
};

export function formatPopulation(pop: number): string {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(2)} বিলিয়ন`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(2)} মিলিয়ন`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(1)} হাজার`;
  return pop > 0 ? pop.toLocaleString('bn-BD') : 'তথ্য নেই';
}

export function formatArea(area: number): string {
  if (area <= 0) return 'N/A';
  if (area >= 1_000_000) return `${(area / 1_000_000).toFixed(2)} মি. km²`;
  return `${area.toLocaleString('bn-BD')} km²`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('bn-BD');
}

/** Unique overview – AI detection এড়াতে */
export function generateOverview(c: Country): string {
  const name = c.name;
  const statusPhrase = c.independent === 'স্বাধীন রাষ্ট্র' ? 'একটি স্বাধীন রাষ্ট্র' : 'একটি অধীনস্থ অঞ্চল';
  const region = c.subregion || c.region || 'N/A';
  const continent = c.continent || 'N/A';

  const s1 = `${name} হলো ${continent} মহাদেশের ${region} অঞ্চলে অবস্থিত ${statusPhrase}।`;

  let s2 = '';
  if (c.capital && c.capital !== 'N/A') s2 += `দেশটির রাজধানী ${c.capital}, `;
  if (c.population > 0) {
    s2 += `এবং বর্তমান জনসংখ্যা আনুমানিক ${formatPopulation(c.population)}।`;
  } else {
    s2 += 'তবে জনসংখ্যার সুনির্দিষ্ট তথ্য এই মুহূর্তে পাওয়া যায়নি।';
  }

  let s3 = '';
  if (c.area > 0) s3 += `আয়তনের দিক থেকে দেশটি প্রায় ${formatArea(c.area)} জুড়ে বিস্তৃত। `;
  if (c.languages.length > 0) {
    const langList = c.languages.slice(0, 3).join(', ');
    s3 += `এখানে সরকারিভাবে ${c.languages.length}টি ভাষা স্বীকৃত, যার মধ্যে উল্লেখযোগ্য ${langList}।`;
  }

  let s4 = '';
  if (c.landlocked === 'স্থলবেষ্টিত') {
    s4 = `${name} একটি স্থলবেষ্টিত দেশ, অর্থাৎ এর কোনো সমুদ্র উপকূল নেই`;
    s4 += c.borders_count > 0 ? ` এবং এটি ${c.borders_count}টি দেশের সাথে সীমান্ত ভাগ করে।` : '।';
  } else if (c.borders_count > 0) {
    s4 = `${name} সমুদ্রবেষ্টিত হলেও স্থলপথে ${c.borders_count}টি প্রতিবেশী দেশের সাথে সীমান্ত রয়েছে।`;
  } else {
    s4 = `${name} একটি দ্বীপরাষ্ট্র বা বিচ্ছিন্ন ভূখণ্ড — এর কোনো স্থল সীমান্ত নেই।`;
  }

  const currency = c.currencies[0]?.name;
  const s5 = currency ? `দেশটিতে লেনদেনের প্রধান মুদ্রা হিসেবে ব্যবহৃত হয় ${currency}।` : '';

  return [s1, s2, s3, s4, s5].filter(Boolean).join(' ').trim();
}

export function generateFaqs(c: Country) {
  const name = c.name;
  const faqs: { q: string; a: string }[] = [];

  if (c.capital && c.capital !== 'N/A') {
    faqs.push({ q: `${name} এর রাজধানীর নাম কী?`, a: `${name} এর রাজধানীর নাম ${c.capital}।` });
  }
  if (c.population > 0) {
    faqs.push({
      q: `${name} এর জনসংখ্যা কত?`,
      a: `সাম্প্রতিক তথ্য অনুযায়ী ${name} এর জনসংখ্যা আনুমানিক ${formatPopulation(c.population)} (প্রায় ${formatNumber(c.population)} জন)।`,
    });
  }
  if (c.languages.length > 0) {
    faqs.push({
      q: `${name} এ কোন ভাষায় কথা বলা হয়?`,
      a: `${name} এর সরকারি ভাষা হলো ${c.languages.join(', ')}।`,
    });
  }
  if (c.currencies.length > 0) {
    const cur = c.currencies[0];
    faqs.push({
      q: `${name} এর মুদ্রার নাম কী?`,
      a: `${name} এ ব্যবহৃত প্রধান মুদ্রার নাম ${cur.name}${cur.symbol ? ` (প্রতীক: ${cur.symbol})` : ''}।`,
    });
  }
  faqs.push({
    q: `${name} কি স্থলবেষ্টিত দেশ?`,
    a: c.landlocked === 'স্থলবেষ্টিত'
      ? `হ্যাঁ, ${name} একটি স্থলবেষ্টিত দেশ — এর কোনো সমুদ্র উপকূল নেই।`
      : `না, ${name} এর সমুদ্র উপকূল রয়েছে।`,
  });
  if (c.borders_count > 0) {
    faqs.push({
      q: `${name} এর সীমান্তবর্তী দেশ কয়টি?`,
      a: `${name} মোট ${c.borders_count}টি দেশের সাথে স্থল সীমান্ত ভাগ করে।`,
    });
  }
  return faqs;
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    const [mainRes, popRes, contRes] = await Promise.all([
      fetch('https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json', {
        next: { revalidate: 2592000 },
      }),
      fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json', {
        next: { revalidate: 2592000 },
      }),
      fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json', {
        next: { revalidate: 2592000 },
      }),
    ]);

    if (!mainRes.ok) return [];

    const main = await mainRes.json();
    const popData = popRes.ok ? await popRes.json() : [];
    const contData = contRes.ok ? await contRes.json() : [];

    const popMap: Record<string, number> = {};
    popData.forEach((item: any) => {
      if (item.country) popMap[item.country] = item.population ?? 0;
    });

    const contMap: Record<string, string> = {};
    contData.forEach((item: any) => {
      if (item.country) contMap[item.country] = item.continent ?? null;
    });

    return main
      .map((c: any) => {
        const commonName = c.name?.common ?? 'Unknown';
        const officialName = c.name?.official ?? 'Unknown';
        const code = c.cca2 ?? '';
        const population = Number(popMap[commonName] ?? popMap[officialName] ?? 0);
        const continent = contMap[commonName] ?? contMap[officialName] ?? c.region ?? 'N/A';

        let nameBengali = c.name?.native?.ben?.common ?? c.name?.native?.ben?.official ?? null;
        if (!nameBengali && c.translations?.ben?.common) nameBengali = c.translations.ben.common;

        const languages = c.languages ? Object.values(c.languages) : [];
        const languagesRaw = c.languages ?? {};

        const currencies: Currency[] = [];
        if (c.currencies) {
          Object.entries(c.currencies).forEach(([code2, cur]: [string, any]) => {
            currencies.push({
              code: code2,
              name: cur.name ?? code2,
              symbol: cur.symbol ?? '',
            });
          });
        }

        let phoneCode = 'N/A';
        const allPhoneCodes: string[] = [];
        if (c.idd?.root) {
          const suffixes = Array.isArray(c.idd.suffixes) ? c.idd.suffixes : [''];
          suffixes.forEach((s: string) => allPhoneCodes.push(c.idd.root + s));
          phoneCode = allPhoneCodes[0] ?? 'N/A';
        }

        const lat = c.latlng?.[0] ?? null;
        const lng = c.latlng?.[1] ?? null;
        const coords = lat !== null && lng !== null ? `${lat.toFixed(4)}°, ${lng.toFixed(4)}°` : 'N/A';

        const googleMapsUrl =
          lat !== null && lng !== null
            ? `https://www.google.com/maps/@${lat},${lng},6z`
            : `https://www.google.com/maps/search/${encodeURIComponent(commonName)}`;

        const googleMapsEmbed =
          lat !== null && lng !== null
            ? `https://maps.google.com/maps?q=${lat},${lng}&z=5&output=embed`
            : null;

        const area = Number(c.area ?? 0);
        const density = area > 0 && population > 0 ? `${(population / area).toFixed(2)} /km²` : 'N/A';

        const lowerCode = (code || 'un').toLowerCase();
        const flagPng = `https://flagcdn.com/w640/${lowerCode}.png`;
        const flagSvg = `https://flagcdn.com/${lowerCode}.svg`;

        const carSignsArr = Array.isArray(c.car?.signs) ? c.car.signs : [];
        const carSigns = carSignsArr.length ? carSignsArr.join(', ') : 'N/A';

        const capitalInfo = c.capitalInfo ?? {};
        const capitalLat = capitalInfo.latlng?.[0] ?? null;
        const capitalLng = capitalInfo.latlng?.[1] ?? null;

        const coatOfArms = c.coatOfArms?.png ?? c.coatOfArms?.svg ?? null;
        const maps = c.maps ?? {};
        const openStreetMaps = maps.openStreetMaps ?? null;
        const googleMapsLink = maps.googleMaps ?? googleMapsUrl;

        return {
          slug: commonName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: commonName,
          official_name: officialName,
          name_bengali: nameBengali,
          name_arabic: c.translations?.ara?.common ?? null,
          name_french: c.translations?.fra?.common ?? null,
          name_spanish: c.translations?.spa?.common ?? null,
          name_chinese: c.translations?.zho?.common ?? null,
          name_russian: c.translations?.rus?.common ?? null,
          name_german: c.translations?.deu?.common ?? null,
          name_hindi: c.translations?.hin?.common ?? null,
          name_japanese: c.translations?.jpn?.common ?? null,
          demonym: c.demonyms?.eng?.m ?? 'N/A',
          demonym_f: c.demonyms?.eng?.f ?? 'N/A',
          independent: c.independent ? 'স্বাধীন রাষ্ট্র' : 'অধীনস্থ অঞ্চল',
          un_member: c.unMember ? 'জাতিসংঘ সদস্য' : 'জাতিসংঘ সদস্য নয়',
          status: c.status ?? 'N/A',
          code: code || 'N/A',
          cca3: c.cca3 ?? 'N/A',
          ccn3: c.ccn3 ?? 'N/A',
          cioc: c.cioc ?? 'N/A',
          fifa: c.fifa ?? 'N/A',
          region: c.region ?? 'Unknown',
          subregion: c.subregion ?? '',
          continent,
          capital: Array.isArray(c.capital) && c.capital[0] ? c.capital[0] : 'N/A',
          all_capitals: Array.isArray(c.capital) ? c.capital : [],
          capital_lat: capitalLat,
          capital_lng: capitalLng,
          coords,
          lat,
          lng,
          landlocked: c.landlocked ? 'স্থলবেষ্টিত' : 'সমুদ্রবেষ্টিত',
          area,
          borders: Array.isArray(c.borders) ? c.borders : [],
          borders_count: Array.isArray(c.borders) ? c.borders.length : 0,
          tld: Array.isArray(c.tld) ? c.tld : [],
          population,
          density,
          languages,
          languages_raw: languagesRaw,
          currencies,
          phone_code: phoneCode,
          all_phone_codes: allPhoneCodes,
          timezones: Array.isArray(c.timezones) ? c.timezones : [],
          start_of_week: c.startOfWeek ?? 'N/A',
          driving_side: c.car?.side ?? 'N/A',
          car_signs: carSigns,
          postal_code_format: c.postalCode?.format ?? null,
          flag: flagPng,
          flag_svg: flagSvg,
          flag_emoji: c.flag ?? '🌐',
          coat_of_arms: coatOfArms,
          google_maps: googleMapsLink,
          google_maps_embed: googleMapsEmbed,
          open_street_maps: openStreetMaps,
        } as Country;
      })
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

export async function getCountry(slug: string) {
  const all = await getAllCountries();
  const found = all.find((c) => c.slug === slug);

  if (!found) {
    const popular = all
      .filter((c) =>
        ['USA', 'GBR', 'IND', 'CHN', 'JPN', 'DEU', 'FRA', 'BRA', 'CAN', 'AUS', 'SAU', 'ARE'].includes(c.cca3)
      )
      .map((n) => ({
        name: n.name,
        slug: n.slug,
        flag_emoji: n.flag_emoji,
      }));
    return { country: null, neighbors: [] as Neighbor[], popular };
  }

  const neighbors: Neighbor[] = all
    .filter((c) => found.borders.includes(c.cca3))
    .map((n) => ({
      name: n.name,
      slug: n.slug,
      flag_emoji: n.flag_emoji,
      flag: n.flag,
      code: n.code,
      cca3: n.cca3,
    }));

  return { country: found, neighbors, popular: [] };
}