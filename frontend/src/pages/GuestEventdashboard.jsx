import React, { useState, useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
const categories = ["All", "Conference", "Workshop", "Seminar", "Meetup", "Concert", "Exhibition", "Party", "Technology"];



const GuestActionButton = ({ children, tooltipText ,isGuest}) => {
     
    if (isGuest) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full md:w-auto">
                {children}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className='text-yellow-900'>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
  };

const GuestEventDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [date, setDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {currentUser, setIsAuthenticated, isGuest, setGuest} = useAuth();
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io('https://event-managementsr.onrender.com');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('attendeeUpdate', ({ eventId, attendeeCount, attendees }) => {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, attendeeCount, attendees }
            : event
        )
      );
    });

    newSocket.on('joinEventError', ({ message }) => {
      toast.error(message);
    });

   
    return () => {
      newSocket.close();
    };
  }, []);
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events/get-all-events');
        if (response.data.success) {
          setEvents(response.data.data);
          setFilteredEvents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = [...events];
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    if (date) {
      const selectedDate = format(date, "yyyy-MM-dd");
      filtered = filtered.filter(event => {
        const eventDate = format(new Date(event.startDate), "yyyy-MM-dd");
        return eventDate === selectedDate;
      });
    }
    
    setFilteredEvents(filtered);
  }, [selectedCategory, date, events]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate('/auth');
  };

  const isUserJoined = (event) => {
    if (!currentUser || !event.attendees) return false;
    return event.attendees.some(a => a.userId === currentUser.id);
  };

  
  return (
    <div className="min-h-screen px-4">
      <div className="container mx-auto max-w-3xl mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         
        <GuestActionButton tooltipText="Login to access your events" isGuest={isGuest}>
            <Button 
              variant="outline" 
              className="w-full md:w-auto" 
                // onClick={handleMyEvents}
              disabled={isGuest}
            >
              My Events
            </Button>
          </GuestActionButton>
        
          
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={handleLogOut}> Logout</Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-4">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-4">No events found</div>
          ) : (
            filteredEvents.map((event) => (
 <Card key={event._id} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4 md:gap-6 shadow-2xl">
  {/* Image */}
  <img 
    src={event.image} 
    alt={event.eventName} 
    className="w-full md:w-20 h-40 md:h-20 rounded-lg md:rounded-full object-cover"
  />
  
 
  <CardContent className="flex-1 w-full py-2 space-y-3">
    {/* Title and Date Row */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <h3 className="text-lg md:text-xl font-semibold">{event.eventName}</h3>
      <span className="flex items-center text-sm text-gray-600">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(new Date(event.startDate), "PPP")}
      </span>
    </div>

   
    <div className="text-sm bg-gray-100 px-2 py-1 rounded-full w-fit">
      {event.category}
    </div>

   
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center justify-between text-sm text-gray-600">
      
      <div className="max-w-prose break-words">{event.description}</div>
      
     
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
        <span>Attendees: {event.attendeeCount}</span>
        <GuestActionButton tooltipText="Login to join this event" isGuest={isGuest}>
                  <Button
                  variant="outline"
                 
                    disabled={isGuest || isUserJoined(event)}
                    className="w-full md:w-auto"
                  >
                  Join Event
                  </Button>
                </GuestActionButton>
      </div>

     
      <div className="text-sm">
        Hosted by {event.hostName}
      </div>
    </div>
  </CardContent>
</Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestEventDashboard;