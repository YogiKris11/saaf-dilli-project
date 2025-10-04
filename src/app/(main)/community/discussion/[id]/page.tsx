'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/localStorage";
import type { CommunityDiscussion, CommunityReply } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReplyForm from "./_components/reply-form";

export default function DiscussionDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const id = params.id as string;

    const [discussion, setDiscussion] = useState<CommunityDiscussion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const allDiscussions = db.discussions.get();
        const found = allDiscussions.find(d => d.id === id);
        if (found) {
            setDiscussion(found);
        }
        setLoading(false);
    }, [id]);

    const handleDiscussionDelete = () => {
        if (!user || user.id !== discussion?.authorId) return;

        const allDiscussions = db.discussions.get();
        const filtered = allDiscussions.filter(d => d.id !== id);
        db.discussions.set(filtered);

        toast({ title: 'Discussion Deleted', description: 'The discussion has been removed.' });
        router.push('/community');
    }

    const onReplySuccess = (newReply: CommunityReply) => {
        if (!discussion) return;
        const updatedDiscussion = { ...discussion, replies: [...discussion.replies, newReply] };
        setDiscussion(updatedDiscussion);

        const allDiscussions = db.discussions.get();
        const index = allDiscussions.findIndex(d => d.id === id);
        if (index !== -1) {
            allDiscussions[index] = updatedDiscussion;
            db.discussions.set(allDiscussions);
        }
    }

    if (loading) {
        return (
            <div className="container py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!discussion) {
        return (
            <div className="container py-8 text-center">
                <h2 className="text-2xl font-bold">Discussion not found</h2>
                <p className="text-muted-foreground">This discussion may have been deleted.</p>
                <Button onClick={() => router.push('/community')} className="mt-4">Go to Community Hub</Button>
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{discussion.title}</CardTitle>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-2">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{discussion.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{discussion.authorName}</span>
                            <span>&bull;</span>
                            <span>{format(new Date(discussion.timestamp), 'MMM d, yyyy')}</span>
                        </div>
                        {user?.id === discussion.authorId && (
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleDiscussionDelete}>
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Delete
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed">{discussion.content}</p>
                </CardContent>
            </Card>

            <h3 className="text-xl font-semibold mt-10 mb-4">{discussion.replies.length} Replies</h3>
            
            <div className="space-y-6">
                {discussion.replies.map(reply => (
                    <Card key={reply.id} className="bg-muted/30">
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                             <Avatar className="h-9 w-9">
                                <AvatarFallback>{reply.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{reply.authorName}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(reply.timestamp), 'MMM d, yyyy, h:mm a')}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{reply.content}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator className="my-8" />

            <h3 className="text-xl font-semibold mb-4">Leave a Reply</h3>
            {user ? (
                 <ReplyForm discussionId={discussion.id} onReplySuccess={onReplySuccess} />
            ) : (
                <p className="text-muted-foreground">You must be <Link href="/login" className="text-primary hover:underline">logged in</Link> to reply.</p>
            )}
        </div>
    );
}
