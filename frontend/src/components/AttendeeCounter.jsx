// src/components/AttendeeCounter.jsx
import React, { useEffect } from 'react';
import { useAttendees } from '../contexts/AttendeeContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { Users } from 'lucide-react';

const AttendeeCounter = ({ eventId }) => {
  const { attendees, updateAttendeeCount } = useAttendees();
  const socket = useWebSocket('https://event-managementsr.onrender.com');

  useEffect(() => {
    if (socket) {
      socket.emit('joinEvent', eventId);

      socket.on('attendeeUpdate', ({ eventId: updatedEventId, attendeeCount }) => {
        if (eventId === updatedEventId) {
          updateAttendeeCount(eventId, attendeeCount);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('attendeeUpdate');
      }
    };
  }, [socket, eventId]);

  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4" />
      <span>{attendees[eventId] || 0} attendees</span>
    </div>
  );
};