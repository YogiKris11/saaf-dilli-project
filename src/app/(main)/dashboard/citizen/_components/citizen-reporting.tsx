'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Megaphone, Loader2, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/localStorage';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  location: z.string().min(3, { message: 'Please specify the location.' }),
  description: z.string().min(10, { message: 'Please provide a brief description (min. 10 characters).' }),
});

export default function CitizenReporting() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit a report.' });
        return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const allReports = db.reports.get();
      const newReport = {
        id: `report-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        status: 'Pending' as const,
        ...values,
      };
      allReports.unshift(newReport);
      db.reports.set(allReports);

      toast({
        title: 'Report Submitted',
        description: 'Thank you for your contribution to a cleaner Delhi.',
      });
      form.reset();
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card className="transition-all hover:shadow-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <span>Report a Pollution Incident</span>
        </CardTitle>
      </CardHeader>
      {!user ? (
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground mb-4">You need to be logged in to submit a report.</p>
          <Button onClick={() => router.push('/login')}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In to Report
          </Button>
        </CardContent>
      ) : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location of Incident</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Near Nehru Park" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Open garbage burning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </CardFooter>
        </form>
      </Form>
      )}
    </Card>
  );
}
