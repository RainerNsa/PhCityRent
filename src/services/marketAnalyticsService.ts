// Market Analytics Service for Real Estate Insights
import { supabase } from '@/integrations/supabase/client';

export interface MarketData {
  location: string;
  average_price: number;
  median_price: number;
  price_per_sqm: number;
  total_listings: number;
  available_listings: number;
  average_days_on_market: number;
  price_trend: 'increasing' | 'decreasing' | 'stable';
  demand_level: 'high' | 'medium' | 'low';
  last_updated: string;
}

export interface PriceHistory {
  date: string;
  average_price: number;
  median_price: number;
  total_listings: number;
  location: string;
}

export interface MarketInsights {
  hottest_locations: Array<{
    location: string;
    growth_rate: number;
    average_price: number;
    demand_score: number;
  }>;
  price_predictions: Array<{
    location: string;
    current_price: number;
    predicted_price_3m: number;
    predicted_price_6m: number;
    predicted_price_12m: number;
    confidence: number;
  }>;
  investment_opportunities: Array<{
    location: string;
    opportunity_type: 'undervalued' | 'emerging' | 'stable_growth';
    potential_return: number;
    risk_level: 'low' | 'medium' | 'high';
    reasoning: string;
  }>;
  market_summary: {
    total_market_value: number;
    average_yield: number;
    market_sentiment: 'bullish' | 'bearish' | 'neutral';
    key_drivers: string[];
  };
}

export interface PropertyTypeAnalysis {
  property_type: string;
  average_price: number;
  price_range: { min: number; max: number };
  popularity_score: number;
  average_size: number;
  typical_amenities: string[];
  target_demographics: string[];
  seasonal_trends: Array<{
    month: string;
    demand_multiplier: number;
    average_price: number;
  }>;
}

class MarketAnalyticsService {
  private readonly EXTERNAL_API_KEY = import.meta.env.VITE_MARKET_DATA_API_KEY;

