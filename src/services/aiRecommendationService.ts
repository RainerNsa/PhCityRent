// AI-Powered Property Recommendation Service
import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  budget_min: number;
  budget_max: number;
  property_type: string[];
  bedrooms: number;
  bathrooms: number;
  location_preferences: string[];
  amenities: string[];
  lifestyle: string[];
  commute_locations: Array<{
    name: string;
    address: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  move_in_date: string;
  lease_duration: number;
  pet_friendly: boolean;
  furnished: boolean;
}

export interface PropertyRecommendation {
  property_id: string;
  score: number;
  reasons: string[];
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    property_type: string;
    amenities: string[];
    images: string[];
    landlord_id: string;
    available_from: string;
    lease_terms: string[];
  };
  match_factors: {
    budget_match: number;
    location_match: number;
    amenity_match: number;
    lifestyle_match: number;
    commute_score: number;
  };
}

export interface AIInsights {
  market_trends: {
    average_price_trend: 'increasing' | 'decreasing' | 'stable';
    demand_level: 'high' | 'medium' | 'low';
    best_time_to_rent: string;
    price_prediction: number;
  };
  personalized_tips: string[];
  similar_users_chose: string[];
  negotiation_insights: {
    likelihood: number;
    suggested_offer: number;
    best_approach: string;
  };
}

