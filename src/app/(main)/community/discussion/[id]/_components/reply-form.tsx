'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { CommunityReply } from '@/lib/types';

const formSchema = z.object({
  content: z.string().min(2, { message: 'Reply must be at least 2 characters.' }),
});

interface ReplyFormProps {
    discussionId: string;
    onReplySuccess: (reply: CommunityReply) => void;
}

export default function ReplyForm({ discussionId, onReplySuccess }: ReplyFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsLoading(true);

    setTimeout(() => {
        const newReply: CommunityReply = {
            id: `reply-${Date.now()}`,
            authorId: user.id,
            authorName: user.name,
            content: values.content,
            timestamp: new Date().toISOString(),
        }

      onReplySuccess(newReply);
      toast({ title: 'Reply Posted' });
      setIsLoading(false);
      form.reset();
    }, 500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Write your reply..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Reply
            </Button>
        </div>
      </form>
    </Form>
  );
}
