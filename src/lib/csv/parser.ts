import Papa from "papaparse";

export type RawStudentRecord = Record<string, unknown>;

function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const HEADER_ALIASES: Record<string, string> = {
  name: "name",
  student: "name",

  gender: "gender",
  sex: "gender",

  grade: "grade",
  class: "grade",

  math: "math",
  maths: "math",
  mathematics: "math",

  science: "science",
  sci: "science",

  english: "english",
  eng: "english",

  total: "total",
  score: "total",
};

export function parseCSV(csvText: string): RawStudentRecord[] {
  const result = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      const normalized = normalizeHeader(header);
      return HEADER_ALIASES[normalized] ?? normalized;
    },
  });

  if (result.errors.length > 0) {
    const error = result.errors[0];

    throw new Error(
      `CSV parsing failed: ${error.message}`
    );
  }

  return result.data;
}