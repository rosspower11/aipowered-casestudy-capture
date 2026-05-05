'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Button } from '@/components/Buttons';
import { Field, TextInput } from '@/components/Field';

export default function CoverPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Persist across the click-through.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('aip:case-study');
      if (raw) {
        const data = JSON.parse(raw);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
      }
    } catch {}
  }, []);

  const ready = firstName.trim().length > 0 && lastName.trim().length > 0;

  const start = () => {
    sessionStorage.setItem(
      'aip:case-study',
      JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() }),
    );
    router.push('/survey');
  };

  return (
    <Shell>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <p className="text-[12px] tracking-widest uppercase text-cloud">
            Welcome to the case study
          </p>
          <h1 className="text-[44px] sm:text-[64px] leading-[1.02] tracking-tighter font-semibold">
            Thanks for joining
            <br />
            the programme.
          </h1>
          <p className="text-[18px] sm:text-[20px] text-cloud max-w-2xl leading-relaxed tracking-tight">
            Ten quick questions on what you built, what clicked, and what you&apos;d
            tell a friend. Your answers shape what the next cohort gets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <Field label="First name">
            <TextInput
              value={firstName}
              onChange={setFirstName}
              placeholder="Jane"
              autoFocus
            />
          </Field>
          <Field label="Last name">
            <TextInput value={lastName} onChange={setLastName} placeholder="Doe" />
          </Field>
          <Field label="Email (optional)" hint="So we can follow up if anything stands out.">
            <TextInput
              value={email}
              onChange={setEmail}
              placeholder="jane@example.com"
              type="email"
            />
          </Field>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={start} disabled={!ready}>
            Start now
            <span aria-hidden>&rarr;</span>
          </Button>
          <span className="text-[12px] tracking-widest uppercase text-cloud">
            ~ 5 minutes
          </span>
        </div>
      </div>
    </Shell>
  );
}
