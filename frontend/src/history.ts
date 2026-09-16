
import type { Audience, Style, Teaser } from "./types";


function storageKey(userId: string): string {
  return `teaser-generator/runs/v2/${userId}`;
}

const MAX_RUNS = 100;

export interface RunRecord {
 
  id: string;
  filename: string;
  
  completedAt: string;
  audience: Audience;
  style: Style;
  status: "completed" | "failed";
  teaserCount: number;
 
  averageScore: number | null;
  totalClipSeconds: number;
  sourceSeconds: number | null;
}

function isRunRecord(value: unknown): value is RunRecord {
  if (typeof value !== "object" || value === null) return false;
  const run = value as Partial<RunRecord>;
  return (
    typeof run.id === "string" &&
    typeof run.filename === "string" &&
    typeof run.completedAt === "string" &&
    typeof run.teaserCount === "number" &&
    (run.status === "completed" || run.status === "failed")
  );
}


export function loadRuns(userId: string): RunRecord[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(storageKey(userId));
  } catch {
    return [];
  }
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRunRecord);
  } catch {
    return [];
  }
}

function save(userId: string, runs: RunRecord[]): void {
  try {
    window.localStorage.setItem(
      storageKey(userId),
      JSON.stringify(runs.slice(0, MAX_RUNS)),
    );
  } catch {
    
  }
}


export function recordRun(userId: string, run: RunRecord): RunRecord[] {
  const next = [
    run,
    ...loadRuns(userId).filter((existing) => existing.id !== run.id),
  ];
  save(userId, next);
  return next.slice(0, MAX_RUNS);
}

export function clearRuns(userId: string): RunRecord[] {
  try {
    window.localStorage.removeItem(storageKey(userId));
  } catch {
  }
  return [];
}


export function summariseRun(
  jobId: string,
  filename: string,
  audience: Audience,
  style: Style,
  sourceSeconds: number | null,
  teasers: Teaser[],
  completedAt: string,
): RunRecord {
  const clipSeconds = teasers.reduce(
    (total, teaser) =>
      total + (teaser.duration_seconds ?? teaser.end_seconds - teaser.start_seconds),
    0,
  );
  const averageScore =
    teasers.length > 0
      ? teasers.reduce((total, teaser) => total + teaser.score, 0) / teasers.length
      : null;

  return {
    id: jobId,
    filename,
    completedAt,
    audience,
    style,
    status: "completed",
    teaserCount: teasers.length,
    averageScore,
    totalClipSeconds: clipSeconds,
    sourceSeconds,
  };
}
