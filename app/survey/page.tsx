'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Button } from '@/components/Buttons';
import { Field, Textarea, YesNo } from '@/components/Field';
import { LinkList } from '@/components/LinkList';
import { FileDrop, UploadedFile } from '@/components/FileDrop';

type Answers = {
  beforeProgramme: string;
  clickMoment: string;
  bestBuild: string;
  links: string[];
  files: UploadedFile[];
  publicUseOk: 'Yes' | 'No' | '';
  teachingStyle: string;
  recommendation: string;
  idealProgramme: string;
  stayInCommunity: 'Yes' | 'No' | '';
  otherNotes: string;
};

const empty: Answers = {
  beforeProgramme: '',
  clickMoment: '',
  bestBuild: '',
  links: [''],
  files: [],
  publicUseOk: '',
  teachingStyle: '',
  recommendation: '',
  idealProgramme: '',
  stayInCommunity: '',
  otherNotes: '',
};

type Identity = { firstName: string; lastName: string; email: string };

type StepDef = {
  id: keyof Answers;
  number: number;
  prompt: string;
  hint?: string;
  // The render function is supplied inline below so it has access to state setters.
};

const STEPS: StepDef[] = [
  {
    id: 'beforeProgramme',
    number: 1,
    prompt: 'Where were you with AI / Claude before the programme?',
    hint: 'How did you feel about it, what were you using it for, what had you tried, what were you not doing?',
  },
  {
    id: 'clickMoment',
    number: 2,
    prompt: 'Was there a specific moment where something clicked?',
    hint: 'A workshop, an aha moment, the second you realised you could do more than you thought.',
  },
  {
    id: 'bestBuild',
    number: 3,
    prompt: 'What is the most useful thing you have built and launched?',
    hint: 'How will it help you going forward — lead gen, ops, marketing, internal tooling?',
  },
  {
    id: 'links',
    number: 4,
    prompt: 'Drop any live links, docs, decks or PDFs.',
    hint: 'Add as many links as you like. Upload anything that needs to live as a file.',
  },
  {
    id: 'publicUseOk',
    number: 5,
    prompt: 'Happy for what you just shared to be used publicly?',
    hint: 'We may feature it in case studies, social posts, or talks.',
  },
  {
    id: 'teachingStyle',
    number: 6,
    prompt: 'If you were telling a friend, how would you describe Ross’ teaching style?',
    hint: 'Start with "Ross is…" or "Ross does…"',
  },
  {
    id: 'recommendation',
    number: 7,
    prompt: 'If someone is considering joining one of Ross’ programmes, what would you say to assure them?',
    hint: 'One or two lines is plenty.',
  },
  {
    id: 'idealProgramme',
    number: 8,
    prompt: 'If a future cohort was structured perfectly for you, what would that look like?',
    hint: 'More of, less of, format, pace, depth, support.',
  },
  {
    id: 'stayInCommunity',
    number: 9,
    prompt: 'Looking to stay in the ai powered community and join the office hours?',
  },
  {
    id: 'otherNotes',
    number: 10,
    prompt: 'Anything else you would like to share?',
    hint: 'Anything we did not cover that you want on the record.',
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [answers, setAnswers] = useState<Answers>(empty);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pull identity from cover page on mount; bounce back if missing.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('aip:case-study');
      if (!raw) {
        router.replace('/');
        return;
      }
      const data = JSON.parse(raw) as Identity & Partial<Answers>;
      if (!data.firstName) {
        router.replace('/');
        return;
      }
      setIdentity({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || '',
      });
    } catch {
      router.replace('/');
    }
  }, [router]);

  const total = STEPS.length;
  const step = STEPS[stepIndex];

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const isStepValid = useMemo(() => {
    const v = answers[step.id];
    if (step.id === 'links') {
      // Optional — links + files are both fine empty.
      return true;
    }
    if (step.id === 'publicUseOk' || step.id === 'stayInCommunity') {
      return v === 'Yes' || v === 'No';
    }
    if (step.id === 'otherNotes') return true; // optional
    return typeof v === 'string' && v.trim().length > 0;
  }, [answers, step.id]);

  const next = () => {
    if (!isStepValid) return;
    if (stepIndex < total - 1) {
      setStepIndex((i) => i + 1);
    } else {
      submit();
    }
  };
  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  const submit = async () => {
    if (!identity) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...identity,
        ...answers,
        // Strip empty link rows.
        links: answers.links.map((l) => l.trim()).filter(Boolean),
      };
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(error || 'Submission failed');
      }
      setSubmitted(true);
      sessionStorage.removeItem('aip:case-study');
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!identity) {
    return (
      <Shell>
        <p className="text-cloud">Loading...</p>
      </Shell>
    );
  }

  if (submitted) {
    return (
      <Shell step={total} total={total}>
        <div className="flex flex-col gap-8">
          <p className="text-[12px] tracking-widest uppercase text-cloud">All done</p>
          <h1 className="text-[44px] sm:text-[64px] leading-[1.02] tracking-tighter font-semibold">
            Thank you, {identity.firstName}.
          </h1>
          <p className="text-[18px] sm:text-[20px] text-cloud max-w-2xl leading-relaxed tracking-tight">
            Your case study has landed. Ross will be in touch if anything you shared lights up.
          </p>
          <div>
            <Button variant="ghost" onClick={() => router.replace('/')}>
              Submit another
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell step={stepIndex + 1} total={total}>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="text-[12px] tracking-widest uppercase text-cloud">
            Question {String(step.number).padStart(2, '0')}
          </p>
          <h2 className="text-[32px] sm:text-[44px] leading-[1.05] tracking-tighter font-semibold">
            {step.prompt}
          </h2>
          {step.hint ? (
            <p className="text-[15px] text-cloud leading-relaxed max-w-2xl">{step.hint}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          {step.id === 'links' ? (
            <div className="flex flex-col gap-8">
              <Field label="Links">
                <LinkList
                  links={answers.links}
                  onChange={(v) => set('links', v)}
                />
              </Field>
              <Field label="Files">
                <div className="border-l-2 border-line pl-3 mb-4">
                  <p className="text-[10px] tracking-widest uppercase text-bone mb-1">
                    Note from ross
                  </p>
                  <p className="text-[13px] text-cloud leading-relaxed">
                    I&apos;m seeing some glitches with the file uploader. If yours fails,
                    just WhatsApp the files over and move on, I&apos;ll attach them on my end.
                  </p>
                </div>
                <FileDrop
                  files={answers.files}
                  onChange={(v) => set('files', v)}
                />
              </Field>
            </div>
          ) : step.id === 'publicUseOk' ? (
            <YesNo
              value={answers.publicUseOk}
              onChange={(v) => set('publicUseOk', v)}
            />
          ) : step.id === 'stayInCommunity' ? (
            <YesNo
              value={answers.stayInCommunity}
              onChange={(v) => set('stayInCommunity', v)}
            />
          ) : (
            <Textarea
              autoFocus
              value={answers[step.id] as string}
              onChange={(v) => set(step.id, v as never)}
              placeholder="Type your answer..."
            />
          )}
        </div>

        {submitError ? (
          <p className="text-[14px] text-red-400">{submitError}</p>
        ) : null}

        <div className="flex items-center justify-between pt-2 border-t border-line">
          <Button
            variant="subtle"
            onClick={back}
            disabled={stepIndex === 0 || submitting}
          >
            <span aria-hidden>&larr;</span> Back
          </Button>
          <Button
            onClick={next}
            disabled={!isStepValid || submitting}
          >
            {submitting
              ? 'Submitting...'
              : stepIndex === total - 1
              ? 'Submit case study'
              : 'Next'}
            <span aria-hidden>&rarr;</span>
          </Button>
        </div>
      </div>
    </Shell>
  );
}
