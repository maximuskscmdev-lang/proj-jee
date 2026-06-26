# JEE Pulse Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the core JEE Advanced Exam Simulator (MVP) with high-fidelity UI and accurate marking logic.

**Architecture:** A state-driven testing engine. The UI follows the official JEE Advanced CBT (Computer Based Test) layout with a Question Area, Side Palette (Question Status), and Action Bar (Save & Next, Mark for Review).

**Tech Stack:** 
- React 19 / TypeScript
- Vanilla CSS Modules
- `lucide-react` (for icons)
- `react-markdown` & `remark-math` / `rehype-katex` (for formulas)

---

### Task 1: Question Data Types & Mock Data

**Files:**
- Create: `src/types/question.ts`
- Create: `src/data/mock-paper.ts`

- [x] **Step 1: Define Question and Paper Types**

Create: `src/types/question.ts`
```typescript
export type QuestionType = 'SCQ' | 'MCQ' | 'INTEGER' | 'MATRIX';

export interface Question {
  id: string;
  type: QuestionType;
  subject: 'Physics' | 'Chemistry' | 'Math';
  topic: string;
  subTopic: string;
  text: string;
  options?: string[]; // For SCQ, MCQ, MATRIX
  correctAnswer: any; // string for SCQ, string[] for MCQ, number for INTEGER
  markingScheme: {
    correct: number;
    partial?: number;
    incorrect: number;
    unattempted: number;
  };
}

export interface Paper {
  id: string;
  title: string;
  durationMinutes: number;
  sections: {
    title: string;
    questions: Question[];
  }[];
}
```

- [x] **Step 2: Create a small Mock Paper for testing**

Create: `src/data/mock-paper.ts`
```typescript
import { Paper } from '../types/question';

export const mockPaper: Paper = {
  id: 'jee-adv-2025-p1',
  title: 'JEE Advanced 2025 - Paper 1 Mock',
  durationMinutes: 180,
  sections: [
    {
      title: 'Physics - Section 1 (SCQ)',
      questions: [
        {
          id: 'p1q1',
          type: 'SCQ',
          subject: 'Physics',
          topic: 'Mechanics',
          subTopic: 'Rotational Motion',
          text: 'A solid sphere of mass $M$ and radius $R$ rolls without slipping...',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'A',
          markingScheme: { correct: 3, incorrect: -1, unattempted: 0 }
        }
      ]
    }
  ]
};
```

- [x] **Step 3: Commit**

```bash
git add src/types src/data
git commit -m "feat: define question types and mock paper data"
```

---

### Task 2: Simulator State Hook

**Files:**
- Create: `src/hooks/useSimulator.ts`
- Create: `src/hooks/__tests__/useSimulator.test.ts`

- [ ] **Step 1: Write failing test for simulator state**

Create: `src/hooks/__tests__/useSimulator.test.ts`
```typescript
import { renderHook, act } from '@testing-library/react';
import { useSimulator } from '../useSimulator';
import { mockPaper } from '../../data/mock-paper';

describe('useSimulator', () => {
  it('should initialize with first question active', () => {
    const { result } = renderHook(() => useSimulator(mockPaper));
    expect(result.current.currentQuestion.id).toBe(mockPaper.sections[0].questions[0].id);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/hooks/__tests__/useSimulator.test.ts`

- [ ] **Step 3: Implement useSimulator hook**

Create: `src/hooks/useSimulator.ts`
```typescript
import { useState, useCallback } from 'react';
import { Paper, Question } from '../types/question';

export type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED' | 'MARKED_AND_ANSWERED';

export function useSimulator(paper: Paper) {
  const allQuestions = paper.sections.flatMap(s => s.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>(
    allQuestions.reduce((acc, q) => ({ ...acc, [q.id]: 'NOT_VISITED' as QuestionStatus }), {})
  );

  const currentQuestion = allQuestions[currentIndex];

  const navigateTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setStatuses(prev => ({
      ...prev,
      [allQuestions[index].id]: prev[allQuestions[index].id] === 'NOT_VISITED' ? 'NOT_ANSWERED' : prev[allQuestions[index].id]
    }));
  }, [allQuestions]);

  return {
    currentQuestion,
    currentIndex,
    responses,
    statuses,
    navigateTo,
    totalQuestions: allQuestions.length
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/hooks/__tests__/useSimulator.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: implement useSimulator hook for testing engine state"
```

---

### Task 3: Simulator UI Components (Palette & Header)

**Files:**
- Create: `src/components/Simulator/Header.tsx`
- Create: `src/components/Simulator/Palette.tsx`
- Create: `src/components/Simulator/Simulator.module.css`

- [ ] **Step 1: Build high-fidelity Simulator Header (Timer + Title)**

Create: `src/components/Simulator/Header.tsx`
```tsx
import React from 'react';
import styles from './Simulator.module.css';

interface HeaderProps {
  title: string;
  timeLeft: number; // seconds
}

export const Header: React.FC<HeaderProps> = ({ title, timeLeft }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className={styles.simHeader}>
      <div className={styles.simTitle}>{title}</div>
      <div className={styles.timer}>Time Left: <span>{formatTime(timeLeft)}</span></div>
    </header>
  );
};
```

- [ ] **Step 2: Build Question Palette (Navigation Grid)**

