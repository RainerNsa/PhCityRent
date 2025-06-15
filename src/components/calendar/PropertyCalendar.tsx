
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'viewing' | 'maintenance' | 'meeting' | 'inspection';
  date: Date;
  time: string;
  duration: number;
  attendees?: string[];
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface PropertyCalendarProps {
  propertyId?: string;
  events?: CalendarEvent[];
}

const PropertyCalendar = ({ propertyId, events = [] }: PropertyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'day'>('month');

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'viewing': return 'bg-blue-500';
      case 'maintenance': return 'bg-red-500';
      case 'meeting': return 'bg-green-500';
      case 'inspection': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Property Calendar
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEvents: { backgroundColor: 'rgb(254 215 170)', fontWeight: 'bold' }
                }}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                Events for {format(selectedDate, 'PPPP')}
              </h3>
              
              {selectedDateEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No events scheduled for this date
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {event.time} ({event.duration} minutes)
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {event.attendees.length} attendee(s)
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyCalendar;
