"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Search, Upload } from "lucide-react";

import { useStudentStore } from "@/store/student-store";
import type { Student } from "@/types/student";

const PAGE_SIZE = 10;

export default function DatasetPage() {
  const students = useStudentStore((state) => state.students);
  const setStudents = useStudentStore((state) => state.setStudents);
  const setCleaningReport = useStudentStore(
    (state) => state.setCleaningReport
  );
  const isProcessing = useStudentStore(
    (state) => state.isProcessing
  );
  const setIsProcessing = useStudentStore(
    (state) => state.setIsProcessing
  );

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [grade, setGrade] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query);

      const matchesGender =
        gender === "All" || student.gender === gender;

      const matchesGrade =
        grade === "All" || student.grade === grade;

      const matchesStatus =
        status === "All" || student.status === status;

      return (
        matchesSearch &&
        matchesGender &&
        matchesGrade &&
        matchesStatus
      );
    });
  }, [students, search, gender, grade, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / PAGE_SIZE)
  );

  const visibleStudents = filteredStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const genders = useMemo(
    () =>
      Array.from(
        new Set(students.map((student) => student.gender))
      ).filter(Boolean),
    [students]
  );

  const grades = useMemo(
    () =>
      Array.from(
        new Set(students.map((student) => student.grade))
      ).filter(Boolean),
    [students]
  );

  function resetPage() {
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    resetPage();
  }

  function handleGender(value: string) {
    setGender(value);
    resetPage();
  }

  function handleGrade(value: string) {
    setGrade(value);
    resetPage();
  }

  function handleStatus(value: string) {
    setStatus(value);
    resetPage();
  }

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const csv = await file.text();

      const response = await fetch("/api/clean", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csv }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Unable to process CSV."
        );
      }

      setStudents(data.students);
      setCleaningReport(data.report);
      setPage(1);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to process CSV."
      );
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Dataset
          </h2>

          <p className="mt-1 text-sm text-[#71717A]">
            View and manage cleaned student records.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#27272A]">
          <Upload size={16} />

          {isProcessing ? "Processing..." : "Upload CSV"}

          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            disabled={isProcessing}
            onChange={handleUpload}
          />
        </label>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-[#E7E7EB] bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#E7E7EB] p-4">
          <div className="relative min-w-[260px] flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
            />

            <input
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Search students..."
              className="h-10 w-full rounded-lg border border-[#E4E4E7] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#A1A1AA]"
            />
          </div>

          <select
            value={gender}
            onChange={(event) =>
              handleGender(event.target.value)
            }
            className="h-10 rounded-lg border border-[#E4E4E7] bg-white px-3 text-sm outline-none"
          >
            <option value="All">All genders</option>

            {genders.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <select
            value={grade}
            onChange={(event) =>
              handleGrade(event.target.value)
            }
            className="h-10 rounded-lg border border-[#E4E4E7] bg-white px-3 text-sm outline-none"
          >
            <option value="All">All grades</option>

            {grades.map((value) => (
              <option key={value} value={value}>
                Grade {value}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              handleStatus(event.target.value)
            }
            className="h-10 rounded-lg border border-[#E4E4E7] bg-white px-3 text-sm outline-none"
          >
            <option value="All">All status</option>
            <option value="Active">Active</option>
            <option value="Debarred">Debarred</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E7E7EB] bg-[#FAFAFA] text-left text-xs font-medium uppercase tracking-wide text-[#71717A]">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Grade</th>
                <th className="px-5 py-3 text-right">Math</th>
                <th className="px-5 py-3 text-right">
                  Science
                </th>
                <th className="px-5 py-3 text-right">
                  English
                </th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleStudents.map((student: Student) => (
                <tr
                  key={student.id}
                  className="border-b border-[#F0F0F2] last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium text-[#18181B]">
                    {student.name}
                  </td>

                  <td className="px-5 py-3.5 text-[#52525B]">
                    {student.gender}
                  </td>

                  <td className="px-5 py-3.5 text-[#52525B]">
                    {student.grade}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {student.math}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {student.science}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {student.english}
                  </td>

                  <td className="px-5 py-3.5 text-right font-semibold">
                    {student.total}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={
                        student.status === "Active"
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}

              {visibleStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-sm text-[#71717A]"
                  >
                    {students.length === 0
                      ? "Upload a CSV to load student records."
                      : "No students match the current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E7E7EB] px-5 py-3">
          <p className="text-sm text-[#71717A]">
            {filteredStudents.length === 0
              ? "0 students"
              : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                  page * PAGE_SIZE,
                  filteredStudents.length
                )} of ${filteredStudents.length}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-[#52525B]">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1)
                )
              }
              className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}