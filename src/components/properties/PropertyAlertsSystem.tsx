
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, Settings, Mail } from 'lucide-react';

interface PropertyAlert {
  id: string;
  search_name: string;
  search_criteria: any;
  alert_frequency: string;
  is_active: boolean;
  last_alert_sent: string | null;
  created_at: string;
}

const PropertyAlertsSystem = () => {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load property alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_active: isActive } : alert
      ));

      toast({
        title: "Success",
        description: `Alert ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast({
        title: "Error",
        description: "Failed to update alert",
        variant: "destructive",
      });
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'instant': return 'bg-red-100 text-red-800';
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCriteria = (criteria: any) => {
    const parts = [];
    if (criteria.location) parts.push(`Location: ${criteria.location}`);
    if (criteria.priceRange) {
      const [min, max] = criteria.priceRange.split('-');
      parts.push(`Price: ₦${parseInt(min).toLocaleString()}-₦${parseInt(max).toLocaleString()}`);
    }
    if (criteria.bedrooms) parts.push(`${criteria.bedrooms} bedrooms`);
    return parts.join(' • ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Alerts</h2>
          <p className="text-gray-600">Manage your saved searches and notification preferences</p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Property Alerts</h3>
            <p className="text-gray-600 mb-4">
              Create saved searches to get notified when matching properties become available
            </p>
            <Button>Create Your First Alert</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className={`w-5 h-5 ${alert.is_active ? 'text-orange-500' : 'text-gray-400'}`} />
                    <div>
                      <CardTitle className="text-lg">{alert.search_name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {formatCriteria(alert.search_criteria)}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={alert.is_active}
                    onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getFrequencyColor(alert.alert_frequency)}>
                      {alert.alert_frequency} alerts
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Created {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                    {alert.last_alert_sent && (
                      <span className="text-sm text-gray-500">
                        Last alert: {new Date(alert.last_alert_sent).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Test Alert
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{alerts.length}</div>
              <div className="text-sm text-gray-600">Total Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {alerts.filter(a => a.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">12</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">3</div>
              <div className="text-sm text-gray-600">Properties Found</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyAlertsSystem;
