import React, { useState, useEffect } from 'react';
import api from '../config'
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EditEventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    hostName: '',
    eventName: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    image: null,
    currentImage: ''
  });

  const categories = [
    "Conference", "Workshop", "Seminar", "Meetup", 
    "Concert", "Exhibition", "Party", "Technology"
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(
          `/api/events/my-events/${id}`,
          
        );

        const event = response.data;
        
        // Convert ISO dates to local datetime-local format
        const formatDate = (isoString) => {
          const date = new Date(isoString);
          return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
        };

        setFormData({
          hostName: event.hostName,
          eventName: event.eventName,
          category: event.category,
          description: event.description,
          startDate: formatDate(event.startDate),
          endDate: formatDate(event.endDate),
          image: null,
          currentImage: event.image
        });
        
        setFetchLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event data');
        setFetchLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Only append fields that have been modified
      Object.keys(formData).forEach(key => {
        if (key !== 'currentImage') { // Skip the currentImage field
          if (key === 'image' && formData[key] === null) {
            // Don't append image if no new image was selected
            return;
          }
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(`/api/events/my-events/edit-event/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSuccess('Event updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading event data...</div>
        </CardContent>
      </Card>
    );
  }

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
          
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
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
            <Label htmlFor="image">Event Image</Label>
            {formData.currentImage && (
              <div className="mb-2">
                <img 
                  src={formData.currentImage} 
                  alt="Current event" 
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to keep current image
            </p>
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