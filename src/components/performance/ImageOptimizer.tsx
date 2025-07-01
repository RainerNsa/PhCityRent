
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Image, Zap, Settings, TrendingUp } from 'lucide-react';

const ImageOptimizer = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [settings, setSettings] = useState({
    enableLazyLoading: true,
    compressionLevel: 80,
    enableWebP: true,
    enableCaching: true
  });
  const { toast } = useToast();

  const handleOptimizeImages = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      // Simulate optimization process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setOptimizationProgress(i);
      }
      
      toast({
        title: "Images Optimized!",
        description: "All property images have been compressed and optimized.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Performance Optimization</h2>
        <p className="text-gray-600">Optimize images and improve loading performance</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="w-5 h-5" />
              <span>Image Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Lazy Loading</span>
                <Switch
                  checked={settings.enableLazyLoading}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, enableLazyLoading: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable WebP Format</span>
                <Switch
                  checked={settings.enableWebP}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, enableWebP: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Browser Caching</span>
                <Switch
                  checked={settings.enableCaching}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, enableCaching: checked }))
                  }
                />
              </div>
            </div>
            
            {isOptimizing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Optimizing images...</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} />
              </div>
            )}
            
            <Button
              onClick={handleOptimizeImages}
              disabled={isOptimizing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'Optimize All Images'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Page Load Speed</span>
                <span className="font-semibold text-green-600">2.1s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Image Compression</span>
                <span className="font-semibold text-blue-600">65% saved</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
                <span className="font-semibold text-purple-600">89%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SEO Score</span>
                <span className="font-semibold text-orange-600">92/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageOptimizer;
