"use client";

import { Download, FileSpreadsheet } from "lucide-react";

import { useStudentStore } from "@/store/student-store";

export default function ExportPage() {
  const students = useStudentStore((state) => state.students);

  const shortlisted = students.filter(
    (student) => student.status === "Active"
  );

  function escapeCSV(value: unknown) {
    const stringValue = String(value ?? "");

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replaceAll('"', '""')}"`;
    }

    return stringValue;
  }

  function handleExport() {
    if (shortlisted.length === 0) {
      return;
    }

    const headers = [
      "Name",
      "Gender",
      "Grade",
      "Math",
      "Science",
      "English",
      "Total",
      "Status",
    ];

    const rows = shortlisted.map((student) => [
      student.name,
      student.gender,
      student.grade,
      student.math,
      student.science,
      student.english,
      student.total,
      student.status,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row.map(escapeCSV).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "dtu-rm-shortlist.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Export
        </h2>

        <p className="mt-1 text-sm text-[#71717A]">
          Download the current shortlist.
        </p>
      </div>

      <div className="rounded-xl border border-[#E7E7EB] bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5]">
              <FileSpreadsheet
                size={20}
                strokeWidth={1.7}
                className="text-[#52525B]"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold">
                Student shortlist
              </h3>

              <p className="mt-1 text-sm text-[#71717A]">
                Export all currently active students as a
                CSV file.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#F4F4F5] px-3 py-1 text-xs font-medium text-[#52525B]">
            {shortlisted.length.toLocaleString()} students
          </span>
        </div>

        <div className="mt-6 border-t border-[#F0F0F2] pt-5">
          {students.length === 0 ? (
            <p className="text-sm text-[#71717A]">
              Upload and process a dataset before exporting.
            </p>
          ) : shortlisted.length === 0 ? (
            <p className="text-sm text-[#71717A]">
              There are currently no active students to
              export.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#27272A]"
            >
              <Download size={16} />
              Download CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}