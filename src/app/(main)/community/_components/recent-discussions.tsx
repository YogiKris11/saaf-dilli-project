'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/lib/localStorage";
import type { CommunityDiscussion } from "@/lib/types";
import CreateDiscussionForm from "./create-discussion-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function RecentDiscussions() {
    const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setDiscussions(db.discussions.get().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, [isDialogOpen]);

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <span>Recent Discussions</span>
                </CardTitle>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Start Discussion
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>Start a New Discussion</DialogTitle>
                        </DialogHeader>
                        <CreateDiscussionForm setDialogOpen={setIsDialogOpen} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {discussions.slice(0, 5).map(d => (
                        <div key={d.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                 <Avatar className="h-9 w-9">
                                    <AvatarFallback>{d.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/community/discussion/${d.id}`} className="font-semibold hover:underline">
                                        {d.title}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        by {d.authorName} &bull; {d.replies.length} {d.replies.length === 1 ? 'reply' : 'replies'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(d.timestamp), { addSuffix: true })}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
