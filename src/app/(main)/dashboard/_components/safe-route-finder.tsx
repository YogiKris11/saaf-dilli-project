'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Route, ThumbsUp, ThumbsDown, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { findSafeRoute } from '@/ai/flows/safe-route-finder-flow';
import type { SafeRouteOutput } from '@/ai/flows/safe-route-finder-flow';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  start: z.string().min(3, { message: 'Please enter a starting location.' }),
  end: z.string().min(3, { message: 'Please enter a destination.' }),
});

export default function SafeRouteFinder() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SafeRouteOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: '',
      end: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await findSafeRoute(values);
      setResult(response);
    } catch (error) {
      console.error('Failed to find safe route:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate a safe route at this time. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Route className="h-5 w-5 text-primary" />
          </div>
          <span>AI-Powered Safe Route Finder</span>
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Point</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Connaught Place" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hauz Khas Village" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="flex justify-center">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Find Safest Route
                </Button>
            </div>
            <AnimatePresence>
            {isLoading && (
                <motion.div 
                    key="loader"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </motion.div>
            )}
            {result && (
                <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-4"
                >
                  <div>
                      <h3 className="font-bold text-lg flex items-center gap-2 text-green-600">
                        <ThumbsUp className="h-5 w-5" /> Recommended Routes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {result.recommendedRoutes.map((route, index) => (
                          <div key={index} className="rounded-lg border bg-green-500/10 p-4 space-y-2 border-green-500/20 transition-all hover:border-green-500/50 hover:bg-green-500/15">
                              <h4 className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-700"/> {route.route}</h4>
                              <p className="text-sm text-muted-foreground">{route.details}</p>
                              <p className="text-sm"><span className="font-medium">Safety Index:</span> {route.safetyIndex}</p>
                          </div>
                      ))}
                      </div>
                  </div>
                  <Separator />
                  <div>
                     <h3 className="font-bold text-lg flex items-center gap-2 text-red-600">
                        <ThumbsDown className="h-5 w-5" /> Route to Avoid
                      </h3>
                      <div className="rounded-lg border bg-red-500/10 p-4 space-y-2 mt-2 border-red-500/20 transition-all hover:border-red-500/50 hover:bg-red-500/15">
                          <h4 className="font-semibold flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-700"/> {result.routeToAvoid.route}</h4>
                          <p className="text-sm text-muted-foreground">{result.routeToAvoid.details}</p>
                          <p className="text-sm"><span className="font-medium">Safety Index:</span> {result.routeToAvoid.safetyIndex}</p>
                      </div>
                  </div>
                </motion.div>
            )}
            </AnimatePresence>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
