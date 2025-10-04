import Link from 'next/link';
import { Wind } from 'lucide-react';
import { SignupForm } from './_components/signup-form';

export default function SignupPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
       <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
            <div className="flex flex-col space-y-2 text-center">
                <Wind className="mx-auto h-8 w-8 text-primary" />
                <h1 className="text-2xl font-semibold tracking-tight">Create a Citizen Account</h1>
                <p className="text-sm text-muted-foreground">
                Enter your details below to join the community. Policymaker accounts are issued internally and cannot be created here.
                </p>
            </div>

            <SignupForm />

            <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Log in
                </Link>
                .
            </p>
            </div>
      </div>
    </div>
  );
}
