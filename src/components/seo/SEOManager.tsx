
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, FileText, Globe, Star } from 'lucide-react';

const SEOManager = () => {
  const [seoData, setSeoData] = useState({
    title: 'PhCityRent - Port Harcourt\'s Trusted Rental Platform',
    description: 'Find verified properties and agents in Port Harcourt. Secure rent payments, avoid scams, and rent safely with PhCityRent.',
    keywords: 'Port Harcourt rentals, Nigeria property rental, verified agents, secure payments',
    canonicalUrl: 'https://phcityrent.com'
  });
  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState(false);
  const { toast } = useToast();

  const seoMetrics = [
    { label: 'Title Length', value: seoData.title.length, optimal: '50-60', status: seoData.title.length >= 50 && seoData.title.length <= 60 ? 'good' : 'warning' },
    { label: 'Description Length', value: seoData.description.length, optimal: '150-160', status: seoData.description.length >= 150 && seoData.description.length <= 160 ? 'good' : 'warning' },
    { label: 'Keywords Count', value: seoData.keywords.split(',').length, optimal: '5-10', status: 'good' },
    { label: 'Mobile Friendly', value: 'Yes', optimal: 'Required', status: 'good' }
  ];

  const handleGenerateSitemap = async () => {
    setIsGeneratingSitemap(true);
    try {
      // Simulate sitemap generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sitemap Generated!",
        description: "XML sitemap has been created and submitted to search engines.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate sitemap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSitemap(false);
    }
  };

  const handleUpdateMeta = () => {
    // Update meta tags in document head
    document.title = seoData.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoData.description);
    }
    
    toast({
      title: "Meta Tags Updated!",
      description: "SEO meta tags have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">SEO Enhancement</h2>
        <p className="text-gray-600">Optimize your site for search engines and better visibility</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Meta Tags Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input
                value={seoData.title}
                onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter page title"
              />
              <p className="text-xs text-gray-500">{seoData.title.length} characters</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea
                value={seoData.description}
                onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter meta description"
                rows={3}
              />
              <p className="text-xs text-gray-500">{seoData.description.length} characters</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <Input
                value={seoData.keywords}
                onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="Enter keywords separated by commas"
              />
            </div>
            
            <Button
              onClick={handleUpdateMeta}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Update Meta Tags
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>SEO Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seoMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <p className="text-xs text-gray-500">Optimal: {metric.optimal}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={metric.status === 'good' ? 'default' : 'secondary'}>
                      {metric.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Sitemap Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Generate and submit XML sitemap to help search engines crawl your site more effectively.
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Last Generated:</span>
                <span className="text-gray-500">2 days ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Pages:</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Indexed Pages:</span>
                <span className="text-green-600 font-medium">231</span>
              </div>
            </div>
            
            <Button
              onClick={handleGenerateSitemap}
              disabled={isGeneratingSitemap}
              className="w-full"
              variant="outline"
            >
              <Globe className="w-4 h-4 mr-2" />
              {isGeneratingSitemap ? 'Generating...' : 'Generate Sitemap'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Structured Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Property Schema</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Schema</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Review Schema</span>
                <Badge variant="secondary">Inactive</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">FAQ Schema</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Structured data helps search engines understand your content better.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOManager;
