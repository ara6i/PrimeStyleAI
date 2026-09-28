export const ATELIER_JACKET_SIZES = ["XS", "S", "M", "L", "XL"] as const;

export type AtelierJacketSize = (typeof ATELIER_JACKET_SIZES)[number];
export type AtelierJacketSizeUnit = "cm" | "in";

export type AtelierJacketSizeRow = {
  size: AtelierJacketSize;
  chest: readonly [number, number];
  waist: readonly [number, number];
  hip: readonly [number, number];
  shoulder: number;
  sleeve: number;
  length: number;
};

export const ATELIER_JACKET_SIZE_ROWS: readonly AtelierJacketSizeRow[] = [
  {
    size: "XS",
    chest: [80, 84],
    waist: [62, 66],
    hip: [86, 90],
    shoulder: 38.5,
    sleeve: 60,
    length: 95,
  },
  {
    size: "S",
    chest: [84.5, 88.5],
    waist: [66.5, 70.5],
    hip: [90.5, 94.5],
    shoulder: 39.7,
    sleeve: 60.5,
    length: 96.5,
  },
  {
    size: "M",
    chest: [89, 93],
    waist: [71, 75],
    hip: [95, 99],
    shoulder: 40.9,
    sleeve: 61,
    length: 98,
  },
  {
    size: "L",
    chest: [93.5, 97.5],
    waist: [75.5, 79.5],
    hip: [99.5, 103.5],
    shoulder: 42.1,
    sleeve: 61.5,
    length: 99.5,
  },
  {
    size: "XL",
    chest: [98, 102],
    waist: [80, 84],
    hip: [104, 108],
    shoulder: 43.3,
    sleeve: 62,
    length: 101,
  },
];

export function formatJacketMeasurement(
  value: number,
  unit: AtelierJacketSizeUnit,
) {
  if (unit === "in") return (value / 2.54).toFixed(1);
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatJacketRange(
  range: readonly [number, number],
  unit: AtelierJacketSizeUnit,
) {
  return range.map((value) => formatJacketMeasurement(value, unit)).join("–");
}
