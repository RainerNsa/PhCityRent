
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Maximize, Camera, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

interface VirtualTourProps {
  propertyId: string;
  tourImages?: string[];
  tour360Url?: string;
  videoTourUrl?: string;
}

const VirtualTour = ({ propertyId, tourImages = [], tour360Url, videoTourUrl }: VirtualTourProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | '360' | 'video'>('gallery');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tourImages.length) % tourImages.length);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (tourImages.length === 0 && !tour360Url && !videoTourUrl) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Virtual Tour Coming Soon</h3>
          <p className="text-gray-600">Interactive tours and 360° views will be available shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <Card className={isFullscreen ? 'h-full border-0 rounded-none' : ''}>
        <CardHeader className={isFullscreen ? 'text-white' : ''}>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Virtual Tour
            </CardTitle>
            <div className="flex items-center gap-2">
              {tourImages.length > 0 && (
                <Button
                  variant={viewMode === 'gallery' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('gallery')}
                  className={isFullscreen ? 'text-white border-white' : ''}
                >
                  Gallery
                </Button>
              )}
              {tour360Url && (
                <Button
                  variant={viewMode === '360' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('360')}
                  className={isFullscreen ? 'text-white border-white' : ''}
                >
                  360° View
                </Button>
              )}
              {videoTourUrl && (
                <Button
                  variant={viewMode === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('video')}
                  className={isFullscreen ? 'text-white border-white' : ''}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Video
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                className={isFullscreen ? 'text-white border-white' : ''}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className={`p-0 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
          {/* Gallery View */}
          {viewMode === 'gallery' && tourImages.length > 0 && (
            <div className={`relative ${isFullscreen ? 'flex-1 flex items-center justify-center bg-black' : 'aspect-video'}`}>
              <img
                src={tourImages[currentImageIndex]}
                alt={`Tour view ${currentImageIndex + 1}`}
                className={`object-cover ${isFullscreen ? 'max-h-full max-w-full' : 'w-full h-full'}`}
              />
              
              {tourImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {currentImageIndex + 1} / {tourImages.length}
                </Badge>
              </div>
            </div>
          )}

          {/* 360° View */}
          {viewMode === '360' && tour360Url && (
            <div className={`${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
              <iframe
                src={tour360Url}
                className="w-full h-full border-0"
                allowFullScreen
                title="360° Virtual Tour"
              />
            </div>
          )}

          {/* Video Tour */}
          {viewMode === 'video' && videoTourUrl && (
            <div className={`${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
              <video
                controls
                className="w-full h-full"
                poster={tourImages[0]}
              >
                <source src={videoTourUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Thumbnail Navigation for Gallery */}
          {viewMode === 'gallery' && tourImages.length > 1 && !isFullscreen && (
            <div className="p-4">
              <div className="flex gap-2 overflow-x-auto">
                {tourImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tour Features */}
          {!isFullscreen && (
            <div className="p-4 border-t">
              <div className="flex flex-wrap gap-2">
                {tourImages.length > 0 && (
                  <Badge variant="outline">
                    <Camera className="w-3 h-3 mr-1" />
                    {tourImages.length} Photos
                  </Badge>
                )}
                {tour360Url && (
                  <Badge variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    360° View
                  </Badge>
                )}
                {videoTourUrl && (
                  <Badge variant="outline">
                    <Play className="w-3 h-3 mr-1" />
                    Video Tour
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualTour;
