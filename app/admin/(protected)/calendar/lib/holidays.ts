export const YEARS = [2026, 2027, 2028] as const;
export type Category =
  "federal" | "cultural" | "religious" | "retail" | "seasonal" | "custom";
export const CATEGORIES: Record<
  Category,
  { label: string; color: string; tint: string }
> = {
  federal: { label: "Federal holidays", color: "#4272dc", tint: "#eef3ff" },
  cultural: {
    label: "Culture & celebrations",
    color: "#be7130",
    tint: "#fff3e8",
  },
  religious: { label: "Religious holidays", color: "#8b62c9", tint: "#f4efff" },
  retail: { label: "Shopping moments", color: "#328776", tint: "#eaf7f2" },
  seasonal: { label: "Seasons & occasions", color: "#c15f89", tint: "#fff0f6" },
  custom: { label: "Custom occasions", color: "#617185", tint: "#edf1f6" },
};
export interface Occasion {
  id: string;
  title: string;
  category: Category;
  start: string;
  end: string;
  note: string;
  source?: string;
  observed?: boolean;
}
export interface OutfitBrief {
  audience: string;
  direction: string;
  notes: string;
  leadDays: number;
}
export const OPM_SOURCE =
  "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/";
const DAY = 86_400_000;
export function isoDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
}
export function dateValue(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}
export function addDays(date: string, days: number): string {
  return new Date(dateValue(date).getTime() + days * DAY)
    .toISOString()
    .slice(0, 10);
}
export function daysBetween(from: string, to: string): number {
  return Math.round(
    (dateValue(to).getTime() - dateValue(from).getTime()) / DAY,
  );
}
export function validDate(date: unknown): date is string {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    return false;
  const parsed = dateValue(date);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}
export function nthWeekday(
  year: number,
  month: number,
  weekday: number,
  nth: number,
): string {
  const first = dateValue(isoDate(year, month, 1)).getUTCDay();
  return isoDate(year, month, 1 + ((weekday - first + 7) % 7) + (nth - 1) * 7);
}
function lastWeekday(year: number, month: number, weekday: number): string {
  const last = isoDate(year, month + 1, 0);
  return addDays(last, -(dateValue(last).getUTCDay() - weekday + 7) % 7);
}
export function observedDate(date: string): string {
  const day = dateValue(date).getUTCDay();
  return addDays(date, day === 6 ? -1 : day === 0 ? 1 : 0);
}
// Gregorian computus: Western Easter; Orthodox Easter is listed separately.
export function easterDate(year: number): string {
  const a = year % 19,
    b = Math.floor(year / 100),
    c = year % 100;
  const d = Math.floor(b / 4),
    e = b % 4,
    f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4),
    k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  return isoDate(
    year,
    Math.floor((h + l - 7 * m + 114) / 31),
    ((h + l - 7 * m + 114) % 31) + 1,
  );
}
export function overlaps(event: Occasion, start: string, end: string): boolean {
  return event.start <= end && event.end >= start;
}
export function monthDays(year: number, month: number): string[] {
  const first = isoDate(year, month, 1);
  const start = addDays(first, -dateValue(first).getUTCDay());
  const length = dateValue(isoDate(year, month + 1, 0)).getUTCDate();
  const cells = Math.ceil((dateValue(first).getUTCDay() + length) / 7) * 7;
  return Array.from({ length: cells }, (_, index) => addDays(start, index));
}
export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(dateValue(date));
}
export function dateRange(event: Occasion): string {
  return event.start === event.end
    ? formatDate(event.start)
    : `${formatDate(event.start)} – ${formatDate(event.end)}`;
}

type VariableDates = {
  lunar: string;
  holi: string;
  diwali: string;
  ramadan: string;
  fitr: string;
  adha: string;
  orthodox: string;
  jewish: [string, string][];
};
// Reviewed U.S. dates for 2026–2028. Jewish intervals begin at sunset and end at nightfall.
// Muslim dates are tentative; a community's moon sighting can change them.
const VARIABLE: Record<number, VariableDates> = {
  2026: {
    lunar: "02-17",
    holi: "03-03",
    diwali: "11-08",
    ramadan: "02-18",
    fitr: "03-20",
    adha: "05-27",
    orthodox: "04-12",
    jewish: [
      ["03-02", "03-03"],
      ["04-01", "04-09"],
      ["05-21", "05-23"],
      ["09-11", "09-13"],
      ["09-20", "09-21"],
      ["09-25", "10-02"],
      ["10-02", "10-04"],
      ["12-04", "12-12"],
    ],
  },
  2027: {
    lunar: "02-06",
    holi: "03-22",
    diwali: "10-28",
    ramadan: "02-08",
    fitr: "03-10",
    adha: "05-17",
    orthodox: "05-02",
    jewish: [
      ["03-22", "03-23"],
      ["04-21", "04-29"],
      ["06-10", "06-12"],
      ["10-01", "10-03"],
      ["10-10", "10-11"],
      ["10-15", "10-22"],
      ["10-22", "10-24"],
      ["12-24", "2028-01-01"],
    ],
  },
  2028: {
    lunar: "01-26",
    holi: "03-11",
    diwali: "10-17",
    ramadan: "01-28",
    fitr: "02-27",
    adha: "05-05",
    orthodox: "04-16",
    jewish: [
      ["03-11", "03-12"],
      ["04-10", "04-18"],
      ["05-30", "06-01"],
      ["09-20", "09-22"],
      ["09-29", "09-30"],
      ["10-04", "10-11"],
      ["10-11", "10-13"],
      ["12-12", "12-20"],
    ],
  },
};

