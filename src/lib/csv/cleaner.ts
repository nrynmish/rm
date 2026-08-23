import type { RawStudentRecord } from "./parser";

function cleanName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function cleanGender(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase();

  if (raw === "m" || raw === "male" || raw === "1") {
    return "Male";
  }

  if (raw === "f" || raw === "female" || raw === "0") {
    return "Female";
  }

  if (!raw) {
    return "";
  }

  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function cleanGrade(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "");
}

function cleanMark(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw) {
    return null;
  }

  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) ? parsed : null;
}

export type CleanedRecord = {
  name: string;
  gender: string;
  grade: string;
  math: number | null;
  science: number | null;
  english: number | null;
  total: number | null;
  typoFixed: boolean;
};

export function cleanRecords(records: RawStudentRecord[]): {
  records: CleanedRecord[];
  missingResolved: number;
  typosFixed: number;
} {
  let missingResolved = 0;
  let typosFixed = 0;

  const cleaned = records.map((record) => {
    const rawName = String(record.name ?? "").trim();

    const name = cleanName(record.name);
    const gender = cleanGender(record.gender);
    const grade = cleanGrade(record.grade);

    const math = cleanMark(record.math);
    const science = cleanMark(record.science);
    const english = cleanMark(record.english);
    const total = cleanMark(record.total);

    const changedName = name !== rawName;

    if (changedName) {
      typosFixed++;
    }

    return {
      name,
      gender,
      grade,
      math,
      science,
      english,
      total,
      typoFixed: changedName,
    };
  });

  const means = {
    math: columnMean(cleaned.map((r) => r.math)),
    science: columnMean(cleaned.map((r) => r.science)),
    english: columnMean(cleaned.map((r) => r.english)),
  };

  for (const record of cleaned) {
    if (record.math === null) {
      record.math = means.math;
      missingResolved++;
    }

    if (record.science === null) {
      record.science = means.science;
      missingResolved++;
    }

    if (record.english === null) {
      record.english = means.english;
      missingResolved++;
    }
  }

  return {
    records: cleaned,
    missingResolved,
    typosFixed,
  };
}

function columnMean(values: Array<number | null>): number {
  const valid = values.filter(
    (value): value is number => value !== null
  );

  if (valid.length === 0) {
    return 0;
  }

  const mean =
    valid.reduce((sum, value) => sum + value, 0) /
    valid.length;

  return Math.round(mean);
}