Create: `src/components/Simulator/Palette.tsx`
```tsx
import React from 'react';
import styles from './Simulator.module.css';
import { QuestionStatus } from '../../hooks/useSimulator';

interface PaletteProps {
  statuses: Record<string, QuestionStatus>;
  onNavigate: (index: number) => void;
  currentIndex: number;
}

export const Palette: React.FC<PaletteProps> = ({ statuses, onNavigate, currentIndex }) => {
  return (
    <aside className={styles.palette}>
      <h3>Question Palette</h3>
      <div className={styles.grid}>
        {Object.keys(statuses).map((id, index) => (
          <button
            key={id}
            className={`${styles.paletteItem} ${styles[statuses[id]]} ${currentIndex === index ? styles.active : ''}`}
            onClick={() => onNavigate(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </aside>
  );
};
```

- [ ] **Step 3: Add Simulator Styles (Vanilla CSS)**

Create: `src/components/Simulator/Simulator.module.css`
```css
.simHeader {
  background: white;
  padding: 0.75rem 2rem;
  border-bottom: 2px solid var(--jee-accent);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.simTitle {
  font-weight: bold;
  color: var(--jee-header-bg);
}

.timer span {
  font-family: monospace;
  font-weight: bold;
  color: var(--error);
  font-size: 1.1rem;
}

.palette {
  width: 300px;
  background: white;
  border-left: 1px solid var(--border);
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.paletteItem {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.NOT_VISITED { background: #eee; }
.NOT_ANSWERED { background: var(--error); color: white; border-radius: 50% 50% 0 0; }
.ANSWERED { background: var(--success); color: white; border-radius: 0 0 50% 50%; }
.MARKED { background: #6366f1; color: white; border-radius: 50%; }
.MARKED_AND_ANSWERED { background: #6366f1; color: white; border-radius: 50%; position: relative; }
.MARKED_AND_ANSWERED::after { content: '✓'; position: absolute; bottom: 0; right: 0; color: #10b981; font-size: 0.8rem; }

.paletteItem.active {
  box-shadow: 0 0 0 2px var(--jee-accent);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Simulator
git commit -m "feat: add simulator header and question palette UI components"
```

---

### Task 4: Main Simulator View & Question Rendering

**Files:**
- Create: `src/components/Simulator/SimulatorView.tsx`
- Create: `src/components/Simulator/QuestionCard.tsx`

- [ ] **Step 1: Install Markdown & Latex dependencies**

Run: `npm install react-markdown remark-math rehype-katex katex`

- [ ] **Step 2: Build Question Rendering Card**

Create: `src/components/Simulator/QuestionCard.tsx`
```tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Question } from '../../types/question';
import styles from './Simulator.module.css';

interface QuestionCardProps {
  question: Question;
  response: any;
  onResponse: (resp: any) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, response, onResponse }) => {
  return (
    <div className={styles.questionCard}>
      <div className={styles.questionMeta}>{question.subject} | {question.type}</div>
      <div className={styles.questionText}>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {question.text}
        </ReactMarkdown>
      </div>
      <div className={styles.options}>
        {question.options?.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <label key={i} className={styles.option}>
              <input 
                type={question.type === 'MCQ' ? 'checkbox' : 'radio'} 
                name={question.id}
                checked={question.type === 'MCQ' ? response?.includes(letter) : response === letter}
                onChange={() => {
                  if (question.type === 'MCQ') {
                    const current = response || [];
                    const next = current.includes(letter) ? current.filter((l: string) => l !== letter) : [...current, letter];
                    onResponse(next);
                  } else {
                    onResponse(letter);
                  }
                }}
              />
              <span className={styles.letter}>{letter}.</span> {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Integrate everything into SimulatorView**

Create: `src/components/Simulator/SimulatorView.tsx`
```tsx
import React, { useState, useEffect } from 'react';
import { mockPaper } from '../../data/mock-paper';
import { useSimulator } from '../../hooks/useSimulator';
import { Header } from './Header';
import { Palette } from './Palette';
import { QuestionCard } from './QuestionCard';
import styles from './Simulator.module.css';

export const SimulatorView: React.FC = () => {
  const { currentQuestion, statuses, navigateTo, currentIndex, totalQuestions } = useSimulator(mockPaper);
  const [timeLeft, setTimeLeft] = useState(mockPaper.durationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.viewContainer}>
      <Header title={mockPaper.title} timeLeft={timeLeft} />
      <div className={styles.mainContent}>
        <div className={styles.questionArea}>
          <QuestionCard 
            question={currentQuestion} 
            response={null} 
            onResponse={() => {}} 
          />
        </div>
        <Palette 
          statuses={statuses} 
          onNavigate={navigateTo} 
          currentIndex={currentIndex} 
        />
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Add missing styles to Simulator.module.css**

Modify: `src/components/Simulator/Simulator.module.css`
```css
.viewContainer {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.mainContent {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.questionArea {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
  background: white;
}

.questionCard {
  max-width: 800px;
  margin: 0 auto;
}

.questionMeta {
  color: var(--primary);
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.questionText {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}

.option:hover {
  background: var(--bg);
}

.letter {
  font-weight: bold;
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: complete simulator view with markdown/latex rendering"
```
