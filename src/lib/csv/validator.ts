import type { CleaningReport, Student } from "@/types/student";
import type { CleanedRecord } from "./cleaner";

function duplicateKey(record: CleanedRecord): string {
  return [
    record.name.toLowerCase(),
    record.gender,
    record.grade,
    record.math,
    record.science,
    record.english,
  ].join("|");
}

export function validateRecords(
  records: CleanedRecord[],
  originalCount: number,
  missingResolved: number,
  typosFixed: number
): {
  students: Student[];
  report: CleaningReport;
} {
  const seen = new Set<string>();
  const students: Student[] = [];

  let duplicatesRemoved = 0;
  let totalsRecalculated = 0;

  for (const record of records) {
    const key = duplicateKey(record);

    if (seen.has(key)) {
      duplicatesRemoved++;
      continue;
    }

    seen.add(key);

    const math = record.math ?? 0;
    const science = record.science ?? 0;
    const english = record.english ?? 0;

    const calculatedTotal = math + science + english;
    const suppliedTotal = record.total;

    const needsRecalculation =
      suppliedTotal === null ||
      !Number.isFinite(suppliedTotal) ||
      Math.abs(suppliedTotal - calculatedTotal) > 0.5;

    if (needsRecalculation) {
      totalsRecalculated++;
    }

    students.push({
      id: crypto.randomUUID(),
      name: record.name,
      gender: record.gender,
      grade: record.grade,
      math,
      science,
      english,
      total: calculatedTotal,
      status: "Active",
    });
  }

  const report: CleaningReport = {
    original: originalCount,
    final: students.length,
    duplicatesRemoved,
    missingResolved,
    typosFixed,
    totalsRecalculated,
  };

  return {
    students,
    report,
  };
}