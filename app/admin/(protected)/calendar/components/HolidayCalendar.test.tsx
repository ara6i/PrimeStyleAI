// @vitest-environment jsdom
// @vitest-environment-options {"url":"http://localhost:3001/admin/calendar"}

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HolidayCalendar } from "./HolidayCalendar";
import { decodePlanning, PLANNING_KEY } from "../lib/planningStore";

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Holiday calendar planning flows", () => {
  it("saves an outfit brief and restores its audience and notes after remount", async () => {
    const user = userEvent.setup();
    const first = render(<HolidayCalendar today="2026-10-03" />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Audience" }),
      "Women",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Outfit notes" }),
      "Velvet jacket, black boots, gold details.",
    );
    await user.click(screen.getByRole("button", { name: "Save outfit brief" }));
    const stored = decodePlanning(localStorage.getItem(PLANNING_KEY));
    expect(stored.briefs["2026-10-31:Halloween"].audience).toBe("Women");
    expect(
      screen
        .getByRole("button", { name: "Brief saved" })
        .hasAttribute("disabled"),
    ).toBe(true);
    first.unmount();
    render(<HolidayCalendar today="2026-10-03" />);
    expect(
      (
        screen.getByRole("textbox", {
          name: "Outfit notes",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe("Velvet jacket, black boots, gold details.");
    expect(
      (screen.getByRole("combobox", { name: "Audience" }) as HTMLSelectElement)
        .value,
    ).toBe("Women");
  });
  it("finds Thanksgiving across the year and filters the federal agenda", async () => {
    const user = userEvent.setup();
    render(<HolidayCalendar today="2026-10-03" />);
    await user.type(
      screen.getByRole("textbox", { name: "Search occasions" }),
      "Thanksgiving",
    );
    await user.click(
      screen.getByRole("button", {
        name: "Nov 26 Thanksgiving Federal holidays",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Thanksgiving" }),
    ).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    await user.click(
      screen.getByRole("button", { name: "Year agenda" }),
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Occasion category" }),
      "federal",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Calendar year" }),
      "2028",
    );
    expect(
      screen.getByRole("button", {
        name: "Nov 23 Thanksgiving Federal holidays",
      }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", {
        name: "Oct 31 Halloween Culture & celebrations",
      }),
    ).toBeNull();
  });
  it("adds, persists, and removes a custom occasion with its brief", async () => {
    const user = userEvent.setup();
    render(<HolidayCalendar today="2026-10-03" />);
    await user.click(
      screen.getByRole("button", { name: "Add occasion" }),
    );
    const dialog = within(screen.getByRole("dialog"));
    await user.type(
      dialog.getByRole("textbox", { name: "Occasion name" }),
      "Autumn capsule launch",
    );
    fireEvent.change(dialog.getByLabelText("Start date"), {
      target: { value: "2026-10-15" },
    });
    await user.click(dialog.getByRole("button", { name: "Add to calendar" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Autumn capsule launch" }),
    ).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Save outfit brief" }));
    expect(
      decodePlanning(localStorage.getItem(PLANNING_KEY)).custom,
    ).toHaveLength(1);
    await user.click(
      screen.getByRole("button", { name: "Remove custom occasion" }),
    );
    const stored = decodePlanning(localStorage.getItem(PLANNING_KEY));
    expect(stored.custom).toHaveLength(0);
    expect(Object.keys(stored.briefs)).toHaveLength(0);
  });
  it("reports failed storage writes without claiming the brief was saved", async () => {
    const user = userEvent.setup();
    render(<HolidayCalendar today="2026-10-03" />);
    await user.type(
      screen.getByRole("textbox", { name: "Outfit notes" }),
      "Keep this unsaved draft",
    );
    vi.spyOn(Object.getPrototypeOf(window.localStorage), "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });
    await user.click(screen.getByRole("button", { name: "Save outfit brief" }));
    expect(screen.getByRole("alert").textContent).toContain(
      "could not be saved",
    );
    expect(screen.queryByRole("button", { name: "Brief saved" })).toBeNull();
    expect(
      (
        screen.getByRole("textbox", {
          name: "Outfit notes",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe("Keep this unsaved draft");
  });
  it("does not silently overwrite invalid stored planning data", () => {
    localStorage.setItem(PLANNING_KEY, "broken-json");
    render(<HolidayCalendar today="2026-10-03" />);
    expect(screen.getByRole("alert").textContent).toContain(
      "could not be read",
    );
    expect(
      screen
        .getByRole("button", { name: "Save outfit brief" })
        .hasAttribute("disabled"),
    ).toBe(true);
    expect(localStorage.getItem(PLANNING_KEY)).toBe("broken-json");
  });
});
