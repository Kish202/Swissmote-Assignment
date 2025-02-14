import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Navigate, useNavigate } from 'react-router-dom';



const EventDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [date, setDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {setIsAuthenticated} = useAuth()
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/my-events');
        if (response.data.success) {
          setEvents(response.data.data);
          setFilteredEvents(response.data.data);
        }
 }catch        (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events
  


  const navigate = useNavigate();
  const handleLogOut = ()=>{
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate('/auth')
  }

  return (
    <div className="min-h-screen  px-4">




    

      <div className="container mx-auto max-w-3xl mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button variant="outline" className="w-full md:w-auto">My Events
          </Button>
          
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
        </div>

        <div className="grid grid-cols-1 max-h-[30rem] overflow-y-auto scrollbar-hide gap-6 ">
          {loading ? (
            <div className="text-center py-4">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-4">No events found</div>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event._id} className="flex items-center px-4 py-2 gap-6 shadow-2xl ">
                <img src={event.image} alt={event.eventName} className="w-20 h-20 rounded-full object-cover " />
                <CardContent className="flex-1 py-4">
                  <div className='flex items-center justify-between'>
                    <h3 className="text-xl font-semibold">{event.eventName}</h3>
                    <span className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(event.startDate), "PPP")}
                    </span>
                  </div>
                  <div className="text-sm bg-gray-100 px-2 py-1 rounded w-fit mt-1">{event.category}</div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <div>{event.description}</div>
                    <div className="flex items-center gap-1">
                      <span>Hosted by {event.hostName}</span>
                      {/* <span className="mt-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> */}
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



export default EventDashboard;