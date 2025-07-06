
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'super_admin' | 'agent' | 'landlord' | 'tenant';

export const useRoleAccess = () => {
  const { user } = useAuth();

  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data.map(item => item.role as UserRole);
    },
    enabled: !!user,
  });

  const hasRole = (role: UserRole) => {
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return roles.some(role => userRoles.includes(role));
  };

  const isAdmin = () => hasAnyRole(['admin', 'super_admin']);
  const isAgent = () => hasRole('agent');
  const isLandlord = () => hasRole('landlord');
  const isTenant = () => hasRole('tenant');

  return {
    userRoles,
    hasRole,
    hasAnyRole,
    isAdmin,
    isAgent,
    isLandlord,
    isTenant,
    isLoading,
  };
};
