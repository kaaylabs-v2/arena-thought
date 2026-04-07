/**
 * Shared, seeded course progress data used across Home, Insights, and Library pages.
 * Single source of truth — do NOT duplicate this in individual page files.
 */

export interface CourseProgressData {
  module: string;
  progress: number;
  status: "complete" | "in-progress" | "not-started";
}

/** Fixed per-course progress data keyed by course index (wraps around) */
export const fixedCourseData: CourseProgressData[] = [
  { module: "Module 4: Neural Networks", progress: 67, status: "in-progress" },
  { module: "Module 2: Regression Analysis", progress: 34, status: "in-progress" },
  { module: "Module 6: Consciousness", progress: 89, status: "in-progress" },
  { module: "Module 1: Vectors & Matrices", progress: 12, status: "in-progress" },
  { module: "Module 5: Memory & Learning", progress: 100, status: "complete" },
  { module: "Module 1: Research Design", progress: 5, status: "not-started" },
];

/** Seeded last-studied offsets per course index (hours ago) */
export const lastStudiedOffsets = [2, 72, 18, 120, 168, 336];

/** Get progress data for a given course index (wraps for dynamic courses) */
export function getCourseProgress(index: number): CourseProgressData {
  return fixedCourseData[index % fixedCourseData.length];
}
