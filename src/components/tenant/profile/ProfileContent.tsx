
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

const ProfileContent = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue={user?.user_metadata?.full_name || ""} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={user?.email || ""} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="+234 xxx xxx xxxx" />
            </div>
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea placeholder="Your current address" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employment Information</CardTitle>
          <CardDescription>Provide employment details for rental applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Employer</label>
              <Input placeholder="Company name" />
            </div>
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input placeholder="Your position" />
            </div>
            <div>
              <label className="text-sm font-medium">Monthly Income</label>
              <Input placeholder="₦ 0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Employment Duration</label>
              <Input placeholder="e.g., 2 years" />
            </div>
          </div>
          <Button>Update Employment Info</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileContent;
