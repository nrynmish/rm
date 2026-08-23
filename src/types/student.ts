export type StudentStatus = "Active" | "Debarred";

export type Student = {
  id: string;
  name: string;
  gender: string;
  grade: string;
  math: number;
  science: number;
  english: number;
  total: number;
  status: StudentStatus;
};

export type CleaningReport = {
  original: number;
  final: number;
  duplicatesRemoved: number;
  missingResolved: number;
  typosFixed: number;
  totalsRecalculated: number;
};