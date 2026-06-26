# JEE Pulse Performance Analyst Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Performance Analyst module to provide actionable insights into topic accuracy and time management.

**Architecture:** A data-processing layer that aggregates raw attempt data from IndexedDB into subject/topic hierarchies. The UI consists of an "Actionable Insights" widget, a "Topic Heatmap" (CSS Grid), and a "Time-Bleed Chart" (Simple Flexbox bars).

**Tech Stack:** 
- React 19 / TypeScript
- Vanilla CSS Modules
- `jspdf` & `html2canvas` (for PDF export)

---

### Task 1: Result Aggregator Utility

**Files:**
- Create: `src/utils/resultAggregator.ts`
- Create: `src/utils/__tests__/resultAggregator.test.ts`

- [ ] **Step 1: Define Attempt and Analytics Types**

Modify: `src/types/question.ts`
```typescript
export interface QuestionAttempt {
  questionId: string;
  subject: string;
  topic: string;
  subTopic: string;
  response: any;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export interface TopicStats {
  accuracy: number;
  avgTime: number;
  totalAttempts: number;
}
```

- [ ] **Step 2: Write failing test for aggregator**

Create: `src/utils/__tests__/resultAggregator.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { aggregateByTopic } from '../resultAggregator';
import { QuestionAttempt } from '../../types/question';

describe('aggregateByTopic', () => {
  it('should correctly calculate accuracy for a topic', () => {
    const attempts: QuestionAttempt[] = [
      { questionId: '1', subject: 'P', topic: 'M', subTopic: 'R', response: 'A', isCorrect: true, timeSpentSeconds: 60, timestamp: 1 },
      { questionId: '2', subject: 'P', topic: 'M', subTopic: 'R', response: 'B', isCorrect: false, timeSpentSeconds: 120, timestamp: 2 }
    ];
    const stats = aggregateByTopic(attempts);
    expect(stats['M'].accuracy).toBe(50);
    expect(stats['M'].avgTime).toBe(90);
  });
});
```

- [ ] **Step 3: Implement aggregator logic**

Create: `src/utils/resultAggregator.ts`
```typescript
import { QuestionAttempt, TopicStats } from '../types/question';

export function aggregateByTopic(attempts: QuestionAttempt[]): Record<string, TopicStats> {
  const topics: Record<string, { correct: number; total: number; time: number }> = {};

  attempts.forEach(a => {
    if (!topics[a.topic]) topics[a.topic] = { correct: 0, total: 0, time: 0 };
    topics[a.topic].total++;
    topics[a.topic].time += a.timeSpentSeconds;
    if (a.isCorrect) topics[a.topic].correct++;
  });

  const result: Record<string, TopicStats> = {};
  for (const topic in topics) {
    result[topic] = {
      accuracy: Math.round((topics[topic].correct / topics[topic].total) * 100),
      avgTime: Math.round(topics[topic].time / topics[topic].total),
      totalAttempts: topics[topic].total
    };
  }
  return result;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/utils src/types
git commit -m "feat: implement result aggregator for performance analytics"
```

---

### Task 2: Actionable Insights Widget

**Files:**
- Create: `src/components/Analyst/InsightsWidget.tsx`
- Create: `src/components/Analyst/Analyst.module.css`

- [ ] **Step 1: Build the "Immediate Action" Widget**

Create: `src/components/Analyst/InsightsWidget.tsx`
```tsx
import React from 'react';
import styles from './Analyst.module.css';

interface InsightsProps {
  weakTopics: { name: string; accuracy: number }[];
  timeTraps: { id: string; time: number }[];
}

export const InsightsWidget: React.FC<InsightsProps> = ({ weakTopics, timeTraps }) => {
  return (
    <div className={styles.insightsCard}>
      <h3 className={styles.insightsTitle}>⚠️ Immediate Action Required</h3>
      <div className={styles.insightsGrid}>
        <div className={styles.insightSection}>
          <h4>Top Weak Sub-Topics</h4>
          <ul>
            {weakTopics.map(t => (
              <li key={t.name}><strong>{t.name}</strong> ({t.accuracy}% Accuracy)</li>
            ))}
          </ul>
        </div>
        <div className={styles.insightSection}>
          <h4>Critical Time Bleeds</h4>
          <ul>
            {timeTraps.map(t => (
              <li key={t.id}><strong>Question {t.id}:</strong> {Math.round(t.time / 60)} mins <span className={styles.danger}>[DANGER]</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Add styles for Analyst components**

Create: `src/components/Analyst/Analyst.module.css`
```css
.insightsCard {
  background: #fff5f5;
  border: 2px solid #feb2b2;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.insightsTitle {
  margin-top: 0;
  color: #c53030;
}

.insightsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.insightSection h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #742a2a;
}

.insightSection ul {
  padding-left: 1.2rem;
  margin: 0;
}

.danger {
  color: #c53030;
  font-weight: bold;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Analyst
git commit -m "feat: add actionable insights widget for analyst module"
```

---

### Task 3: Accuracy Heatmap Component

**Files:**
- Create: `src/components/Analyst/Heatmap.tsx`
- Modify: `src/components/Analyst/Analyst.module.css`

- [ ] **Step 1: Build the Heatmap Grid**

Create: `src/components/Analyst/Heatmap.tsx`
```tsx
import React from 'react';
import styles from './Analyst.module.css';
import { TopicStats } from '../../types/question';

interface HeatmapProps {
  stats: Record<string, TopicStats>;
}

export const Heatmap: React.FC<HeatmapProps> = ({ stats }) => {
  const getColor = (accuracy: number) => {
    if (accuracy > 80) return '#10b981';
    if (accuracy > 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={styles.dashboardSection}>
      <h3>Subject-Wise Accuracy Heatmap</h3>
      <div className={styles.heatmapGrid}>
        {Object.entries(stats).map(([name, data]) => (
          <div 
            key={name} 
            className={styles.heatmapCell} 
            style={{ backgroundColor: getColor(data.accuracy) }}
            title={`${name}: ${data.accuracy}%`}
          ></div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Add styles for Heatmap**

Modify: `src/components/Analyst/Analyst.module.css`
```css
.dashboardSection {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--surface);
  margin-bottom: 1.5rem;
}

.heatmapGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
  gap: 6px;
  margin-top: 1rem;
}

.heatmapCell {
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.1s;
}

.heatmapCell:hover {
  transform: scale(1.1);
  z-index: 1;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Analyst
git commit -m "feat: add subject-wise accuracy heatmap component"
```

---

### Task 4: Main Analyst View Integration

**Files:**
- Create: `src/components/Analyst/AnalystView.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Build the Aggregate Analyst View with Mock Data**

Create: `src/components/Analyst/AnalystView.tsx`
```tsx
import React from 'react';
import { InsightsWidget } from './InsightsWidget';
import { Heatmap } from './Heatmap';
import styles from './Analyst.module.css';

const MOCK_STATS = {
  'Rotational Dynamics': { accuracy: 12, avgTime: 300, totalAttempts: 10 },
  'Kinematics': { accuracy: 90, avgTime: 120, totalAttempts: 15 },
  'Ionic Equilibrium': { accuracy: 28, avgTime: 240, totalAttempts: 8 },
  'Complex Numbers': { accuracy: 35, avgTime: 200, totalAttempts: 12 },
  'Laws of Motion': { accuracy: 85, avgTime: 90, totalAttempts: 20 },
};

export const AnalystView: React.FC = () => {
  return (
    <div className={styles.viewContainer}>
      <h2 style={{ marginBottom: '1.5rem' }}>Performance Analysis</h2>
      <InsightsWidget 
        weakTopics={[
          { name: 'Rotational Dynamics', accuracy: 12 },
          { name: 'Ionic Equilibrium', accuracy: 28 },
          { name: 'Complex Numbers', accuracy: 35 }
        ]}
        timeTraps={[
          { id: '14', time: 570 },
          { id: '28', time: 432 }
        ]}
      />
      <Heatmap stats={MOCK_STATS} />
    </div>
  );
};
```

- [ ] **Step 2: Add navigation state to App.tsx to switch between modules**

Modify: `src/App.tsx`
```tsx
import { useState } from 'react';
import { Shell } from './components/Layout/Shell';
import { SimulatorView } from './components/Simulator/SimulatorView';
import { AnalystView } from './components/Analyst/AnalystView';

function App() {
  const [activeModule, setActiveModule] = useState<'TEST' | 'ANALYZE'>('TEST');

  return (
    <Shell onNavigate={(mod: any) => setActiveModule(mod)}>
      {activeModule === 'TEST' ? <SimulatorView /> : <AnalystView />}
    </Shell>
  );
}

export default App;
```

- [ ] **Step 3: Update Shell to handle navigation**

Modify: `src/components/Layout/Shell.tsx`
```tsx
interface ShellProps {
  children: React.ReactNode;
  onNavigate: (mod: string) => void;
}

export const Shell: React.FC<ShellProps> = ({ children, onNavigate }) => {
  return (
    // ...
    <nav className={styles.nav}>
      <button className={styles.navItem} onClick={() => onNavigate('TEST')}>TEST</button>
      <button className={styles.navItem} onClick={() => onNavigate('ANALYZE')}>ANALYZE</button>
      // ...
    </nav>
  );
};
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: integrate analyst view and add basic module navigation"
```
