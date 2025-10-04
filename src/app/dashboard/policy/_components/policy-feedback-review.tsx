'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/localStorage';
import type { PolicyFeedback } from '@/lib/types';

export default function PolicyFeedbackReview() {
    const [feedback, setFeedback] = useState<PolicyFeedback[]>([]);

    useEffect(() => {
        setFeedback(db.policyFeedback.get().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Government Policy Engagement</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Policy Area</TableHead>
                            <TableHead className="w-[50%]">Feedback</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedback.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{format(new Date(item.timestamp), 'dd MMM yyyy')}</TableCell>
                                <TableCell>{item.userName}</TableCell>
                                <TableCell>{item.policyArea}</TableCell>
                                <TableCell>{item.feedback}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
