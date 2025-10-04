import RecentDiscussions from "./_components/recent-discussions";
import CitizenReporting from './_components/citizen-reporting';

import CommunityTips from "./_components/community-tips";
import LocalMeetups from "./_components/local-meetups";

export default function CommunityPage() {
    return (
        <div className="container py-8">
            <div className="space-y-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Community Hub</h1>
                <p className="text-lg text-muted-foreground">
                    Connect with fellow citizens, share insights, and stay informed.
                </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <RecentDiscussions />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <CommunityTips />
                    <LocalMeetups />
                </div>
            </div>
        </div>
    );
}