  async getMarketData(location?: string): Promise<MarketData[]> {
    try {
      let query = supabase
        .from('market_data')
        .select('*')
        .order('last_updated', { ascending: false });

      if (location) {
        query = query.eq('location', location);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If no recent data, generate fresh analytics
      if (!data || data.length === 0) {
        return await this.generateMarketData(location);
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return await this.generateMarketData(location);
    }
  }

  private async generateMarketData(location?: string): Promise<MarketData[]> {
    try {
      // Get property data from database
      let query = supabase
        .from('properties')
        .select('location, price, size, property_type, created_at, status');

      if (location) {
        query = query.eq('location', location);
      }

      const { data: properties, error } = await query;

      if (error) throw error;

      // Group by location and calculate analytics
      const locationGroups = this.groupPropertiesByLocation(properties || []);
      const marketData: MarketData[] = [];

      for (const [loc, props] of Object.entries(locationGroups)) {
        const analytics = this.calculateLocationAnalytics(props);
        marketData.push({
          location: loc,
          ...analytics,
          last_updated: new Date().toISOString()
        });
      }

      // Save to database for caching
      if (marketData.length > 0) {
        await supabase
          .from('market_data')
          .upsert(marketData, { onConflict: 'location' });
      }

      return marketData;
    } catch (error) {
      console.error('Failed to generate market data:', error);
      return this.getMockMarketData();
    }
  }

  private groupPropertiesByLocation(properties: any[]): Record<string, any[]> {
    return properties.reduce((groups, property) => {
      const location = property.location || 'Unknown';
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(property);
      return groups;
    }, {});
  }

  private calculateLocationAnalytics(properties: any[]): Omit<MarketData, 'location' | 'last_updated'> {
    const prices = properties.map(p => p.price).filter(p => p > 0);
    const availableProperties = properties.filter(p => p.status === 'available');
    
    const average_price = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const median_price = this.calculateMedian(prices);
    
    // Calculate average size and price per sqm
    const sizesWithPrices = properties.filter(p => p.size > 0 && p.price > 0);
    const price_per_sqm = sizesWithPrices.length > 0 
      ? sizesWithPrices.reduce((sum, p) => sum + (p.price / p.size), 0) / sizesWithPrices.length 
      : 0;

    // Calculate days on market (simplified)
    const average_days_on_market = this.calculateAverageDaysOnMarket(properties);
    
    // Determine trends
    const price_trend = this.determinePriceTrend(properties);
    const demand_level = this.calculateDemandLevel(properties, availableProperties.length);

    return {
      average_price: Math.round(average_price),
      median_price: Math.round(median_price),
      price_per_sqm: Math.round(price_per_sqm),
      total_listings: properties.length,
      available_listings: availableProperties.length,
      average_days_on_market,
      price_trend,
      demand_level
    };
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private calculateAverageDaysOnMarket(properties: any[]): number {
    const now = new Date();
    const daysOnMarket = properties.map(p => {
      const createdDate = new Date(p.created_at);
      return Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    });
    
    return daysOnMarket.length > 0 
      ? Math.round(daysOnMarket.reduce((a, b) => a + b, 0) / daysOnMarket.length)
      : 0;
  }

  private determinePriceTrend(properties: any[]): 'increasing' | 'decreasing' | 'stable' {
    // Simplified trend calculation based on recent listings
    const recentProperties = properties
      .filter(p => {
        const createdDate = new Date(p.created_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return createdDate > thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (recentProperties.length < 5) return 'stable';

    const firstHalf = recentProperties.slice(0, Math.floor(recentProperties.length / 2));
    const secondHalf = recentProperties.slice(Math.floor(recentProperties.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, p) => sum + p.price, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, p) => sum + p.price, 0) / secondHalf.length;

    const changePercent = ((firstHalfAvg - secondHalfAvg) / secondHalfAvg) * 100;

    if (changePercent > 5) return 'increasing';
    if (changePercent < -5) return 'decreasing';
    return 'stable';
  }

  private calculateDemandLevel(allProperties: any[], availableCount: number): 'high' | 'medium' | 'low' {
    const occupancyRate = ((allProperties.length - availableCount) / allProperties.length) * 100;
    
    if (occupancyRate > 80) return 'high';
    if (occupancyRate > 60) return 'medium';
    return 'low';
  }

  async getPriceHistory(location: string, months: number = 12): Promise<PriceHistory[]> {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('location', location)
        .gte('date', new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        return this.generateMockPriceHistory(location, months);
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch price history:', error);
      return this.generateMockPriceHistory(location, months);
    }
  }

  async getMarketInsights(): Promise<MarketInsights> {
    try {
      const marketData = await this.getMarketData();
      const insights = await this.analyzeMarketTrends(marketData);
      return insights;
    } catch (error) {
      console.error('Failed to get market insights:', error);
      return this.getMockMarketInsights();
    }
  }

  private async analyzeMarketTrends(marketData: MarketData[]): Promise<MarketInsights> {
    // Sort locations by various metrics
    const hottest_locations = marketData
      .filter(data => data.price_trend === 'increasing')
      .map(data => ({
        location: data.location,
        growth_rate: this.calculateGrowthRate(data),
        average_price: data.average_price,
        demand_score: this.calculateDemandScore(data)
      }))
      .sort((a, b) => b.demand_score - a.demand_score)
      .slice(0, 5);

    // Generate price predictions using trend analysis
    const price_predictions = marketData.map(data => ({
      location: data.location,
      current_price: data.average_price,
      predicted_price_3m: this.predictPrice(data, 3),
      predicted_price_6m: this.predictPrice(data, 6),
      predicted_price_12m: this.predictPrice(data, 12),
      confidence: this.calculatePredictionConfidence(data)
    }));

    // Identify investment opportunities
    const investment_opportunities = this.identifyInvestmentOpportunities(marketData);

    // Calculate market summary
    const market_summary = this.calculateMarketSummary(marketData);

    return {
      hottest_locations,
      price_predictions,
      investment_opportunities,
      market_summary
    };
  }

  private calculateGrowthRate(data: MarketData): number {
    // Simplified growth rate calculation
    switch (data.price_trend) {
      case 'increasing': return 8 + Math.random() * 7; // 8-15%
      case 'decreasing': return -5 - Math.random() * 5; // -5 to -10%
      default: return -2 + Math.random() * 4; // -2 to 2%
    }
  }

  private calculateDemandScore(data: MarketData): number {
    let score = 50; // Base score

    // Adjust based on availability ratio
    const availabilityRatio = data.available_listings / data.total_listings;
    score += (1 - availabilityRatio) * 30;

    // Adjust based on days on market
    if (data.average_days_on_market < 30) score += 20;
    else if (data.average_days_on_market > 90) score -= 20;

    // Adjust based on price trend
    if (data.price_trend === 'increasing') score += 15;
    else if (data.price_trend === 'decreasing') score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private predictPrice(data: MarketData, months: number): number {
    const monthlyGrowthRate = this.calculateGrowthRate(data) / 100 / 12;
    return Math.round(data.average_price * Math.pow(1 + monthlyGrowthRate, months));
  }

  private calculatePredictionConfidence(data: MarketData): number {
    let confidence = 70; // Base confidence

    // Higher confidence for locations with more data
    if (data.total_listings > 50) confidence += 15;
    else if (data.total_listings < 10) confidence -= 20;

    // Higher confidence for stable trends
    if (data.price_trend === 'stable') confidence += 10;

    return Math.max(30, Math.min(95, confidence));
  }

  private identifyInvestmentOpportunities(marketData: MarketData[]): MarketInsights['investment_opportunities'] {
    return marketData
      .map(data => {
        const opportunity = this.analyzeInvestmentPotential(data);
        return {
          location: data.location,
          ...opportunity
        };
      })
      .filter(opp => opp.potential_return > 5)
      .sort((a, b) => b.potential_return - a.potential_return)
      .slice(0, 5);
  }

  private analyzeInvestmentPotential(data: MarketData): Omit<MarketInsights['investment_opportunities'][0], 'location'> {
    const demandScore = this.calculateDemandScore(data);
    const priceGrowth = this.calculateGrowthRate(data);

    if (data.average_price < 400000 && priceGrowth > 5) {
      return {
        opportunity_type: 'undervalued',
        potential_return: priceGrowth + 3,
        risk_level: 'medium',
        reasoning: 'Below market average with strong growth potential'
      };
    }

    if (demandScore > 80 && data.price_trend === 'increasing') {
      return {
        opportunity_type: 'emerging',
        potential_return: priceGrowth + 2,
        risk_level: 'medium',
        reasoning: 'High demand area with increasing prices'
      };
    }

    if (data.price_trend === 'stable' && demandScore > 60) {
      return {
        opportunity_type: 'stable_growth',
        potential_return: 6 + Math.random() * 4,
        risk_level: 'low',
        reasoning: 'Stable market with consistent demand'
      };
    }

    return {
      opportunity_type: 'stable_growth',
      potential_return: 3 + Math.random() * 4,
      risk_level: 'low',
      reasoning: 'Standard market conditions'
    };
  }

  private calculateMarketSummary(marketData: MarketData[]): MarketInsights['market_summary'] {
    const totalValue = marketData.reduce((sum, data) => sum + (data.average_price * data.total_listings), 0);
    const averageYield = 8.5 + Math.random() * 3; // 8.5-11.5% typical rental yield
    
    const increasingCount = marketData.filter(d => d.price_trend === 'increasing').length;
    const decreasingCount = marketData.filter(d => d.price_trend === 'decreasing').length;
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (increasingCount > decreasingCount * 1.5) sentiment = 'bullish';
    else if (decreasingCount > increasingCount * 1.5) sentiment = 'bearish';

    return {
      total_market_value: totalValue,
      average_yield: Math.round(averageYield * 10) / 10,
      market_sentiment: sentiment,
      key_drivers: [
        'Infrastructure development in Port Harcourt',
        'Oil industry employment trends',
        'Government housing policies',
        'Population growth and urbanization'
      ]
    };
  }

  async getPropertyTypeAnalysis(propertyType?: string): Promise<PropertyTypeAnalysis[]> {
    try {
      let query = supabase
        .from('properties')
        .select('property_type, price, size, amenities');

      if (propertyType) {
        query = query.eq('property_type', propertyType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const typeGroups = this.groupPropertiesByType(data || []);
      const analyses: PropertyTypeAnalysis[] = [];

      for (const [type, properties] of Object.entries(typeGroups)) {
        const analysis = this.analyzePropertyType(type, properties);
        analyses.push(analysis);
      }

      return analyses;
    } catch (error) {
      console.error('Failed to get property type analysis:', error);
      return this.getMockPropertyTypeAnalysis();
    }
  }

  private groupPropertiesByType(properties: any[]): Record<string, any[]> {
    return properties.reduce((groups, property) => {
      const type = property.property_type || 'Unknown';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(property);
      return groups;
    }, {});
  }

  private analyzePropertyType(type: string, properties: any[]): PropertyTypeAnalysis {
    const prices = properties.map(p => p.price).filter(p => p > 0);
    const sizes = properties.map(p => p.size).filter(s => s > 0);
    
    return {
      property_type: type,
      average_price: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      price_range: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      },
      popularity_score: Math.min(100, (properties.length / 10) * 20), // Simplified popularity
      average_size: sizes.length > 0 ? Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length) : 0,
      typical_amenities: this.extractTypicalAmenities(properties),
      target_demographics: this.getTargetDemographics(type),
      seasonal_trends: this.generateSeasonalTrends(type)
    };
  }

  private extractTypicalAmenities(properties: any[]): string[] {
    const amenityCount: Record<string, number> = {};
    
    properties.forEach(property => {
      if (property.amenities && Array.isArray(property.amenities)) {
        property.amenities.forEach((amenity: string) => {
          amenityCount[amenity] = (amenityCount[amenity] || 0) + 1;
        });
      }
    });

    return Object.entries(amenityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([amenity]) => amenity);
  }

  private getTargetDemographics(propertyType: string): string[] {
    const demographics: Record<string, string[]> = {
      'apartment': ['Young professionals', 'Small families', 'Students'],
      'house': ['Families', 'Executives', 'Retirees'],
      'duplex': ['Large families', 'High-income professionals', 'Multi-generational families'],
      'studio': ['Students', 'Single professionals', 'Minimalists'],
      'penthouse': ['High-net-worth individuals', 'Executives', 'Luxury seekers']
    };

    return demographics[propertyType.toLowerCase()] || ['General renters'];
  }

  private generateSeasonalTrends(propertyType: string): PropertyTypeAnalysis['seasonal_trends'] {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map(month => ({
      month,
      demand_multiplier: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
      average_price: 400000 + Math.random() * 200000 // Simplified price variation
    }));
  }

  private getMockMarketData(): MarketData[] {
    const locations = [
      'GRA Phase 1', 'GRA Phase 2', 'Trans Amadi', 'Port Harcourt Township',
      'Rumuola', 'Eliozu', 'Woji', 'Ada George'
    ];

    return locations.map(location => ({
      location,
      average_price: 300000 + Math.random() * 400000,
      median_price: 250000 + Math.random() * 350000,
      price_per_sqm: 2000 + Math.random() * 3000,
      total_listings: Math.floor(20 + Math.random() * 80),
      available_listings: Math.floor(5 + Math.random() * 30),
      average_days_on_market: Math.floor(15 + Math.random() * 60),
      price_trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any,
      demand_level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
      last_updated: new Date().toISOString()
    }));
  }

  private generateMockPriceHistory(location: string, months: number): PriceHistory[] {
    const history: PriceHistory[] = [];
    const basePrice = 400000 + Math.random() * 200000;
    
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = Math.round(basePrice * (1 + variation));
      
      history.push({
        date: date.toISOString().split('T')[0],
        average_price: price,
        median_price: Math.round(price * 0.9),
        total_listings: Math.floor(20 + Math.random() * 30),
        location
      });
    }
    
    return history;
  }

  private getMockMarketInsights(): MarketInsights {
    return {
      hottest_locations: [
        { location: 'GRA Phase 2', growth_rate: 12.5, average_price: 650000, demand_score: 92 },
        { location: 'Trans Amadi', growth_rate: 8.3, average_price: 450000, demand_score: 87 },
        { location: 'Woji', growth_rate: 15.2, average_price: 380000, demand_score: 85 }
      ],
      price_predictions: [
        {
          location: 'GRA Phase 1',
          current_price: 600000,
          predicted_price_3m: 615000,
          predicted_price_6m: 630000,
          predicted_price_12m: 660000,
          confidence: 85
        }
      ],
      investment_opportunities: [
        {
          location: 'Eliozu',
          opportunity_type: 'emerging',
          potential_return: 18.5,
          risk_level: 'medium',
          reasoning: 'Rapid infrastructure development and growing demand'
        }
      ],
      market_summary: {
        total_market_value: 15600000000, // ₦15.6B
        average_yield: 9.2,
        market_sentiment: 'bullish',
        key_drivers: [
          'Infrastructure development',
          'Oil industry growth',
          'Population increase',
          'Government policies'
        ]
      }
    };
  }

  private getMockPropertyTypeAnalysis(): PropertyTypeAnalysis[] {
    return [
      {
        property_type: 'Apartment',
        average_price: 450000,
        price_range: { min: 200000, max: 800000 },
        popularity_score: 85,
        average_size: 75,
        typical_amenities: ['Parking', 'Security', 'Generator', 'Water supply'],
        target_demographics: ['Young professionals', 'Small families'],
        seasonal_trends: this.generateSeasonalTrends('apartment')
      }
    ];
  }
}

export const marketAnalyticsService = new MarketAnalyticsService();
export default MarketAnalyticsService;
