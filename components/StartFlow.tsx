"use client";

import Link from "next/link";
import { useState } from "react";
import { GOALS, POSITIONS, type GoalOption, type PositionOption } from "@/lib/start";

type Step = 0 | 1 | 2;

export function StartFlow({ initialGoalId }: { initialGoalId?: string }) {
  const preset = GOALS.find((g) => g.id === initialGoalId) ?? null;
  const [step, setStep] = useState<Step>(preset ? 1 : 0);
  const [goal, setGoal] = useState<GoalOption | null>(preset);
  const [position, setPosition] = useState<PositionOption | null>(null);

  return (
    <div>
      <ProgressDots step={step} />

      {step === 0 && (
        <Question
          eyebrow="Question 1 of 2"
          title="What are you hoping to do with a property?"
          help="Pick the option closest to your plan. You can change this later."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {GOALS.map((g) => (
              <ChoiceCard
                key={g.id}
                selected={goal?.id === g.id}
                onClick={() => {
                  setGoal(g);
                  setStep(1);
                }}
              >
                <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
                <span className="mt-2 block font-medium text-ink">{g.label}</span>
                <span className="mt-1 block text-sm text-muted">{g.note}</span>
              </ChoiceCard>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            New-build development is coming soon.
          </p>
        </Question>
      )}

      {step === 1 && (
        <Question
          eyebrow="Question 2 of 2"
          title="Where are you right now?"
          help="This lets PlotWorthy place you at the right point — not force you to start from stage one."
          onBack={() => setStep(0)}
        >
          <div className="grid gap-3">
            {POSITIONS.map((p) => (
              <ChoiceCard
                key={p.id}
                row
                selected={position?.id === p.id}
                onClick={() => {
                  setPosition(p);
                  setStep(2);
                }}
              >
                <span className="font-medium text-ink">{p.label}</span>
                {p.help && (
                  <span className="text-xs font-medium text-clay-600">Priority support</span>
                )}
              </ChoiceCard>
            ))}
          </div>
        </Question>
      )}

      {step === 2 && goal && position && (
        <Summary goal={goal} position={position} onBack={() => setStep(1)} />
      )}
    </div>
  );
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i <= step ? "w-8 bg-sage-600" : "w-4 bg-line"
          }`}
        />
      ))}
    </div>
  );
}

function Question({
  eyebrow,
  title,
  help,
  children,
  onBack,
}: {
  eyebrow: string;
  title: string;
  help?: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div>
      {onBack && (
        <button onClick={onBack} className="mb-4 text-sm text-muted hover:text-ink">
          ← Back
        </button>
      )}
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
      {help && <p className="mt-3 max-w-xl text-muted">{help}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function ChoiceCard({
  children,
  onClick,
  selected,
  row,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
  row?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card px-5 py-4 text-left transition-all hover:border-sage-300 hover:shadow-lift ${
        selected ? "border-sage-500 ring-2 ring-sage-200" : ""
      } ${row ? "flex items-center justify-between gap-3" : ""}`}
    >
      {children}
    </button>
  );
}

function Summary({
  goal,
  position,
  onBack,
}: {
  goal: GoalOption;
  position: PositionOption;
  onBack: () => void;
}) {
  const targetStage = position.stage;

  if (!goal.journeySlug) {
    return (
      <div>
        <button onClick={onBack} className="mb-4 text-sm text-muted hover:text-ink">
          ← Back
        </button>
        <p className="eyebrow">You’re all set</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          Let’s work out the right route together
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          No problem — plenty of people start here. PlotWorthy will ask a few
          simple questions about your property and goals, then point you to the
          journey that fits.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/journeys" className="btn-primary">Explore the project journeys</Link>
          <Link href="/how-it-works" className="btn-outline">See how PlotWorthy helps</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-sm text-muted hover:text-ink">
        ← Back
      </button>
      <p className="eyebrow">Your starting point</p>
      <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
        Here’s where PlotWorthy places you
      </h1>

      <div className="mt-6 card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Your goal</dt>
            <dd className="mt-1 flex items-center gap-2 text-lg text-ink">
              <span aria-hidden="true">{goal.emoji}</span> {goal.label}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Where you are</dt>
            <dd className="mt-1 text-lg text-ink">{position.label}</dd>
          </div>
        </dl>

        {position.help && (
          <p className="mt-5 rounded-xl bg-clay-50 px-4 py-3 text-sm text-clay-700">
            Because something has gone wrong, PlotWorthy will prioritise getting
            you the right specialist quickly and reviewing where the project
            stands before anything else.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/journeys/${goal.journeySlug}?at=${targetStage}`}
            className="btn-primary"
          >
            Open my project journey →
          </Link>
          <Link href="/journeys" className="btn-ghost">See all journeys</Link>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted">
        You’ll see the whole journey, with your current stage open in detail and
        future stages ready for when you reach them.
      </p>
    </div>
  );
}