export function holidaysForYear(year: number): Occasion[] {
  if (!VARIABLE[year]) return [];
  const events: Occasion[] = [];
  const source = `https://www.timeanddate.com/holidays/us/${year}`;
  const date = (part: string) =>
    part.length === 10 ? part : `${year}-${part}`;
  const push = (
    title: string,
    category: Category,
    start: string,
    end = start,
    note = "",
    link: string | null = source,
  ) => {
    events.push({
      id: `${start}:${title}`,
      title,
      category,
      start,
      end,
      note,
      source: link ?? undefined,
    });
  };
  const fixed = (
    title: string,
    category: Category,
    month: number,
    day: number,
    note = "",
  ) => push(title, category, isoDate(year, month, day), undefined, note);
  const federal = (title: string, start: string, fixedDate = false) => {
    push(title, "federal", start, start, "U.S. federal holiday.", OPM_SOURCE);
    const observed = observedDate(start);
    if (fixedDate && observed !== start) {
      push(
        `${title} · observed`,
        "federal",
        observed,
        observed,
        `Federal office observance. The celebration date is ${formatDate(start, { year: "numeric" })}.`,
        OPM_SOURCE,
      );
      events[events.length - 1].observed = true;
    }
  };
  federal("New Year's Day", isoDate(year, 1, 1), true);
  federal("Martin Luther King Jr. Day", nthWeekday(year, 1, 1, 3));
  federal("Presidents' Day", nthWeekday(year, 2, 1, 3));
  federal("Memorial Day", lastWeekday(year, 5, 1));
  federal("Juneteenth", isoDate(year, 6, 19), true);
  federal("Independence Day", isoDate(year, 7, 4), true);
  federal("Labor Day", nthWeekday(year, 9, 1, 1));
  federal("Columbus Day", nthWeekday(year, 10, 1, 2));
  federal("Veterans Day", isoDate(year, 11, 11), true);
  const thanksgiving = nthWeekday(year, 11, 4, 4);
  federal("Thanksgiving", thanksgiving);
  federal("Christmas Day", isoDate(year, 12, 25), true);
  // Observed New Year's Day can land in the preceding year (e.g. Dec 31, 2027).
  const nextNewYear = isoDate(year + 1, 1, 1);
  if (observedDate(nextNewYear).startsWith(`${year}-`)) {
    push(
      "New Year's Day · observed",
      "federal",
      observedDate(nextNewYear),
      undefined,
      `Federal office observance for January 1, ${year + 1}.`,
      OPM_SOURCE,
    );
    events[events.length - 1].observed = true;
  }
  const common: [string, Category, number, number][] = [
    ["Epiphany", "religious", 1, 6],
    ["Orthodox Christmas", "religious", 1, 7],
    ["Groundhog Day", "cultural", 2, 2],
    ["Galentine's Day", "cultural", 2, 13],
    ["Valentine's Day", "cultural", 2, 14],
    ["International Women's Day", "cultural", 3, 8],
    ["St. Patrick's Day", "cultural", 3, 17],
    ["April Fools' Day", "cultural", 4, 1],
    ["Earth Day", "cultural", 4, 22],
    ["Star Wars Day", "cultural", 5, 4],
    ["Cinco de Mayo", "cultural", 5, 5],
    ["Flag Day", "cultural", 6, 14],
    ["International Friendship Day", "cultural", 7, 30],
    ["Halloween", "cultural", 10, 31],
    ["All Saints' Day", "religious", 11, 1],
    ["All Souls' Day", "religious", 11, 2],
    ["Christmas Eve", "religious", 12, 24],
    ["Boxing Day", "cultural", 12, 26],
    ["New Year's Eve", "cultural", 12, 31],
  ];
  common.forEach(([title, category, month, day]) =>
    fixed(title, category, month, day),
  );
  push(
    "National Sunglasses Day",
    "cultural",
    isoDate(year, 6, 27),
    undefined,
    "Annual eyewear styling and UV-awareness occasion.",
    "https://thevisioncouncil.org/members/national-sunglasses-day",
  );
  push(
    "Indigenous Peoples' Day",
    "cultural",
    nthWeekday(year, 10, 1, 2),
    undefined,
    "Recognized by many states and communities; not a separate nationwide federal holiday.",
  );
  push("Mother's Day", "cultural", nthWeekday(year, 5, 0, 2));
  push("Father's Day", "cultural", nthWeekday(year, 6, 0, 3));
  push("Grandparents Day", "cultural", addDays(nthWeekday(year, 9, 1, 1), 6));
  push("National Wear Red Day", "cultural", nthWeekday(year, 2, 5, 1));
  push(
    "Kentucky Derby",
    "cultural",
    nthWeekday(year, 5, 6, 1),
    undefined,
    "Race-day styling occasion. Check the organizer for final event details.",
  );
  push(
    "Día de los Muertos",
    "cultural",
    date("11-01"),
    date("11-02"),
    "A time to honor loved ones; plan with cultural context.",
  );
  push("Kwanzaa", "cultural", date("12-26"), isoDate(year + 1, 1, 1));
  push("Kwanzaa", "cultural", isoDate(year - 1, 12, 26), date("01-01"));
  push(
    "Winter styling",
    "seasonal",
    isoDate(year - 1, 12, 1),
    isoDate(year, 3, 0),
    "Suggested outfit-planning window, not an official holiday. Local dates and weather vary.",
    null,
  );
  const easter = easterDate(year);
  push("Mardi Gras", "cultural", addDays(easter, -47));
  push("Palm Sunday", "religious", addDays(easter, -7));
  push("Good Friday", "religious", addDays(easter, -2));
  push("Easter Sunday", "religious", easter);
  push("Easter Monday", "religious", addDays(easter, 1));
  for (const [title, offset] of [
    ["Thanksgiving Eve", -1],
    ["Black Friday", 1],
    ["Small Business Saturday", 2],
    ["Cyber Monday", 4],
    ["Giving Tuesday", 5],
  ] as const) {
    push(
      title,
      offset === -1 ? "cultural" : "retail",
      addDays(thanksgiving, offset),
    );
  }
  const ranges: [string, Category, string, string][] = [
    ["Black History Month", "cultural", "02-01", isoDate(year, 3, 0)],
    ["Women's History Month", "cultural", "03-01", "03-31"],
    [
      "Asian American & Pacific Islander Heritage Month",
      "cultural",
      "05-01",
      "05-31",
    ],
    ["Pride Month", "cultural", "06-01", "06-30"],
    ["Hispanic Heritage Month", "cultural", "09-15", "10-15"],
    ["Native American Heritage Month", "cultural", "11-01", "11-30"],
    ["Spring styling", "seasonal", "03-01", "05-31"],
    ["Summer styling", "seasonal", "06-01", "08-31"],
    ["Fall styling", "seasonal", "09-01", "11-30"],
    ["Winter styling", "seasonal", "12-01", isoDate(year + 1, 3, 0)],
    ["Prom season", "seasonal", "04-01", "05-31"],
    ["Graduation season", "seasonal", "05-01", "06-30"],
    ["Wedding season", "seasonal", "05-01", "09-30"],
    ["Back to school", "seasonal", "08-01", "09-15"],
    ["Friendsgiving planning", "seasonal", "11-15", addDays(thanksgiving, -1)],
    ["Holiday party season", "seasonal", "12-01", "12-23"],
  ];
  ranges.forEach(([title, category, start, end]) =>
    push(
      title,
      category,
      date(start),
      date(end),
      category === "seasonal"
        ? "Suggested outfit-planning window, not an official holiday. Local dates and weather vary."
        : "Month-long cultural observance; work with the community on your brief.",
      category === "seasonal" ? null : source,
    ),
  );
  const variable = VARIABLE[year];
  push("Lunar New Year", "cultural", date(variable.lunar));
  push(
    "Holi",
    "religious",
    date(variable.holi),
    undefined,
    "U.S. planning date. Regional festival dates and celebrations may differ.",
  );
  push(
    "Diwali",
    "religious",
    date(variable.diwali),
    undefined,
    "Main festival planning date; celebrations span multiple days and vary by community.",
  );
  push("Orthodox Easter", "religious", date(variable.orthodox));
  push(
    "Ramadan",
    "religious",
    date(variable.ramadan),
    addDays(date(variable.fitr), -1),
    "Tentative first fasting day. Begins the preceding evening; confirm with the local community and moon sighting.",
  );
  push(
    "Eid al-Fitr",
    "religious",
    date(variable.fitr),
    undefined,
    "Tentative date, subject to local moon sighting. Observance starts the preceding evening.",
  );
  push(
    "Eid al-Adha",
    "religious",
    date(variable.adha),
    undefined,
    "Tentative first day, subject to local moon sighting. Celebrations can span multiple days.",
  );
  const jewishTitles = [
    "Purim",
    "Passover",
    "Shavuot",
    "Rosh Hashanah",
    "Yom Kippur",
    "Sukkot",
    "Shemini Atzeret & Simchat Torah",
    "Hanukkah",
  ];
  variable.jewish.forEach(([start, end], index) =>
    push(
      jewishTitles[index],
      "religious",
      date(start),
      date(end),
      "Begins at sunset on the first date and ends at nightfall on the last date. U.S. / diaspora dates.",
      `https://www.chabad.org/holidays/default_cdo/year/${year}/jewish/holidays-${year}.htm`,
    ),
  );
  // Carry multi-day observances into January without creating a new holiday instance.
  if (VARIABLE[year - 1]) {
    const previous = holidaysForYear(year - 1);
    events.push(
      ...previous.filter(
        (event) =>
          event.category === "religious" &&
          event.start < `${year}-01-01` &&
          event.end >= `${year}-01-01`,
      ),
    );
  }
  return events
    .filter((event) => overlaps(event, `${year}-01-01`, `${year}-12-31`))
    .sort(
      (a, b) =>
        a.start.localeCompare(b.start) || a.title.localeCompare(b.title),
    );
}

