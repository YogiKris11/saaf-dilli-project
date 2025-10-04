'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/localStorage';
import type { CommunityTip } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  tip: z.string().min(10, { message: 'Tip must be at least 10 characters.' }).max(150, { message: 'Tip must be less than 150 characters.' }),
});

export default function CommunityTips() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [tips, setTips] = useState<CommunityTip[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTips(db.communityTips.get());
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { tip: '' },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }
        setIsLoading(true);

        setTimeout(() => {
            const allTips = db.communityTips.get();
            const newTip = {
                id: `tip-${Date.now()}`,
                authorName: user.name,
                timestamp: new Date().toISOString(),
                ...values,
            };
            const updatedTips = [newTip, ...allTips];
            db.communityTips.set(updatedTips);
            setTips(updatedTips);

            toast({ title: 'Tip Submitted!', description: 'Thanks for sharing.' });
            setIsLoading(false);
            form.reset();
        }, 500);
    }

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <span>Community Tips & Tricks</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 max-h-48 overflow-y-auto pr-3">
                    {tips.map(tip => (
                        <div key={tip.id} className="p-3 rounded-md bg-muted/50 border border-muted-foreground/20">
                            <p className="text-sm italic">"{tip.tip}"</p>
                            <p className="text-xs text-right text-muted-foreground">- {tip.authorName}</p>
                        </div>
                    ))}
                </div>
                <Separator />
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="tip"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Share a quick tip for the community..." {...field} rows={2} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" size="sm" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Share Tip
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
