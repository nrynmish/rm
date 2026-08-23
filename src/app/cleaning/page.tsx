"use client";

import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileCheck2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useStudentStore } from "@/store/student-store";

export default function CleaningPage() {
  const report = useStudentStore(
    (state) => state.cleaningReport
  );

  if (!report) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Cleaning
          </h2>

          <p className="mt-1 text-sm text-[#71717A]">
            Review the dataset cleaning report.
          </p>
        </div>

        <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-[#D4D4D8] bg-white">
          <div className="text-center">
            <Database
              size={32}
              strokeWidth={1.5}
              className="mx-auto text-[#A1A1AA]"
            />

            <h3 className="mt-4 text-sm font-semibold">
              No dataset processed
            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              Upload a CSV from the Dataset page to generate
              a cleaning report.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Original rows",
      value: report.original,
      icon: Database,
    },
    {
      label: "Final rows",
      value: report.final,
      icon: FileCheck2,
    },
    {
      label: "Duplicates removed",
      value: report.duplicatesRemoved,
      icon: RefreshCw,
    },
    {
      label: "Missing resolved",
      value: report.missingResolved,
      icon: AlertCircle,
    },
    {
      label: "Typos / casing fixed",
      value: report.typosFixed,
      icon: Sparkles,
    },
    {
      label: "Totals recalculated",
      value: report.totalsRecalculated,
      icon: RefreshCw,
    },
  ];

  const isClean =
    report.duplicatesRemoved === 0 &&
    report.missingResolved === 0 &&
    report.totalsRecalculated === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Cleaning
        </h2>

        <p className="mt-1 text-sm text-[#71717A]">
          Review the dataset cleaning report.
        </p>
      </div>

      <div
        className={
          isClean
            ? "flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4"
            : "flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
        }
      >
        {isClean ? (
          <CheckCircle2
            size={20}
            className="text-emerald-600"
          />
        ) : (
          <AlertCircle
            size={20}
            className="text-amber-600"
          />
        )}

        <div>
          <p
            className={
              isClean
                ? "text-sm font-semibold text-emerald-800"
                : "text-sm font-semibold text-amber-800"
            }
          >
            {isClean
              ? "Dataset cleaned successfully"
              : "Dataset requires attention"}
          </p>

          <p
            className={
              isClean
                ? "mt-0.5 text-xs text-emerald-700"
                : "mt-0.5 text-xs text-amber-700"
            }
          >
            {report.final.toLocaleString()} cleaned records
            are currently loaded.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                  size={17}
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

      <div className="rounded-xl border border-[#E7E7EB] bg-white p-5">
        <h3 className="text-sm font-semibold">
          Cleaning summary
        </h3>

        <div className="mt-4 divide-y divide-[#F0F0F2]">
          <SummaryRow
            label="Rows retained"
            value={`${report.final.toLocaleString()} / ${report.original.toLocaleString()}`}
          />

          <SummaryRow
            label="Duplicate records"
            value={report.duplicatesRemoved.toLocaleString()}
          />

          <SummaryRow
            label="Missing values resolved"
            value={report.missingResolved.toLocaleString()}
          />

          <SummaryRow
            label="Name / casing corrections"
            value={report.typosFixed.toLocaleString()}
          />

          <SummaryRow
            label="Totals recalculated"
            value={report.totalsRecalculated.toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[#52525B]">
        {label}
      </span>

      <span className="text-sm font-medium text-[#18181B]">
        {value}
      </span>
    </div>
  );
}