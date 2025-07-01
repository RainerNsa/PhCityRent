
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageOptimizer from '@/components/performance/ImageOptimizer';
import SEOManager from '@/components/seo/SEOManager';
import LanguageManager from '@/components/localization/LanguageManager';
import AdvancedReporting from '@/components/reporting/AdvancedReporting';
import { Zap, Search, Globe, BarChart3 } from 'lucide-react';

const ScalingOptimization = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Scaling & Optimization
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Advanced tools for performance optimization, SEO enhancement, multi-language support, 
              and comprehensive reporting to scale your rental platform effectively.
            </p>
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="performance" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="localization" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Languages</span>
              </TabsTrigger>
              <TabsTrigger value="reporting" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <ImageOptimizer />
            </TabsContent>

            <TabsContent value="seo">
              <SEOManager />
            </TabsContent>

            <TabsContent value="localization">
              <LanguageManager />
            </TabsContent>

            <TabsContent value="reporting">
              <AdvancedReporting />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScalingOptimization;
