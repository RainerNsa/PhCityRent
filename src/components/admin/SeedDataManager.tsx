
import React from 'react';
import { Database, Users, Building2 } from 'lucide-react';
import { sampleProperties, sampleAgentProfiles } from './seed/SampleData';
import { useSeedData } from './seed/useSeedData';
import SeedingHeader from './seed/SeedingHeader';
import SeedingOptions from './seed/SeedingOptions';
import SeedingStatusCard from './seed/SeedingStatusCard';

const SeedDataManager = () => {
  const { isSeeding, seedingStatus, seedData } = useSeedData();

  const seedingOptions = [
    {
      key: 'properties',
      title: 'Sample Properties',
      description: 'Add 5 sample properties with images and details',
      icon: Building2,
      count: sampleProperties.length
    },
    {
      key: 'agents',
      title: 'Agent Profiles',
      description: 'Add 3 verified agent profiles',
      icon: Users,
      count: sampleAgentProfiles.length
    },
    {
      key: 'all',
      title: 'Complete Dataset',
      description: 'Seed all sample data at once',
      icon: Database,
      count: sampleProperties.length + sampleAgentProfiles.length
    }
  ];

  return (
    <div className="space-y-6">
      <SeedingHeader />
      
      <SeedingOptions
        options={seedingOptions}
        onSeedData={seedData}
        isSeeding={isSeeding}
        seedingStatus={seedingStatus}
      />

      <SeedingStatusCard />
    </div>
  );
};

export default SeedDataManager;
