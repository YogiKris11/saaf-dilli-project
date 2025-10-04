import { Calendar, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meetups = [
    {
        title: "Tree Plantation Drive",
        location: "Lodhi Garden",
        date: "Sat, Nov 16, 2024",
        time: "9:00 AM"
    },
    {
        title: "Community Awareness Session",
        location: "India Habitat Centre",
        date: "Wed, Nov 27, 2024",
        time: "6:00 PM"
    }
]

export default function LocalMeetups() {
    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-md">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span>Local Meetups</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {meetups.map(meetup => (
                    <div key={meetup.title} className="p-3 rounded-lg border flex justify-between items-center transition-all hover:border-primary/50 hover:bg-muted/30">
                        <div>
                            <h4 className="font-semibold">{meetup.title}</h4>
                            <p className="text-sm text-muted-foreground">{meetup.location}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Calendar className="h-3 w-3" />
                                {meetup.date} &bull; {meetup.time}
                            </p>
                        </div>
                        <Button variant="outline" size="sm">RSVP</Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
