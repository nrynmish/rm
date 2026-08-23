"use client";

import { create } from "zustand";
import type {
  CleaningReport,
  Student,
} from "@/types/student";

type StudentStore = {
  students: Student[];
  cleaningReport: CleaningReport | null;
  isProcessing: boolean;

  setStudents: (students: Student[]) => void;
  setCleaningReport: (report: CleaningReport) => void;
  setIsProcessing: (value: boolean) => void;

  toggleStudentStatus: (id: string) => void;
  reset: () => void;
};

const initialState = {
  students: [],
  cleaningReport: null,
  isProcessing: false,
};

export const useStudentStore = create<StudentStore>((set) => ({
  ...initialState,

  setStudents: (students) => {
    set({ students });
  },

  setCleaningReport: (cleaningReport) => {
    set({ cleaningReport });
  },

  setIsProcessing: (isProcessing) => {
    set({ isProcessing });
  },

  toggleStudentStatus: (id) => {
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id
          ? {
              ...student,
              status:
                student.status === "Active"
                  ? "Debarred"
                  : "Active",
            }
          : student
      ),
    }));
  },

  reset: () => {
    set(initialState);
  },
}));