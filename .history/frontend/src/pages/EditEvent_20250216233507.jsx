import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from 'react-router-dom';



import api from './../config/axios';

const EditEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eventId, setEventId] = useState('');
  const [formData, setFormData] = useState({
    hostName: '',
    eventName: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    image: null
  });

  const categories = [
    "Conference", "Workshop", "Seminar", "Meetup", 
    "Concert", "Exhibition", "Party", "Technology"
  ];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const { data } = await api.get(`http://localhost:5000/api/events/my-events/${id}`);
        
        console.log(data.data);
        // Convert ISO dates to local datetime format for input fields
        const startDate = new Date(data.data.startDate).toISOString().slice(0, 16);
        const endDate = new Date(data.data.endDate).toISOString().slice(0, 16);
        setEventId(data.data._id);
        setFormData({
          hostName: data.data.hostName,
          eventName: data.data.eventName,
          category: data.data.category,
          description: data.data.description,
          startDate: data.startDate,
          endDate: endDate,
          image: data.data.image
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.response?.data?.message || "Failed to fetch event data"
        });
      }
    };

    fetchEventData();
  }, [id, toast]);

  const validateDates = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start >= end) {
      toast({
        variant: "destructive",
        title: "Invalid Dates",
        description: "End date must be after start date"
      });
      return false;
    }

    if (start < new Date()) {
      toast({
        variant: "destructive",
        title: "Invalid Start Date",
        description: "Start date cannot be in the past"
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: "Please upload an image file"
        });
        e.target.value = '';
        return;
      }
      
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Image size should be less than 5MB"
        });
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.eventName.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Event name is required"
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Description is required"
      });
      return;
    }

    if (!validateDates()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await api.post(
        `http://localhost:5000/api/events/my-events/edit-event/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast({
        title: "Success",
        description: "Event updated successfully!"
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update event"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto overflow-y-auto scrollbar-hide border border-yellow-950">
      <CardHeader>
        <CardTitle className="flex justify-center">Edit Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="hostName">Host Name</Label>
            <Input
              id="hostName"
              name="hostName"
              value={formData.hostName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date & Time</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date & Time</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Event Image (Optional)</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating Event...' : 'Update Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditEventForm;