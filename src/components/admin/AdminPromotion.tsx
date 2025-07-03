import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Crown } from 'lucide-react';

const AdminPromotion = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePromoteUser = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user first
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        toast({
          title: "Error",
          description: "You must be logged in",
          variant: "destructive"
        });
        return;
      }

      // Search for user by email in profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', profiles.id)
        .single();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ 
            role, 
            assigned_by: currentUser.user.id 
          })
          .eq('user_id', profiles.id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: profiles.id,
            role,
            assigned_by: currentUser.user.id
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `User promoted to ${role} successfully`,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Promote User
        </CardTitle>
        <CardDescription>
          Grant admin or super admin privileges to users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Select value={role} onValueChange={(value: 'admin' | 'super_admin') => setRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </div>
              </SelectItem>
              <SelectItem value="super_admin">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Super Admin
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handlePromoteUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Promoting...' : 'Promote User'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminPromotion;