'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Megaphone, CheckCircle, Clock, Settings, CircleDashed, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { db } from '@/lib/localStorage';
import type { PollutionReport, PollutionReportStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<PollutionReportStatus | 'Unknown', { icon: React.ElementType, color: string, label: string }> = {
    Pending: { icon: CircleDashed, color: 'bg-amber-500 hover:bg-amber-500/80', label: 'Pending' },
    Acknowledged: { icon: Clock, color: 'bg-blue-500 hover:bg-blue-500/80', label: 'Acknowledged' },
    'In Progress': { icon: Settings, color: 'bg-indigo-500 hover:bg-indigo-500/80', label: 'In Progress' },
    Reviewed: { icon: Eye, color: 'bg-purple-500 hover:bg-purple-500/80', label: 'Reviewed' },
    Resolved: { icon: CheckCircle, color: 'bg-green-500 hover:bg-green-500/80', label: 'Resolved' },
    Unknown: { icon: CircleDashed, color: 'bg-gray-500 hover:bg-gray-500/80', label: 'Unknown' },
}

const ALL_STATUSES = Object.keys(statusConfig).filter(s => s !== 'Unknown') as PollutionReportStatus[];


export default function PollutionReportsReview() {
    const [reports, setReports] = useState<PollutionReport[]>([]);

    useEffect(() => {
        setReports(db.reports.get().sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    const handleStatusChange = (reportId: string, newStatus: PollutionReportStatus) => {
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r);
        setReports(updatedReports);
        db.reports.set(updatedReports);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <span>Pollution Incident Reports</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="w-[40%]">Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map(report => {
                            let currentStatusConfig = statusConfig[report.status];
                            if (!currentStatusConfig) {
                                console.error(`Invalid report status: ${report.status} for report ID: ${report.id}`);
                                currentStatusConfig = statusConfig.Unknown;
                            }
                            const Icon = currentStatusConfig.icon;
                            return (
                                <TableRow key={report.id}>
                                    <TableCell>{format(new Date(report.timestamp), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>{report.userName}</TableCell>
                                    <TableCell>{report.location}</TableCell>
                                    <TableCell>{report.description}</TableCell>
                                    <TableCell>
                                        <Badge className={cn('text-white', currentStatusConfig.color)}>
                                            <Icon className="h-3 w-3 mr-1"/>
                                            {currentStatusConfig.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={report.status}
                                            onValueChange={(newStatus: PollutionReportStatus) => handleStatusChange(report.id, newStatus)}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Change status..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ALL_STATUSES.map(statusKey => (
                                                    <SelectItem key={statusKey} value={statusKey}>{statusConfig[statusKey as PollutionReportStatus].label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
