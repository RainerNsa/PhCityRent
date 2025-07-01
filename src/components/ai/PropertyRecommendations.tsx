
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Star, MapPin, Bed, Bath, Square, TrendingUp } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';

interface RecommendationScore {
  property_id: string;
  score: number;
  reasons: string[];
  price_prediction: number;
  market_trend: 'up' | 'down' | 'stable';
}

const PropertyRecommendations = () => {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data: properties } = useProperties();

  const analyzeProperties = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      if (properties) {
        const analyzed = properties.slice(0, 3).map((property, index) => ({
          property_id: property.id,
          score: 85 + Math.random() * 10,
          reasons: [
            'High demand area',
            'Good price-to-value ratio',
            'Excellent amenities',
            'Growing neighborhood'
          ].slice(0, 2 + Math.floor(Math.random() * 3)),
          price_prediction: property.price_per_month! * (1 + (Math.random() * 0.2 - 0.1)),
          market_trend: ['up', 'stable', 'up'][index] as 'up' | 'down' | 'stable'
        }));
        setRecommendations(analyzed);
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRecommendedProperties = () => {
    if (!properties || !recommendations.length) return [];
    
    return recommendations.map(rec => {
      const property = properties.find(p => p.id === rec.property_id);
      return property ? { ...property, recommendation: rec } : null;
    }).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Brain className="h-8 w-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">AI Property Recommendations</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our AI analyzes market trends, your preferences, and property data to recommend the best options for you.
        </p>
        
        <Button
          onClick={analyzeProperties}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2"
        >
          {isAnalyzing ? (
            <>
              <Brain className="mr-2 h-4 w-4 animate-pulse" />
              Analyzing Properties...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Get AI Recommendations
            </>
          )}
        </Button>
      </div>

      {recommendations.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getRecommendedProperties().map((property) => (
            <Card key={property?.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={property?.images?.[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=400&q=80'}
                  alt={property?.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {property?.recommendation.score.toFixed(0)}% Match
                </Badge>
                <Badge className={`absolute top-3 right-3 ${
                  property?.recommendation.market_trend === 'up' ? 'bg-green-500' : 
                  property?.recommendation.market_trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                } text-white`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {property?.recommendation.market_trend}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{property?.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{property?.location}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>{property?.bedrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>{property?.bathrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square className="w-4 h-4" />
                      <span>{property?.area_sqft}ft²</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      ₦{property?.price_per_month?.toLocaleString()}/month
                    </p>
                    <p className="text-sm text-green-600">
                      Predicted: ₦{property?.recommendation.price_prediction.toLocaleString()}/month
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Why recommended:</p>
                    <div className="space-y-1">
                      {property?.recommendation.reasons.map((reason, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyRecommendations;
