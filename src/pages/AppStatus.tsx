
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppAssessment from '@/components/assessment/AppAssessment';
import PropertyManagementGuide from '@/components/guides/PropertyManagementGuide';
import ImplementationPlan from '@/components/plans/ImplementationPlan';
import { Activity, BookOpen, Map } from 'lucide-react';

const AppStatus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Tabs defaultValue="assessment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assessment" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                App Assessment
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                User Guides
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Implementation Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <AppAssessment />
            </TabsContent>

            <TabsContent value="guides">
              <PropertyManagementGuide />
            </TabsContent>

            <TabsContent value="plan">
              <ImplementationPlan />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppStatus;
