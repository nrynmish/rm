"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileDown,
  Users,
  UserX,
} from "lucide-react";

import { useStudentStore } from "@/store/student-store";

export default function DashboardPage() {
  const students = useStudentStore((state) => state.students);
  const report = useStudentStore(
    (state) => state.cleaningReport
  );

  const active = students.filter(
    (student) => student.status === "Active"
  ).length;

  const debarred = students.filter(
    (student) => student.status === "Debarred"
  ).length;

  const metrics = [
    {
      label: "Total students",
      value: students.length,
      icon: Database,
    },
    {
      label: "Active",
      value: active,
      icon: Users,
    },
    {
      label: "Debarred",
      value: debarred,
      icon: UserX,
    },
    {
      label: "Name corrections",
      value: report?.typosFixed ?? 0,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-[#71717A]">
          Student data pipeline overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-xl border border-[#E7E7EB] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#71717A]">
                  {metric.label}
                </p>

                <Icon
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#A1A1AA]"
                />
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {metric.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
          <div>
            <h3 className="text-sm font-semibold">
              Cleaning status
            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              Latest dataset processing summary.
            </p>
          </div>

          {report ? (
            <div className="mt-5 space-y-3">
              <StatusRow
                label="Original rows"
                value={report.original}
              />

              <StatusRow
                label="Final rows"
                value={report.final}
              />

              <StatusRow
                label="Duplicates removed"
                value={report.duplicatesRemoved}
              />

              <StatusRow
                label="Missing values resolved"
                value={report.missingResolved}
              />

              <StatusRow
                label="Typos / casing fixed"
                value={report.typosFixed}
              />

              <StatusRow
                label="Totals recalculated"
                value={report.totalsRecalculated}
              />
            </div>
          ) : (
            <div className="mt-5 rounded-lg bg-[#FAFAFA] px-4 py-8 text-center text-sm text-[#71717A]">
              No dataset has been processed yet.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
          <div>
            <h3 className="text-sm font-semibold">
              Quick actions
            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              Continue working with the current dataset.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <QuickAction
              href="/dataset"
              label="View dataset"
              description="Search and filter student records."
              icon={Database}
            />

            <QuickAction
              href="/shortlist"
              label="Review shortlist"
              description={`${active.toLocaleString()} active students`}
              icon={Users}
            />

            <QuickAction
              href="/export"
              label="Export shortlist"
              description="Download the current active students."
              icon={FileDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#F0F0F2] pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-[#52525B]">
        {label}
      </span>

      <span className="text-sm font-medium">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function QuickAction({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: typeof Database;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-lg border border-[#E7E7EB] p-3 transition-colors hover:bg-[#FAFAFA]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F5]">
        <Icon
          size={17}
          strokeWidth={1.7}
          className="text-[#52525B]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-[#71717A]">
          {description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="text-[#A1A1AA] transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}