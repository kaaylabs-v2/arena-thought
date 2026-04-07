import { AlertTriangle, MessageCircle, Clock, Timer, type LucideIcon } from "lucide-react";

/* ─── Types ─── */

export type InsightType = "struggle" | "repeated-question" | "confidence-decay" | "time-anomaly";
export type InsightSeverity = "high" | "medium" | "low";

export interface NexiInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  topic: string;
  course: string;
  message: string;
  suggestion: string;
  metric: string;
}

/* ─── Seeded insights tied to existing course titles ─── */

const nexiInsights: NexiInsight[] = [
  {
    id: "ins-1",
    type: "struggle",
    severity: "high",
    topic: "Bayes' Theorem",
    course: "Advanced Statistical Methods",
    message: "You scored 45% on Bayes' Theorem across 3 quiz attempts.",
    suggestion: "Try reviewing with a worked example — a different angle might click.",
    metric: "45% avg score",
  },
  {
    id: "ins-2",
    type: "confidence-decay",
    severity: "high",
    topic: "Backpropagation",
    course: "Foundations of Machine Learning",
    message: "It's been 12 days since you studied Backpropagation (last score: 55%).",
    suggestion: "A quick 10-minute review could strengthen long-term retention.",
    metric: "12 days ago · 55%",
  },
  {
    id: "ins-3",
    type: "repeated-question",
    severity: "medium",
    topic: "Eigenvalue Decomposition",
    course: "Linear Algebra for Data Science",
    message: "You've asked about Eigenvalue Decomposition 5 times in different ways.",
    suggestion: "Want Nexi to try a visual or analogy-based explanation instead?",
    metric: "5 questions",
  },
  {
    id: "ins-4",
    type: "time-anomaly",
    severity: "medium",
    topic: "Neural Networks (Module 4)",
    course: "Foundations of Machine Learning",
    message: "Module 4 took 2× longer than your average module pace.",
    suggestion: "That's normal for this topic — here's a condensed recap to solidify it.",
    metric: "2× avg time",
  },
  {
    id: "ins-5",
    type: "struggle",
    severity: "medium",
    topic: "Qualia & Consciousness",
    course: "Philosophy of Mind",
    message: "Your quiz responses on Qualia show uncertainty on key distinctions.",
    suggestion: "Revisit the hard problem vs. easy problem framework.",
    metric: "60% avg score",
  },
  {
    id: "ins-6",
    type: "confidence-decay",
    severity: "low",
    topic: "Regression Analysis",
    course: "Advanced Statistical Methods",
    message: "It's been 8 days since you reviewed Regression Analysis.",
    suggestion: "Your initial score was strong (78%) — a brief refresher will lock it in.",
    metric: "8 days ago · 78%",
  },
  {
    id: "ins-7",
    type: "repeated-question",
    severity: "low",
    topic: "Memory & Learning",
    course: "Cognitive Neuroscience",
    message: "You've revisited spaced repetition concepts 3 times this week.",
    suggestion: "Try applying it to your own study plan to deepen understanding.",
    metric: "3 questions",
  },
];

/* ─── Severity sort order ─── */

const severityOrder: Record<InsightSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/* ─── Helpers ─── */

export function getTopInsights(n: number): NexiInsight[] {
  return [...nexiInsights]
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, n);
}

export function getInsightIcon(type: InsightType): LucideIcon {
  switch (type) {
    case "struggle":
      return AlertTriangle;
    case "repeated-question":
      return MessageCircle;
    case "confidence-decay":
      return Clock;
    case "time-anomaly":
      return Timer;
  }
}

export function getInsightTypeLabel(type: InsightType): string {
  switch (type) {
    case "struggle":
      return "Struggle detected";
    case "repeated-question":
      return "Repeated questions";
    case "confidence-decay":
      return "Needs review";
    case "time-anomaly":
      return "Pacing signal";
  }
}

export function getSeverityColor(severity: InsightSeverity): string {
  switch (severity) {
    case "high":
      return "text-destructive";
    case "medium":
      return "text-accent";
    case "low":
      return "text-muted-foreground";
  }
}

export function getSeverityBorderColor(severity: InsightSeverity): string {
  switch (severity) {
    case "high":
      return "border-l-destructive";
    case "medium":
      return "border-l-accent";
    case "low":
      return "border-l-border";
  }
}

export { nexiInsights };
