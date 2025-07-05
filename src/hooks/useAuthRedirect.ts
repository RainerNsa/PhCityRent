
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    const checkUserRoleAndRedirect = async () => {
      try {
        // Check if user has admin role
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'super_admin'])
          .single();

        if (adminRole) {
          navigate('/admin');
          return;
        }

        // Check if user is a verified agent
        const { data: agentProfile } = await supabase
          .from('agent_profiles')
          .select('agent_id, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (agentProfile) {
          navigate('/enhanced-agent-dashboard');
          return;
        }

        // Check if user has properties (landlord)
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id)
          .limit(1);

        if (properties && properties.length > 0) {
          navigate('/landlord-portal');
          return;
        }

        // Default to tenant portal
        navigate('/tenant-portal');
      } catch (error) {
        console.error('Error checking user role:', error);
        // Default to tenant portal on error
        navigate('/tenant-portal');
      }
    };

    checkUserRoleAndRedirect();
  }, [user, loading, navigate]);
};
