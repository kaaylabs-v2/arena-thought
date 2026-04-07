

# Nexi AI Learning Insights — Implementation Plan

## What We're Building

A richer "Nexi Insights" system that surfaces 4 types of AI-derived learning signals using data already available in WorkspaceContext (chat messages, reflections, tasks, course progress, notebook entries). Since this is a mock/demo app, we'll create realistic seeded signal data and derive what we can from live context state.

## Signal Types

| Signal | Source | Example |
|--------|--------|---------|
| **Struggle Detection** | Quiz scores (mock) + repeated questions on same topic | "You scored 45% on Bayes' Theorem across 3 attempts. Try a different angle?" |
| **Repeated Questions** | Chat message frequency per topic | "You've asked about Eigenvalue Decomposition 5 times — want a simplified breakdown?" |
| **Confidence Decay** | Time since last visit + low initial score (mock) | "It's been 12 days since you studied Backpropagation (last score: 55%). Quick review?" |
| **Time Anomaly** | Mock time-on-module data | "Module 4 took 2x longer than average — that's normal. Here's a recap." |

## Architecture

### 1. New mock data file: `src/lib/nexi-insights-data.ts`

Centralizes all insight signal definitions in one place:

- `NexiInsight` type with fields: `id`, `type` (struggle | repeated-question | confidence-decay | time-anomaly), `severity` (high | medium | low), `topic`, `course`, `message`, `suggestion`, `metric` (score %, days since, question count, etc.)
- Pre-seeded array of 6-8 realistic insights tied to existing course titles
- A `getTopInsights(n)` helper that returns the top-n by severity
- A `getInsightIcon(type)` helper mapping signal type to a Lucide icon

### 2. Insights Page — New "Nexi Insights" card in Overview tab

Placed between the weekly activity chart and the Continue Learning nudge:

- Card header: Sparkles icon + "Nexi Insights" label (uppercase tracking-widest, matching existing section headers)
- Renders top 2-3 insights as rows, each with:
  - Signal type icon (left) — `AlertTriangle` for struggle, `MessageCircle` for repeated questions, `Clock` for decay, `Timer` for time anomaly
  - Message text (center) — e.g. "Scored 45% on Bayes' Theorem — try reviewing with a worked example"
  - Severity dot (right) — high = `text-destructive`, medium = `text-accent`, low = `text-muted-foreground`
- Links each insight to the relevant workspace: `→ Review in Nexi`
- Uses existing card styling: `bg-card border border-border rounded-xl`

### 3. Patterns Tab — Replace static "Nexi Usage" section

Currently shows flat key-value rows. Upgrade to show actual insight signals:

- Keep "Questions asked" and "Most active course" as summary stats
- Replace "Top focus area" row with a mini insight list showing the top 2 signals with their type badges
- The "Topics to Revisit" section below gains `severity` indicators (colored left border on each card: `border-l-2 border-destructive` for high, `border-l-2 border-accent` for medium)

### 4. Home Page — Rotate Nexi suggestion line

Currently always shows the same Backpropagation suggestion. Update to:

- Pick the highest-severity insight from `getTopInsights(1)` 
- Rotate the message text and link accordingly
- Keep the same visual treatment (Sparkles icon, `mt-2`, accent link)

## Files Changed

| File | Change |
|------|--------|
| `src/lib/nexi-insights-data.ts` | **New** — Signal types, mock data, helpers |
| `src/pages/Insights.tsx` | Add Nexi Insights card to Overview; add severity borders to Topics to Revisit; update Patterns tab Nexi Usage section |
| `src/pages/Index.tsx` | Import from nexi-insights-data, rotate suggestion line based on top signal |

## What We Don't Touch

- No changes to WorkspaceContext shape or providers
- No new animations or keyframes — uses existing `animate-fade-in`
- No color hardcoding — semantic tokens only
- No changes to Layout, Sidebar, Settings, or Workspace pages

