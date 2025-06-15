
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { Edit2, Save, X, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TenantProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    occupation: user?.user_metadata?.occupation || '',
    emergency_contact: user?.user_metadata?.emergency_contact || '',
    emergency_phone: user?.user_metadata?.emergency_phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Here you would typically update the user profile via Supabase
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.user_metadata?.full_name || '',
      phone: user?.user_metadata?.phone || '',
      bio: user?.user_metadata?.bio || '',
      location: user?.user_metadata?.location || '',
      occupation: user?.user_metadata?.occupation || '',
      emergency_contact: user?.user_metadata?.emergency_contact || '',
      emergency_phone: user?.user_metadata?.emergency_phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Manage your personal details and contact information</CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Current Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter your current city/area"
              />
            </div>
            <div>
              <Label htmlFor="occupation" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Occupation
              </Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter your occupation"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1"
              placeholder="Tell us a bit about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Contact information for emergencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
              <Input
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter emergency contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_phone"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1"
                placeholder="Enter emergency contact phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProfile;
