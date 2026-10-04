import { useMemo, useSyncExternalStore } from "react";
import { validDate, type Occasion, type OutfitBrief, YEARS } from "./holidays";

export const PLANNING_KEY = "primestyle-occasion-planner-v1";
const CHANGE_EVENT = "primestyle-occasion-planner-change";
export interface PlanningData {
  version: 1;
  custom: Occasion[];
  briefs: Record<string, OutfitBrief>;
}
const EMPTY: PlanningData = { version: 1, custom: [], briefs: {} };

export function decodePlanning(raw: string | null): PlanningData {
  if (!raw) return EMPTY;
  const data = JSON.parse(raw) as PlanningData;
  if (
    !data ||
    data.version !== 1 ||
    !Array.isArray(data.custom) ||
    !data.briefs ||
    typeof data.briefs !== "object" ||
    Array.isArray(data.briefs)
  )
    throw new Error("Invalid planning data");
  for (const event of data.custom) {
    if (
      !event ||
      typeof event.id !== "string" ||
      !event.id.startsWith("custom:") ||
      typeof event.title !== "string" ||
      !event.title.trim() ||
      event.category !== "custom" ||
      !validDate(event.start) ||
      !validDate(event.end) ||
      event.end < event.start ||
      typeof event.note !== "string"
    )
      throw new Error("Invalid occasion");
    if (
      !YEARS.includes(
        Number(event.start.slice(0, 4)) as (typeof YEARS)[number],
      ) ||
      Number(event.end.slice(0, 4)) > YEARS[YEARS.length - 1]
    )
      throw new Error("Unsupported occasion year");
  }
  for (const brief of Object.values(data.briefs)) {
    if (
      !brief ||
      typeof brief.audience !== "string" ||
      typeof brief.direction !== "string" ||
      typeof brief.notes !== "string" ||
      !Number.isInteger(brief.leadDays) ||
      brief.leadDays < 0 ||
      brief.leadDays > 365
    )
      throw new Error("Invalid outfit brief");
  }
  return data;
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
function snapshot() {
  try {
    return window.localStorage.getItem(PLANNING_KEY) ?? "";
  } catch {
    return "__unavailable__";
  }
}
function serverSnapshot() {
  return "";
}
function subscribeReady() {
  return () => {};
}
function readySnapshot() {
  return true;
}
function serverReadySnapshot() {
  return false;
}
export function usePlanningStore() {
  const ready = useSyncExternalStore(
    subscribeReady,
    readySnapshot,
    serverReadySnapshot,
  );
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const result = useMemo(() => {
    try {
      return { data: decodePlanning(raw), error: "" };
    } catch {
      return {
        data: EMPTY,
        error:
          "Saved planning data could not be read. Download a backup before clearing browser storage, or enable local storage to save.",
      };
    }
  }, [raw]);
  function update(change: (current: PlanningData) => PlanningData) {
    // Read at write-time so a save cannot overwrite another tab's more recent plan.
    const current = decodePlanning(window.localStorage.getItem(PLANNING_KEY));
    window.localStorage.setItem(PLANNING_KEY, JSON.stringify(change(current)));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return { ...result, ready, update };
}
