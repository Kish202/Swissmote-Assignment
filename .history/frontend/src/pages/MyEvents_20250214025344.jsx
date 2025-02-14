import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from 'lucide-react';

import { format } from "date-fns";
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../config/axios';



const MyEvents = () => {
 
  const [events, setEvents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const {setIsAuthenticated} = useAuth()
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('http://localhost:5000/api/events/my-events');
        if (response.data.success) {
          setEvents(response.data.data);
          console.log(response.data.data);
   
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
          
        

         
        </div>

        <div className="grid grid-cols-1 max-h-[30rem] overflow-y-auto scrollbar-hide gap-6 ">
          {loading ? (
            <div className="text-center py-4">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-4">No events found</div>
          ) : (
           events.map((event) => (
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
                    <
                    <Button variant="outline">Edit</Button>
                    <Button  variant='outline'>Delete</Button>
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



export default MyEvents;