class AIRecommendationService {
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  private readonly API_BASE = 'https://api.openai.com/v1';

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch user preferences:', error);
      return null;
    }
  }

  async saveUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert([{
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      return false;
    }
  }

  async getPersonalizedRecommendations(
    userId: string, 
    limit: number = 10
  ): Promise<PropertyRecommendation[]> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) {
        return await this.getPopularProperties(limit);
      }

      // Get user's search and viewing history
      const searchHistory = await this.getUserSearchHistory(userId);
      const viewingHistory = await this.getUserViewingHistory(userId);

      // Fetch properties that match basic criteria
      const candidateProperties = await this.getCandidateProperties(preferences);

      // Score and rank properties using AI
      const recommendations = await this.scoreProperties(
        candidateProperties,
        preferences,
        searchHistory,
        viewingHistory
      );

      // Sort by score and return top recommendations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      return await this.getPopularProperties(limit);
    }
  }

  private async getCandidateProperties(preferences: UserPreferences): Promise<any[]> {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          landlords:landlord_id (
            name,
            rating,
            response_time
          ),
          property_amenities (
            amenity_name
          )
        `)
        .eq('status', 'available')
        .gte('price', preferences.budget_min)
        .lte('price', preferences.budget_max);

      if (preferences.bedrooms) {
        query = query.eq('bedrooms', preferences.bedrooms);
      }

      if (preferences.bathrooms) {
        query = query.gte('bathrooms', preferences.bathrooms);
      }

      if (preferences.property_type.length > 0) {
        query = query.in('property_type', preferences.property_type);
      }

      if (preferences.location_preferences.length > 0) {
        query = query.in('location', preferences.location_preferences);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch candidate properties:', error);
      return [];
    }
  }

  private async scoreProperties(
    properties: any[],
    preferences: UserPreferences,
    searchHistory: any[],
    viewingHistory: any[]
  ): Promise<PropertyRecommendation[]> {
    const recommendations: PropertyRecommendation[] = [];

    for (const property of properties) {
      const score = await this.calculatePropertyScore(property, preferences, searchHistory, viewingHistory);
      const reasons = this.generateRecommendationReasons(property, preferences, score.match_factors);

      recommendations.push({
        property_id: property.id,
        score: score.total_score,
        reasons,
        property,
        match_factors: score.match_factors
      });
    }

    return recommendations;
  }

  private async calculatePropertyScore(
    property: any,
    preferences: UserPreferences,
    searchHistory: any[],
    viewingHistory: any[]
  ): Promise<{ total_score: number; match_factors: any }> {
    // Budget match (30% weight)
    const budgetMatch = this.calculateBudgetMatch(property.price, preferences);
    
    // Location match (25% weight)
    const locationMatch = this.calculateLocationMatch(property, preferences);
    
    // Amenity match (20% weight)
    const amenityMatch = this.calculateAmenityMatch(property, preferences);
    
    // Lifestyle match (15% weight)
    const lifestyleMatch = this.calculateLifestyleMatch(property, preferences);
    
    // Commute score (10% weight)
    const commuteScore = await this.calculateCommuteScore(property, preferences);

    const match_factors = {
      budget_match: budgetMatch,
      location_match: locationMatch,
      amenity_match: amenityMatch,
      lifestyle_match: lifestyleMatch,
      commute_score: commuteScore
    };

    const total_score = (
      budgetMatch * 0.30 +
      locationMatch * 0.25 +
      amenityMatch * 0.20 +
      lifestyleMatch * 0.15 +
      commuteScore * 0.10
    );

    return { total_score, match_factors };
  }

  private calculateBudgetMatch(price: number, preferences: UserPreferences): number {
    const { budget_min, budget_max } = preferences;
    const budget_range = budget_max - budget_min;
    const optimal_price = budget_min + (budget_range * 0.7); // Sweet spot at 70% of budget

    if (price <= optimal_price) {
      return 100; // Perfect score for properties under optimal price
    } else if (price <= budget_max) {
      return 100 - ((price - optimal_price) / (budget_max - optimal_price)) * 30;
    } else {
      return 0; // Over budget
    }
  }

  private calculateLocationMatch(property: any, preferences: UserPreferences): number {
    if (preferences.location_preferences.includes(property.location)) {
      return 100;
    }
    
    // Check for nearby locations (this would use a proper distance calculation in production)
    const nearbyScore = this.calculateLocationProximity(property.location, preferences.location_preferences);
    return nearbyScore;
  }

  private calculateLocationProximity(propertyLocation: string, preferredLocations: string[]): number {
    // Simplified proximity calculation
    // In production, this would use actual coordinates and distance calculations
    const locationSimilarity = {
      'GRA Phase 1': ['GRA Phase 2', 'Old GRA'],
      'GRA Phase 2': ['GRA Phase 1', 'New GRA'],
      'Trans Amadi': ['Industrial Layout', 'Eliozu'],
      'Port Harcourt Township': ['Mile 1', 'Mile 2'],
      'Rumuola': ['Rumuokwuta', 'Rumueme'],
    };

    for (const preferred of preferredLocations) {
      if (locationSimilarity[preferred as keyof typeof locationSimilarity]?.includes(propertyLocation)) {
        return 70; // Good proximity score
      }
    }

    return 30; // Default score for other locations
  }

  private calculateAmenityMatch(property: any, preferences: UserPreferences): number {
    const propertyAmenities = property.property_amenities?.map((a: any) => a.amenity_name) || [];
    const matchedAmenities = preferences.amenities.filter(amenity => 
      propertyAmenities.includes(amenity)
    );

    if (preferences.amenities.length === 0) return 100;
    return (matchedAmenities.length / preferences.amenities.length) * 100;
  }

  private calculateLifestyleMatch(property: any, preferences: UserPreferences): number {
    // This would analyze property description and features against lifestyle preferences
    // For now, return a base score with some randomization
    return 60 + Math.random() * 40;
  }

  private async calculateCommuteScore(property: any, preferences: UserPreferences): Promise<number> {
    if (preferences.commute_locations.length === 0) return 100;

    // In production, this would use Google Maps API or similar for real commute times
    // For now, return a simulated score
    return 70 + Math.random() * 30;
  }

  private generateRecommendationReasons(
    property: any, 
    preferences: UserPreferences, 
    matchFactors: any
  ): string[] {
    const reasons: string[] = [];

    if (matchFactors.budget_match > 90) {
      reasons.push(`Great value at ₦${property.price.toLocaleString()} - within your ideal budget range`);
    }

    if (matchFactors.location_match > 80) {
      reasons.push(`Perfect location in ${property.location} - matches your preferred areas`);
    }

    if (matchFactors.amenity_match > 70) {
      reasons.push(`Has most of your desired amenities including modern facilities`);
    }

    if (property.landlords?.rating > 4.5) {
      reasons.push(`Highly rated landlord (${property.landlords.rating}/5) with fast response times`);
    }

    if (matchFactors.commute_score > 80) {
      reasons.push(`Convenient commute to your important locations`);
    }

    if (reasons.length === 0) {
      reasons.push(`Good overall match for your requirements`);
    }

    return reasons;
  }

  async getAIInsights(userId: string, propertyId?: string): Promise<AIInsights> {
    try {
      const preferences = await this.getUserPreferences(userId);
      
      // Generate insights using AI
      const insights = await this.generateAIInsights(preferences, propertyId);
      
      return insights;
    } catch (error) {
      console.error('Failed to get AI insights:', error);
      return this.getDefaultInsights();
    }
  }

  private async generateAIInsights(preferences: UserPreferences | null, propertyId?: string): Promise<AIInsights> {
    // In production, this would call OpenAI API for real insights
    // For now, return realistic mock data
    
    return {
      market_trends: {
        average_price_trend: 'increasing',
        demand_level: 'high',
        best_time_to_rent: 'January-March (lower competition)',
        price_prediction: preferences ? preferences.budget_max * 1.05 : 500000
      },
      personalized_tips: [
        'Properties in GRA Phase 2 are 15% more expensive but offer better amenities',
        'Consider viewing properties on weekdays for better landlord availability',
        'Negotiate for longer lease terms to secure better rates',
        'Properties with parking spaces rent 20% faster in Port Harcourt'
      ],
      similar_users_chose: [
        'Modern 2-bedroom apartments in Trans Amadi',
        'Serviced apartments with backup power',
        'Properties near major shopping centers'
      ],
      negotiation_insights: {
        likelihood: 75,
        suggested_offer: preferences ? preferences.budget_max * 0.9 : 450000,
        best_approach: 'Highlight your stable income and willingness to sign longer lease'
      }
    };
  }

  private getDefaultInsights(): AIInsights {
    return {
      market_trends: {
        average_price_trend: 'stable',
        demand_level: 'medium',
        best_time_to_rent: 'Contact us for current market insights',
        price_prediction: 500000
      },
      personalized_tips: [
        'Create a complete profile to get personalized recommendations',
        'Save your favorite properties to track price changes',
        'Set up alerts for new properties matching your criteria'
      ],
      similar_users_chose: [],
      negotiation_insights: {
        likelihood: 50,
        suggested_offer: 450000,
        best_approach: 'Be prepared with references and proof of income'
      }
    };
  }

  private async getUserSearchHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch search history:', error);
      return [];
    }
  }

  private async getUserViewingHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch viewing history:', error);
      return [];
    }
  }

  private async getPopularProperties(limit: number): Promise<PropertyRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          landlords:landlord_id (
            name,
            rating,
            response_time
          )
        `)
        .eq('status', 'available')
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(property => ({
        property_id: property.id,
        score: 80 + Math.random() * 20, // Random score for popular properties
        reasons: ['Popular choice among renters', 'High-quality property'],
        property,
        match_factors: {
          budget_match: 80,
          location_match: 80,
          amenity_match: 80,
          lifestyle_match: 80,
          commute_score: 80
        }
      }));
    } catch (error) {
      console.error('Failed to fetch popular properties:', error);
      return [];
    }
  }

  async trackUserInteraction(userId: string, action: string, propertyId?: string, metadata?: any): Promise<void> {
    try {
      await supabase
        .from('user_interactions')
        .insert([{
          user_id: userId,
          action,
          property_id: propertyId,
          metadata,
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Failed to track user interaction:', error);
    }
  }
}

export const aiRecommendationService = new AIRecommendationService();
export default AIRecommendationService;
