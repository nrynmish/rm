"use client";

import { useMemo, useState } from "react";
import { Search, UserCheck } from "lucide-react";

import { useStudentStore } from "@/store/student-store";

const PAGE_SIZE = 10;

export default function ShortlistPage() {
  const students = useStudentStore((state) => state.students);
  const toggleStudentStatus = useStudentStore(
    (state) => state.toggleStudentStatus
  );

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [grade, setGrade] = useState("All");
  const [minScore, setMinScore] = useState("");
  const [page, setPage] = useState(1);

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

  const eligibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      if (student.status !== "Active") {
        return false;
      }

      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query);

      const matchesGender =
        gender === "All" || student.gender === gender;

      const matchesGrade =
        grade === "All" || student.grade === grade;

    const matchesScore =
        !minScore || student.total >= Number(minScore);

      return (
        matchesSearch &&
        matchesGender &&
        matchesGrade && 
        matchesScore
      );
    });
  }, [students, search, gender, grade, minScore]);

  const averageScore = eligibleStudents.length
    ? eligibleStudents.reduce(
        (sum, student) => sum + student.total,
        0
      ) / eligibleStudents.length
    : 0;

  const totalPages = Math.max(
    1,
    Math.ceil(eligibleStudents.length / PAGE_SIZE)
  );

  const visibleStudents = eligibleStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateGender(value: string) {
    setGender(value);
    setPage(1);
  }

  function updateGrade(value: string) {
    setGrade(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Shortlist
        </h2>

        <p className="mt-1 text-sm text-[#71717A]">
          Filter eligible candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#71717A]">
              Eligible candidates
            </p>

            <UserCheck
              size={18}
              strokeWidth={1.7}
              className="text-[#A1A1AA]"
            />
          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {eligibleStudents.length.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
          <p className="text-sm text-[#71717A]">
            Active
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {students
              .filter((student) => student.status === "Active")
              .length.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
          <p className="text-sm text-[#71717A]">
            Debarred
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {students
              .filter((student) => student.status === "Debarred")
              .length.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
          <p className="text-sm text-[#71717A]">
            Average total score
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight">
            {averageScore.toFixed(2)}
          </p>
        </div>
      </div>

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
                updateSearch(event.target.value)
              }
              placeholder="Search eligible students..."
              className="h-10 w-full rounded-lg border border-[#E4E4E7] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#A1A1AA]"
            />
          </div>

          <select
            value={gender}
            onChange={(event) =>
              updateGender(event.target.value)
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
              updateGrade(event.target.value)
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

          <input
            type="number"
            min="0"
            value={minScore}
            onChange={(event) => {
              setMinScore(event.target.value);
              setPage(1);
            }}
            placeholder="Min total score"
            className="h-10 w-[160px] rounded-lg border border-[#E4E4E7] bg-white px-3 text-sm outline-none transition focus:border-[#A1A1A1]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E7E7EB] bg-[#FAFAFA] text-left text-xs font-medium uppercase tracking-wide text-[#71717A]">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Grade</th>
                <th className="px-5 py-3 text-right">
                  Math
                </th>
                <th className="px-5 py-3 text-right">
                  Science
                </th>
                <th className="px-5 py-3 text-right">
                  English
                </th>
                <th className="px-5 py-3 text-right">
                  Total
                </th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-[#F0F0F2] last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium">
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
                    <button
                      type="button"
                      onClick={() =>
                        toggleStudentStatus(student.id)
                      }
                      className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium transition hover:bg-[#F7F7F9]"
                    >
                      Debar
                    </button>
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
                      ? "Upload a CSV from Dataset first."
                      : "No eligible students match the current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E7E7EB] px-5 py-3">
          <p className="text-sm text-[#71717A]">
            {eligibleStudents.length === 0
              ? "0 students"
              : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                  page * PAGE_SIZE,
                  eligibleStudents.length
                )} of ${eligibleStudents.length}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
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