import { describe, expect, it } from "vitest";
import {
  addDays,
  easterDate,
  holidaysForYear,
  monthDays,
  observedDate,
  overlaps,
  validDate,
  YEARS,
} from "./holidays";

describe("U.S. occasion calendar dates", () => {
  it.each(YEARS)(
    "includes all eleven actual federal holidays in %i",
    (year) => {
      expect(
        holidaysForYear(year).filter(
          (event) => event.category === "federal" && !event.observed,
        ),
      ).toHaveLength(11);
    },
  );
  it.each([
    [2026, "2026-11-26", "2026-04-05"],
    [2027, "2027-11-25", "2027-03-28"],
    [2028, "2028-11-23", "2028-04-16"],
  ] as const)(
    "calculates Thanksgiving, Easter and shopping offsets in %i",
    (year, thanksgiving, easter) => {
      const events = holidaysForYear(year);
      expect(
        events.find((event) => event.title === "Thanksgiving")?.start,
      ).toBe(thanksgiving);
      expect(easterDate(year)).toBe(easter);
      expect(
        events.find((event) => event.title === "Black Friday")?.start,
      ).toBe(addDays(thanksgiving, 1));
      expect(
        events.find((event) => event.title === "Cyber Monday")?.start,
      ).toBe(addDays(thanksgiving, 4));
      expect(events.find((event) => event.title === "Mardi Gras")?.start).toBe(
        addDays(easter, -47),
      );
    },
  );
  it("keeps celebration dates separate from Friday or Monday office observances", () => {
    const events = holidaysForYear(2026);
    expect(
      events.find((event) => event.title === "Independence Day")?.start,
    ).toBe("2026-07-04");
    expect(
      events.find((event) => event.title === "Independence Day · observed")
        ?.start,
    ).toBe("2026-07-03");
    expect(observedDate("2027-07-04")).toBe("2027-07-05");
    expect(
      holidaysForYear(2027).find(
        (event) => event.title === "New Year's Day · observed",
      )?.start,
    ).toBe("2027-12-31");
    expect(
      holidaysForYear(2028).some((event) => event.start === "2027-12-31"),
    ).toBe(false);
  });
  it("carries Hanukkah and winter across the year boundary", () => {
    const hanukkah = holidaysForYear(2028).find(
      (event) => event.title === "Hanukkah" && event.start === "2027-12-24",
    );
    expect(hanukkah?.end).toBe("2028-01-01");
    expect(
      holidaysForYear(2026).some(
        (event) =>
          event.title === "Winter styling" &&
          overlaps(event, "2026-01-02", "2026-01-02"),
      ),
    ).toBe(true);
  });
  it("uses real leap-year dates and complete Sunday-first calendar weeks", () => {
    const days = monthDays(2028, 2);
    expect(days).toContain("2028-02-29");
    expect(days.length % 7).toBe(0);
    expect(days[0]).toBe("2028-01-30");
    expect(validDate("2027-02-29")).toBe(false);
    expect(validDate("2028-02-29")).toBe(true);
    expect(validDate("2028-13-01")).toBe(false);
  });
  it.each(YEARS)(
    "has valid ranges, unique IDs and transparent date notes in %i",
    (year) => {
      const events = holidaysForYear(year);
      expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
      events.forEach((event) => {
        expect(validDate(event.start)).toBe(true);
        expect(validDate(event.end)).toBe(true);
        expect(event.end >= event.start).toBe(true);
      });
      expect(
        events.find((event) => event.title === "Eid al-Fitr")?.note,
      ).toContain("Tentative");
      expect(
        events.find((event) => event.title === "Passover")?.note,
      ).toContain("sunset");
      expect(
        events.find((event) => event.title === "Prom season")?.source,
      ).toBeUndefined();
    },
  );
});