export function outfitIdeas(event: Occasion): {
  direction: string;
  pieces: string[];
  palette: string[];
} {
  const title = event.title.toLowerCase();
  if (title.includes("halloween"))
    return {
      direction: "After-dark drama",
      pieces: [
        "Statement cape or velvet jacket",
        "Black boots & metallic accessories",
        "Playful costume-inspired accents",
      ],
      palette: ["#232126", "#d87630", "#745299", "#e6dac6"],
    };
  if (/christmas|holiday party/.test(title))
    return {
      direction: "Festive evening elegance",
      pieces: [
        "Velvet dress or tailored suit",
        "A rich knit & polished trousers",
        "Gold accents & dress shoes",
      ],
      palette: ["#254f43", "#8d3346", "#c5a36b", "#f2e9d8"],
    };
  if (/thanksgiving|friendsgiving|fall/.test(title))
    return {
      direction: "Warm, effortless gathering",
      pieces: [
        "Textured knit or relaxed tailoring",
        "Wide-leg trousers or a midi skirt",
        "Comfortable suede boots",
      ],
      palette: ["#995438", "#c39362", "#675743", "#efe4d2"],
    };
  if (/valentine|galentine/.test(title))
    return {
      direction: "Romantic statement dressing",
      pieces: [
        "Silk blouse or an elegant dress",
        "A soft tailored layer",
        "A red accent & evening accessories",
      ],
      palette: ["#98354c", "#d38898", "#e9cdc9", "#382a32"],
    };
  if (/new year|prom|diwali/.test(title))
    return {
      direction: "Celebrate with a little shimmer",
      pieces: [
        "Eveningwear with a luminous finish",
        "Tailoring or occasionwear you love",
        "Refined jewelry & polished shoes",
      ],
      palette: ["#252a38", "#bca16a", "#654a83", "#ece3d4"],
    };
  if (/independence|flag|veterans|memorial/.test(title))
    return {
      direction: "Classic Americana",
      pieces: [
        "Crisp cotton shirt & relaxed denim",
        "A navy layer or summer dress",
        "Comfortable sneakers or loafers",
      ],
      palette: ["#a5484e", "#faf1de", "#304869", "#869eb4"],
    };
  if (/summer|school|labor/.test(title))
    return {
      direction: "Easy everyday layers",
      pieces: [
        "Breathable shirt or cotton dress",
        "Versatile trousers & light layers",
        "Comfortable everyday footwear",
      ],
      palette: ["#507b8a", "#e3c7a1", "#dce4d6", "#f4efe5"],
    };
  if (/spring|easter|mother/.test(title))
    return {
      direction: "Fresh spring occasionwear",
      pieces: [
        "A floral dress or light tailoring",
        "Soft separates & a cardigan",
        "Loafers, flats or low heels",
      ],
      palette: ["#b0bea0", "#ceabc2", "#a6bccd", "#f4ecd9"],
    };
  return {
    direction:
      event.category === "religious"
        ? "Thoughtful occasionwear"
        : "A considered seasonal look",
    pieces: [
      "Tailoring or separates for your audience",
      "A comfortable layer for the venue",
      "Personal accessories & polished footwear",
    ],
    palette: ["#596c78", "#b59a79", "#d8d2c9", "#45484a"],
  };
}
export function defaultBrief(event: Occasion): OutfitBrief {
  return {
    audience: "Everyone",
    direction: outfitIdeas(event).direction,
    notes: "",
    leadDays: 30,
  };
}
