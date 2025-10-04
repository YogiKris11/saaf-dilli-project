'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageSquare, Loader2, LogIn } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/localStorage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const policyAreas = ['Industrial Emissions', 'Vehicular Pollution', 'Waste Management', 'Public Transportation', 'Green Cover'];

const formSchema = z.object({
  policyArea: z.string().min(1, { message: 'Please select a policy area.' }),
  feedback: z.string().min(10, { message: 'Feedback must be at least 10 characters.' }),
});

export default function PolicyEngagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyArea: '',
      feedback: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to submit feedback.' });
        return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const allFeedback = db.policyFeedback.get();
      const newFeedback = {
        id: `feedback-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        ...values,
      };
      allFeedback.unshift(newFeedback);
      db.policyFeedback.set(allFeedback);

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your valuable input.',
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
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <span>Policy Engagement</span>
        </CardTitle>
      </CardHeader>
       {!user ? (
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground mb-4">You need to be logged in to give feedback.</p>
          <Button onClick={() => router.push('/login')}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In to Engage
          </Button>
        </CardContent>
      ) : (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="policyArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Area</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an area to give feedback on" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {policyAreas.map(area => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Suggest improvements or share your thoughts..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Feedback
            </Button>
          </CardFooter>
        </form>
      </Form>
      )}
    </Card>
  );
}
