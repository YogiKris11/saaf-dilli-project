'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/localStorage';
import { POLICYMAKER_SECRET_KEY } from '@/lib/constants';
import type { UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface LoginFormProps {
  role: UserRole;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  secretKey: z.string().optional(),
});

export function LoginForm({ role }: LoginFormProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: role === 'citizen' ? 'citizen@test.com' : 'policy@test.com',
      password: 'password',
      secretKey: role === 'policy' ? POLICYMAKER_SECRET_KEY : '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const users = db.users.get();
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === values.email.toLowerCase() && u.role === role
      );

      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'No user found with that email for the selected role.',
        });
        setIsLoading(false);
        return;
      }

      if (user.passwordHash !== db.utils.simpleHash(values.password)) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Incorrect password. Please try again.',
        });
        setIsLoading(false);
        return;
      }

      if (role === 'policy') {
        if (!values.secretKey || values.secretKey !== user.secretKey) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Incorrect secret key for policymaker.',
            });
            setIsLoading(false);
            return;
        }
      }

      login(user);
    }, 1000);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-white/80" htmlFor="email">Email</label>
            <div className="input-glow rounded-lg border border-white/10 bg-white/5 transition-all duration-300">
                <input {...form.register('email')} className="flex h-12 w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none" id="email" placeholder={role === 'citizen' ? "citizen@delhi.gov" : "policy@delhi.gov"} type="email"/>
            </div>
            {form.formState.errors.email && <p className="text-sm font-medium text-destructive">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-2">
            <div className="flex items-center">
                <label className="text-sm font-medium leading-none text-white/80" htmlFor="password">Password</label>
                <a className="ml-auto inline-block text-sm text-white/60 underline-offset-4 hover:text-primary hover:underline" href="#">Forgot password?</a>
            </div>
            <div className="input-glow rounded-lg border border-white/10 bg-white/5 transition-all duration-300">
                <input {...form.register('password')} className="flex h-12 w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none" id="password" placeholder="••••••••" type="password"/>
            </div>
            {form.formState.errors.password && <p className="text-sm font-medium text-destructive">{form.formState.errors.password.message}</p>}
        </div>

         {role === 'policy' && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-white/80" htmlFor="secretKey">Secret Key</label>
            <div className="input-glow rounded-lg border border-white/10 bg-white/5 transition-all duration-300">
                <input {...form.register('secretKey')} className="flex h-12 w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none" id="secretKey" placeholder="Your Secret Key" type="password"/>
            </div>
             {form.formState.errors.secretKey && <p className="text-sm font-medium text-destructive">{form.formState.errors.secretKey.message}</p>}
          </div>
        )}

        <div className="flex flex-col space-y-4 pt-4">
            <button type="submit" disabled={isLoading} className="login-button group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-lg bg-primary px-6 font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 active:scale-100">
                 {isLoading ? (
                    <Loader2 className="z-10 h-6 w-6 animate-spin" />
                ) : (
                    <span className="z-10 tracking-widest">LOGIN</span>
                )}
            </button>
            <p className="px-8 text-center text-sm text-white/60">
                Don't have an account? <Link href="/signup" className="font-medium underline underline-offset-4 hover:text-primary">Sign up</Link>
            </p>
        </div>
    </form>
  );
}
