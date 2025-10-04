'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { DELHI_AQI_STATIONS, HEALTH_CONDITIONS } from '@/lib/constants';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(1, 'Age must be a positive number.').optional(),
  primaryLocation: z.string().optional(),
  healthConditions: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      age: user?.age || undefined,
      primaryLocation: user?.primaryLocation || undefined,
      healthConditions: user?.healthConditions || [],
    },
  });

  function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setIsLoading(true);
    
    setTimeout(() => {
        const updatedUserData = { ...user, ...data };
        updateUser(updatedUserData);
        setIsLoading(false);
        toast({
            title: "Profile Updated",
            description: "Your information has been saved successfully.",
        })
    }, 1000);
  }

  return (
    <div className="container py-8 max-w-2xl">
        <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-lg text-muted-foreground">Manage your personal information and preferences.</p>
        </div>
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your Age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primaryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your most frequent location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DELHI_AQI_STATIONS.map((station) => (
                          <SelectItem key={station.uid} value={station.name}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="healthConditions"
                render={() => (
                    <FormItem>
                    <div className="mb-4">
                        <FormLabel>Pre-existing Health Conditions</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {HEALTH_CONDITIONS.map((item) => (
                        <FormField
                        key={item}
                        control={form.control}
                        name="healthConditions"
                        render={({ field }) => {
                            return (
                            <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), item])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== item
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">{item}</FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
