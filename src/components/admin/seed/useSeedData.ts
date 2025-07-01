
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sampleProperties, sampleAgentProfiles } from './SampleData';

export const useSeedData = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const seedData = async (dataType: string) => {
    setIsSeeding(true);
    setSeedingStatus(prev => ({ ...prev, [dataType]: true }));

    try {
      if (dataType === 'properties') {
        const { error } = await supabase
          .from('properties')
          .insert(sampleProperties);
        
        if (error) throw error;
        
        toast({
          title: "Properties seeded successfully!",
          description: `Added ${sampleProperties.length} sample properties.`,
        });
      }

      if (dataType === 'agents') {
        const { error } = await supabase
          .from('agent_profiles')
          .insert(sampleAgentProfiles);
        
        if (error) throw error;
        
        toast({
          title: "Agent profiles seeded successfully!",
          description: `Added ${sampleAgentProfiles.length} agent profiles.`,
        });
      }

      if (dataType === 'all') {
        // Seed agents first
        const { error: agentError } = await supabase
          .from('agent_profiles')
          .insert(sampleAgentProfiles);
        
        if (agentError) throw agentError;

        // Then seed properties
        const { error: propertyError } = await supabase
          .from('properties')
          .insert(sampleProperties);
        
        if (propertyError) throw propertyError;
        
        toast({
          title: "All data seeded successfully!",
          description: "Added sample properties, agents, and profiles.",
        });
      }

    } catch (error: any) {
      toast({
        title: "Error seeding data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
      setSeedingStatus(prev => ({ ...prev, [dataType]: false }));
    }
  };

  return {
    isSeeding,
    seedingStatus,
    seedData
  };
};
