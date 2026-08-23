"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Database,
  FileCheck2,
  Filter,
  Download,
} from "lucide-react";

const overviewItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
];

const dataItems = [
  {
    label: "Dataset",
    href: "/dataset",
    icon: Database,
  },
  {
    label: "Cleaning",
    href: "/cleaning",
    icon: FileCheck2,
  },
];

const recruitmentItems = [
  {
    label: "Shortlist",
    href: "/shortlist",
    icon: Filter,
  },
  {
    label: "Export",
    href: "/export",
    icon: Download,
  },
];

function NavItem({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-[#F1F1F4] font-medium text-[#18181B]"
          : "text-[#71717A] hover:bg-[#F7F7F9] hover:text-[#18181B]"
      }`}
    >
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[232px] flex-col border-r border-[#E7E7EB] bg-white">
      {/* Branding */}
      <div className="flex h-[68px] items-center border-b border-[#E7E7EB] px-5">
        <div className="flex items-center gap-3">
          <Image
            src="/dtu-logo.png"
            alt="DTU"
            width={34}
            height={34}
            className="h-8 w-8 object-contain"
            priority
          />

          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold tracking-tight text-[#18181B]">
              DTU RM Portal
            </div>

            <div className="mt-0.5 text-[11px] text-[#71717A]">
              Student Selection
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 px-3 py-6">
        <div>
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Overview
          </div>

          <div className="space-y-1">
            {overviewItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Data
          </div>

          <div className="space-y-1">
            {dataItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Recruitment
          </div>

          <div className="space-y-1">
            {recruitmentItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-[#E7E7EB] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#F7F7F9]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#18181B] text-[11px] font-medium text-white">
            RM
          </div>

          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-[#18181B]">
              Recruitment Manager
            </div>

            <div className="truncate text-[11px] text-[#71717A]">
              DTU
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}