import { Suspense } from 'react';
import WorkoutClient from '../components/WorkoutClient';

export const dynamic = 'force-dynamic';

export default function WorkoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a1f2e]" />}>
      <WorkoutClient />
    </Suspense>
  );
}