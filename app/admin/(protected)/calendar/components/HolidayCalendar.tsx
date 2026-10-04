"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe2,
  List,
  Palette,
  Plus,
  Search,
  Shirt,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Dialog } from "radix-ui";
import { useAdminDashboardTheme } from "../../hooks/useAdminDashboardTheme";
import {
  addDays,
  CATEGORIES,
  dateRange,
  dateValue,
  daysBetween,
  defaultBrief,
  formatDate,
  holidaysForYear,
  isoDate,
  monthDays,
  outfitIdeas,
  overlaps,
  validDate,
  YEARS,
  type Category,
  type Occasion,
  type OutfitBrief,
} from "../lib/holidays";
import { PLANNING_KEY, usePlanningStore } from "../lib/planningStore";
import styles from "./holidayCalendar.module.css";

const MONTHS = Array.from({ length: 12 }, (_, index) =>
  formatDate(isoDate(2026, index + 1, 1), { month: "long", day: undefined }),
);
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function eventStyle(event: Occasion): CSSProperties {
  return {
    "--occasion-color": CATEGORIES[event.category].color,
    "--occasion-tint": CATEGORIES[event.category].tint,
  } as CSSProperties;
}
function downloadJSON(value: unknown, filename: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function HolidayCalendar({ today }: { today: string }) {
  const currentYear = Number(today.slice(0, 4));
  const initialYear = YEARS.includes(currentYear as (typeof YEARS)[number])
    ? currentYear
    : YEARS[0];
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [view, setView] = useState<"month" | "agenda">("month");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [plannedOnly, setPlannedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDay, setSelectedDay] = useState(today);
  const [customOpen, setCustomOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const { data, ready, error, update } = usePlanningStore();
  const { theme } = useAdminDashboardTheme();
  const start = isoDate(year, month, 1),
    end = isoDate(year, month + 1, 0);
  const events = useMemo(
    () =>
      [
        ...holidaysForYear(year),
        ...data.custom.filter((event) =>
          overlaps(event, `${year}-01-01`, `${year}-12-31`),
        ),
      ].sort(
        (a, b) =>
          a.start.localeCompare(b.start) || a.title.localeCompare(b.title),
      ),
    [year, data.custom],
  );
  const filtered = events.filter(
    (event) =>
      (category === "all" || event.category === category) &&
      (!plannedOnly || Boolean(data.briefs[event.id])) &&
      `${event.title} ${event.note}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const monthEvents = filtered.filter((event) => overlaps(event, start, end));
  const visible = view === "agenda" || query.trim() ? filtered : monthEvents;
  const selected =
    visible.find((event) => event.id === selectedId) ??
    visible.find((event) => event.title === "Halloween") ??
    visible.find((event) => event.start >= today && !event.observed) ??
    visible[0];
  const dayEvents = monthEvents.filter((event) =>
    overlaps(event, selectedDay, selectedDay),
  );
  const windows = monthEvents.filter(
    (event) => daysBetween(event.start, event.end) > 14,
  );
  const upcoming = events
    .filter(
      (event) =>
        event.end >= today &&
        event.start >= today &&
        !event.observed &&
        daysBetween(event.start, event.end) <= 14,
    )
    .slice(0, 4);
  const briefCount = events.filter((event) => data.briefs[event.id]).length;
  const cells = monthDays(year, month);
  const isAgenda = view === "agenda" || Boolean(query.trim());
  const firstYear = YEARS[0],
    lastYear = YEARS[YEARS.length - 1];

  function choose(event: Occasion, jump = false) {
    setSelectedId(event.id);
    const focus = event.start < `${year}-01-01` ? `${year}-01-01` : event.start;
    setSelectedDay(focus);
    if (jump) {
      setMonth(Number(focus.slice(5, 7)));
      setView("month");
      setQuery("");
      setCategory("all");
      setPlannedOnly(false);
    }
  }
  function moveMonth(offset: number) {
    const date = dateValue(isoDate(year, month + offset, 1));
    if (date.getUTCFullYear() < firstYear || date.getUTCFullYear() > lastYear)
      return;
    setYear(date.getUTCFullYear());
    setMonth(date.getUTCMonth() + 1);
    setSelectedId("");
    setSelectedDay(isoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  }
  function changeYear(next: number) {
    setYear(next);
    setSelectedId("");
    setSelectedDay(isoDate(next, month, 1));
  }
  function selectDay(day: string) {
    const nextYear = Number(day.slice(0, 4));
    if (nextYear < firstYear || nextYear > lastYear) return;
    setYear(nextYear);
    setMonth(Number(day.slice(5, 7)));
    setSelectedDay(day);
    const event = filtered.find(
      (item) =>
        overlaps(item, day, day) && daysBetween(item.start, item.end) <= 14,
    );
    setSelectedId(event?.id ?? "");
  }
  function goToday() {
    if (!YEARS.includes(currentYear as (typeof YEARS)[number])) {
      setNotice("Today's year is outside the reviewed 2026–2028 calendar.");
      return;
    }
    setYear(currentYear);
    setMonth(Number(today.slice(5, 7)));
    setSelectedDay(today);
    setSelectedId("");
    setQuery("");
    setCategory("all");
    setPlannedOnly(false);
    setView("month");
  }
  function save(event: Occasion, brief: OutfitBrief): boolean {
    try {
      update((current) => ({
        ...current,
        briefs: { ...current.briefs, [event.id]: brief },
      }));
      setNotice(`Outfit brief saved for ${event.title}.`);
      return true;
    } catch {
      setNotice(
        "Could not save. Check browser storage permissions; your unsaved brief is still in the form.",
      );
      return false;
    }
  }
  function deleteCustom(event: Occasion) {
    try {
      update((current) => {
        const briefs = { ...current.briefs };
        delete briefs[event.id];
        return {
          ...current,
          custom: current.custom.filter((item) => item.id !== event.id),
          briefs,
        };
      });
      setSelectedId("");
      setNotice("Custom occasion removed.");
    } catch {
      setNotice(
        "Could not remove this occasion. Check browser storage permissions.",
      );
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <div className={styles.eyebrow}>
            <span /> OUTFIT CALENDAR · UNITED STATES
          </div>
          <h1>
            Every occasion.
            <br className={styles.mobileBreak} /> A new style story.
          </h1>
          <p>
            Your holiday calendar for outfit ideas, seasonal edits, and the
            moments that matter.
          </p>
        </div>
        <button className={styles.primary} onClick={() => setCustomOpen(true)}>
          <Plus size={17} /> Add occasion
        </button>
      </div>

      <section className={styles.overview} aria-label="Calendar overview">
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <CalendarDays size={21} />
          </span>
          <div>
            <strong>
              {events.filter((event) => !event.observed).length}
              <small> occasions</small>
            </strong>
            <p>On your {year} calendar</p>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <Sparkles size={21} />
          </span>
          <div>
            <strong>
              {
                events.filter(
                  (event) => overlaps(event, start, end) && !event.observed,
                ).length
              }
              <small> this month</small>
            </strong>
            <p>Moments to create for</p>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>
            <Shirt size={21} />
          </span>
          <div>
            <strong>
              {briefCount}
              <small> outfit briefs</small>
            </strong>
            <p>Saved in this browser</p>
          </div>
        </div>
        <div className={styles.region}>
          <Globe2 size={19} />
          <div>
            <strong>United States</strong>
            <p>Reviewed dates · 2026–2028</p>
          </div>
        </div>
      </section>

      <div className={styles.workspace}>
        <section className={styles.calendar} aria-label="Holiday calendar">
          <div className={styles.toolbar}>
            <div className={styles.period}>
              <div className={styles.arrows}>
                <button
                  aria-label="Previous month"
                  onClick={() => moveMonth(-1)}
                  disabled={year === firstYear && month === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  aria-label="Next month"
                  onClick={() => moveMonth(1)}
                  disabled={year === lastYear && month === 12}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <h2>{MONTHS[month - 1]}</h2>
              <select
                aria-label="Calendar year"
                value={year}
                onChange={(event) => changeYear(Number(event.target.value))}
              >
                {YEARS.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <button className={styles.today} onClick={goToday}>
                Today
              </button>
            </div>
            <div className={styles.viewToggle}>
              <button
                aria-pressed={!isAgenda}
                onClick={() => {
                  setView("month");
                  setQuery("");
                }}
              >
                <CalendarDays size={15} /> Month
              </button>
              <button aria-pressed={isAgenda} onClick={() => setView("agenda")}>
                <List size={15} /> Year agenda
              </button>
            </div>
          </div>
          <div className={styles.filters}>
            <label className={styles.search}>
              <Search size={17} />
              <input
                aria-label="Search occasions"
                placeholder="Find a holiday or occasion…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={14} />
                </button>
              ) : null}
            </label>
            <select
              aria-label="Occasion category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as Category | "all")
              }
            >
              <option value="all">All occasions</option>
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <button
              className={styles.planned}
              aria-pressed={plannedOnly}
              onClick={() => setPlannedOnly(!plannedOnly)}
            >
              <Check size={14} /> With brief
            </button>
          </div>

          {isAgenda ? (
            <div className={styles.agenda}>
              <div className={styles.agendaTitle}>
                {query.trim()
                  ? `Search results for “${query.trim()}”`
                  : `${year} · All occasions`}
                <span>{filtered.length} results</span>
              </div>
              {filtered.length ? (
                filtered.map((event) => (
                  <button
                    key={event.id}
                    className={`${styles.agendaRow} ${selected?.id === event.id ? styles.agendaSelected : ""}`}
                    style={eventStyle(event)}
                    onClick={() => choose(event)}
                  >
                    <span className={styles.agendaDate}>
                      {dateRange(event)}
                    </span>
                    <span className={styles.agendaName}>
                      <i />
                      <strong>{event.title}</strong>
                      {event.observed ? <small>Observed</small> : null}
                    </span>
                    <span className={styles.agendaCategory}>
                      {CATEGORIES[event.category].label}
                    </span>
                    {data.briefs[event.id] ? (
                      <Check size={16} aria-label="Brief saved" />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                ))
              ) : (
                <EmptyState
                  onAdd={() => setCustomOpen(true)}
                  onReset={() => {
                    setQuery("");
                    setCategory("all");
                    setPlannedOnly(false);
                  }}
                />
              )}
            </div>
          ) : (
            <>
              <div className={styles.weekdays}>
                {WEEKDAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className={styles.grid}>
                {cells.map((day) => {
                  const inMonth = Number(day.slice(5, 7)) === month;
                  const daily = monthEvents.filter(
                    (event) =>
                      overlaps(event, day, day) &&
                      daysBetween(event.start, event.end) <= 14,
                  );
                  return (
                    <div
                      key={day}
                      className={`${styles.cell} ${!inMonth ? styles.outside : ""} ${day === selectedDay ? styles.selectedDay : ""}`}
                    >
                      <button
                        className={`${styles.dayNumber} ${day === today ? styles.currentDay : ""}`}
                        aria-label={`Select ${formatDate(day, { month: "long", year: "numeric" })}`}
                        aria-pressed={day === selectedDay}
                        disabled={
                          Number(day.slice(0, 4)) < firstYear ||
                          Number(day.slice(0, 4)) > lastYear
                        }
                        onClick={() => selectDay(day)}
                      >
                        {Number(day.slice(8, 10))}
                      </button>
                      <div className={styles.dayEvents}>
                        {inMonth
                          ? daily.slice(0, 3).map((event) => (
                              <button
                                key={event.id}
                                className={`${styles.event} ${selected?.id === event.id ? styles.eventSelected : ""}`}
                                style={eventStyle(event)}
                                title={`${event.title} · ${dateRange(event)}`}
                                onClick={() => {
                                  setSelectedId(event.id);
                                  setSelectedDay(day);
                                }}
                              >
                                <i />
                                <span>{event.title}</span>
                                {data.briefs[event.id] ? (
                                  <Check size={11} />
                                ) : null}
                              </button>
                            ))
                          : null}
                        {inMonth && daily.length > 3 ? (
                          <button
                            className={styles.more}
                            aria-label={`Show all ${daily.length} occasions on ${formatDate(day)}`}
                            onClick={() => {
                              setSelectedDay(day);
                              setSelectedId(daily[0].id);
                            }}
                          >
                            +{daily.length - 3} more
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.legend}>
                {Object.entries(CATEGORIES).map(([key, info]) => (
                  <span key={key}>
                    <i style={{ background: info.color }} />
                    {info.label
                      .replace(" holidays", "")
                      .replace(" & celebrations", "")
                      .replace(" moments", "")}
                  </span>
                ))}
              </div>
              {windows.length ? (
                <div className={styles.windows}>
                  <div className={styles.windowsLabel}>
                    <Palette size={16} /> ALSO IN SEASON
                  </div>
                  <div>
                    {windows.map((event) => (
                      <button
                        key={event.id}
                        style={eventStyle(event)}
                        onClick={() => choose(event)}
                      >
                        <i />
                        {event.title}
                        <ArrowRight size={13} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {!monthEvents.length ? (
                <EmptyState
                  onAdd={() => setCustomOpen(true)}
                  onReset={() => {
                    setCategory("all");
                    setPlannedOnly(false);
                  }}
                />
              ) : null}
              <div className={styles.dayList}>
                <div>
                  <strong>
                    {formatDate(selectedDay, {
                      month: "long",
                      weekday: "long",
                    })}
                  </strong>
                  <span>
                    {dayEvents.length
                      ? `${dayEvents.length} occasion${dayEvents.length === 1 ? "" : "s"}`
                      : "A little room for something new"}
                  </span>
                </div>
                <div>
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => choose(event)}
                      style={eventStyle(event)}
                    >
                      <i />
                      {event.title}
                    </button>
                  ))}
                  <button onClick={() => setCustomOpen(true)}>
                    <Plus size={14} /> Add to this date
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className={styles.detail} aria-label="Occasion outfit planner">
          {selected ? (
            <>
              <div className={styles.detailHero} style={eventStyle(selected)}>
                <div className={styles.detailTop}>
                  <span className={styles.categoryBadge}>
                    <i />
                    {CATEGORIES[selected.category].label}
                  </span>
                  {data.briefs[selected.id] ? (
                    <span className={styles.savedBadge}>
                      <Check size={12} /> Brief saved
                    </span>
                  ) : null}
                </div>
                <div className={styles.dateBadge}>
                  <span>
                    {formatDate(
                      selected.start < `${year}-01-01`
                        ? `${year}-01-01`
                        : selected.start,
                      { month: "short", day: undefined },
                    )}
                  </span>
                  <strong>
                    {Number(
                      (selected.start < `${year}-01-01`
                        ? `${year}-01-01`
                        : selected.start
                      ).slice(8, 10),
                    )}
                  </strong>
                </div>
                <h2>{selected.title}</h2>
                <p>
                  {dateRange(selected)}
                  {daysBetween(today, selected.start) >= 0
                    ? ` · In ${daysBetween(today, selected.start)} days`
                    : selected.end >= today
                      ? " · Happening now"
                      : " · Past occasion"}
                </p>
                <div className={styles.decorativeRings} aria-hidden />
              </div>
              <div className={styles.detailBody}>
                {selected.note ? (
                  <p className={styles.eventNote}>
                    {selected.note}{" "}
                    {selected.source ? (
                      <a
                        href={selected.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Date source ↗
                      </a>
                    ) : null}
                  </p>
                ) : selected.source ? (
                  <a
                    className={styles.source}
                    href={selected.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Date source ↗
                  </a>
                ) : null}
                <div className={styles.inspiration}>
                  <div className={styles.sectionLabel}>
                    <Sparkles size={15} /> OUTFIT INSPIRATION
                  </div>
                  <h3>{outfitIdeas(selected).direction}</h3>
                  <div className={styles.swatches}>
                    {outfitIdeas(selected).palette.map((color) => (
                      <span
                        key={color}
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                    <span className={styles.paletteCaption}>
                      Suggested palette
                    </span>
                  </div>
                  <ul>
                    {outfitIdeas(selected).pieces.map((piece) => (
                      <li key={piece}>
                        <Check size={13} />
                        {piece}
                      </li>
                    ))}
                  </ul>
                </div>
                {ready ? (
                  <BriefEditor
                    key={selected.id}
                    event={selected}
                    saved={data.briefs[selected.id]}
                    onSave={(brief) => save(selected, brief)}
                    blocked={Boolean(error)}
                    onExport={(brief) =>
                      downloadJSON(
                        { occasion: selected, brief },
                        `${selected.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-outfit-brief.json`,
                      )
                    }
                  />
                ) : (
                  <p className={styles.eventNote}>Loading your local brief…</p>
                )}
                {selected.category === "custom" ? (
                  <button
                    className={styles.delete}
                    onClick={() => deleteCustom(selected)}
                  >
                    <Trash2 size={14} /> Remove custom occasion
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <CalendarDays size={34} />
              <h2>Make room for a new look.</h2>
              <p>
                No occasions match your filters. Reset them or add your own
                moment.
              </p>
            </div>
          )}
        </aside>
      </div>

      {upcoming.length ? (
        <section className={styles.upcoming} aria-label="Upcoming occasions">
          <div className={styles.upcomingHeading}>
            <div>
              <span className={styles.eyebrow}>GET AHEAD OF THE MOMENT</span>
              <h2>Coming up next</h2>
            </div>
            <button
              onClick={() => {
                setView("agenda");
                setQuery("");
                setCategory("all");
                setPlannedOnly(false);
              }}
            >
              Explore the year <ArrowRight size={15} />
            </button>
          </div>
          <div className={styles.upcomingCards}>
            {upcoming.map((event) => (
              <button
                key={event.id}
                style={eventStyle(event)}
                onClick={() => choose(event, true)}
              >
                <span className={styles.upcomingDate}>
                  {formatDate(event.start, { month: "short", day: undefined })}
                  <strong>{Number(event.start.slice(8, 10))}</strong>
                </span>
                <span className={styles.upcomingText}>
                  <small>{CATEGORIES[event.category].label}</small>
                  <strong>{event.title}</strong>
                  <span>
                    {data.briefs[event.id]
                      ? "Brief ready"
                      : `${daysBetween(today, event.start)} days to go`}
                  </span>
                </span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <footer className={styles.footer}>
        <p>
          <span /> Local planning workspace · Briefs and custom occasions are
          saved in this browser.
        </p>
        <button
          onClick={() => {
            try {
              const raw = window.localStorage.getItem(PLANNING_KEY);
              let backup: unknown = data;
              if (raw) {
                try {
                  backup = JSON.parse(raw);
                } catch {
                  backup = { unparsedStorage: raw };
                }
              }
              downloadJSON(backup, `primestyle-outfit-plans-${year}.json`);
              setNotice("Planning backup downloaded.");
            } catch {
              setNotice(
                "Could not export the planning backup. Browser storage may be unavailable or unreadable.",
              );
            }
          }}
        >
          <ArrowDownToLine size={14} /> Export plans
        </button>
        <p className={styles.coverage}>
          Includes all 11 federal holidays and major U.S. cultural, religious,
          shopping, and seasonal occasions. State-specific and community events
          can be added. Seasonal windows are suggestions.
        </p>
      </footer>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <p className={styles.notice} role="status" aria-live="polite">
        {notice}
      </p>

      <Dialog.Root open={customOpen} onOpenChange={setCustomOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.modal} data-customer-theme={theme}>
            <div className={styles.modalHeading}>
              <div>
                <Dialog.Title>Add an occasion</Dialog.Title>
                <Dialog.Description>
                  A campaign, celebration, or any day worth dressing for.
                </Dialog.Description>
              </div>
              <Dialog.Close
                className={styles.iconButton}
                aria-label="Close add occasion"
              >
                <X size={20} />
              </Dialog.Close>
            </div>
            <CustomOccasionForm
              key={customOpen ? selectedDay : "closed"}
              defaultDate={
                validDate(selectedDay) &&
                Number(selectedDay.slice(0, 4)) >= firstYear &&
                Number(selectedDay.slice(0, 4)) <= lastYear
                  ? selectedDay
                  : start
              }
              onSubmit={(event) => {
                try {
                  update((current) => ({
                    ...current,
                    custom: [...current.custom, event],
                  }));
                  setYear(Number(event.start.slice(0, 4)));
                  setMonth(Number(event.start.slice(5, 7)));
                  setSelectedId(event.id);
                  setSelectedDay(event.start);
                  setQuery("");
                  setCategory("all");
                  setPlannedOnly(false);
                  setCustomOpen(false);
                  setNotice(`Added ${event.title}.`);
                  return true;
                } catch {
                  return false;
                }
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function EmptyState({
  onAdd,
  onReset,
}: {
  onAdd: () => void;
  onReset: () => void;
}) {
  return (
    <div className={styles.empty}>
      <Search size={24} />
      <h3>No occasions found</h3>
      <p>Try a different search or add a custom occasion.</p>
      <div>
        <button onClick={onReset}>Reset filters</button>
        <button onClick={onAdd}>
          <Plus size={14} /> Add occasion
        </button>
      </div>
    </div>
  );
}

function BriefEditor({
  event,
  saved,
  onSave,
  onExport,
  blocked,
}: {
  event: Occasion;
  saved?: OutfitBrief;
  onSave: (brief: OutfitBrief) => boolean;
  onExport: (brief: OutfitBrief) => void;
  blocked: boolean;
}) {
  const [brief, setBrief] = useState<OutfitBrief>(
    () => saved ?? defaultBrief(event),
  );
  const [saveError, setSaveError] = useState("");
  const changed = JSON.stringify(brief) !== JSON.stringify(saved);
  const kickoff = addDays(event.start, -brief.leadDays);
  return (
    <form
      className={styles.brief}
      onSubmit={(submit) => {
        submit.preventDefault();
        setSaveError(
          onSave(brief)
            ? ""
            : "Your brief could not be saved. Try exporting it as a backup.",
        );
      }}
    >
      <div className={styles.briefTitle}>
        <Shirt size={16} />
        <h3>Your outfit brief</h3>
        <span>
          {saved
            ? changed
              ? "Unsaved edits"
              : "Saved locally"
            : "Not planned yet"}
        </span>
      </div>
      <label>
        Audience
        <select
          value={brief.audience}
          onChange={(e) => setBrief({ ...brief, audience: e.target.value })}
        >
          {["Everyone", "Women", "Men", "Kids", "Couples & groups"].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </select>
      </label>
      <label>
        Style direction
        <input
          required
          maxLength={160}
          value={brief.direction}
          onChange={(e) => setBrief({ ...brief, direction: e.target.value })}
          placeholder="Describe the look you want"
        />
      </label>
      <label>
        Outfit notes
        <textarea
          rows={3}
          maxLength={3000}
          placeholder="Key pieces, colors, dress code, or campaign ideas…"
          value={brief.notes}
          onChange={(e) => setBrief({ ...brief, notes: e.target.value })}
        />
      </label>
      <div className={styles.leadTime}>
        <label>
          Plan ahead
          <input
            type="number"
            min={0}
            max={365}
            required
            value={brief.leadDays}
            onChange={(e) =>
              setBrief({ ...brief, leadDays: Number(e.target.value) })
            }
          />
          <span>days</span>
        </label>
        <p>
          Start preparing
          <br />
          <strong>{formatDate(kickoff, { year: "numeric" })}</strong>
        </p>
      </div>
      <button
        className={styles.primary}
        type="submit"
        disabled={blocked || !changed}
      >
        {saved && !changed ? <Check size={16} /> : <Shirt size={16} />}
        {saved && !changed ? "Brief saved" : "Save outfit brief"}
      </button>
      <button
        className={styles.exportBrief}
        type="button"
        onClick={() => onExport(brief)}
      >
        <ArrowDownToLine size={13} /> Download this brief
      </button>
      {saveError ? (
        <p className={styles.error} role="alert">
          {saveError}
        </p>
      ) : null}
    </form>
  );
}

function CustomOccasionForm({
  defaultDate,
  onSubmit,
}: {
  defaultDate: string;
  onSubmit: (event: Occasion) => boolean;
}) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(defaultDate);
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (
      !title.trim() ||
      !validDate(start) ||
      (end && (!validDate(end) || end < start)) ||
      Number(start.slice(0, 4)) < YEARS[0] ||
      Number((end || start).slice(0, 4)) > YEARS[YEARS.length - 1]
    ) {
      setError(
        "Enter a name and valid dates in 2026–2028. The end date must follow the start date.",
      );
      return;
    }
    if (
      !onSubmit({
        id: `custom:${crypto.randomUUID()}`,
        title: title.trim(),
        category: "custom",
        start,
        end: end || start,
        note: note.trim(),
      })
    )
      setError(
        "Could not save this occasion. Check browser storage permissions.",
      );
  }
  return (
    <form className={styles.customForm} onSubmit={submit}>
      <label>
        Occasion name
        <input
          autoFocus
          required
          maxLength={100}
          placeholder="e.g. Fall collection launch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <div className={styles.dateFields}>
        <label>
          Start date
          <input
            type="date"
            required
            min={`${YEARS[0]}-01-01`}
            max={`${YEARS[YEARS.length - 1]}-12-31`}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label>
          End date <small>(optional)</small>
          <input
            type="date"
            min={start}
            max={`${YEARS[YEARS.length - 1]}-12-31`}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
      </div>
      <label>
        Details
        <textarea
          rows={3}
          maxLength={1000}
          placeholder="Venue, audience, or anything to keep in mind…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <p className={styles.localNote}>
        Saved locally in this browser. You can export a backup anytime.
      </p>
      <button className={styles.primary} type="submit">
        <Plus size={16} /> Add to calendar
      </button>
    </form>
  );
}
