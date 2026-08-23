"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/dataset": "Dataset",
  "/cleaning": "Cleaning",
  "/shortlist": "Shortlist",
  "/export": "Export",
};

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[#E7E7EB] bg-white px-8">
      <div>
        <h1 className="text-[15px] font-semibold tracking-tight">
          {titles[pathname] ?? "DTU RM Portal"}
        </h1>
      </div>

      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#71717A] transition-colors hover:bg-[#F7F7F9] hover:text-[#18181B]"
      >
        <Bell size={17} strokeWidth={1.8} />
      </button>
    </header>
  );
}
