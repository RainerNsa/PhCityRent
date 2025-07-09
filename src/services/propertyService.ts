import { supabase } from '@/integrations/supabase/client';
import {
  Property,
  PropertyWithAnalytics,
  PropertyImage,
  PropertyVerificationStep,
  PropertyDocument,
  PropertyInspection,
  PropertyAnalytics,
  SearchFilters,
  SavedSearch,
  PropertyAlert,
  VirtualTour,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  ImageUploadRequest,
  ImageUploadProgress,
  PropertySearchResult,
  PropertyMarketData,
  PropertyRecommendation,
  PropertyServiceError
} from '@/types/property';

/**
 * Comprehensive Property Management Service
 * Handles all property-related operations including CRUD, image management,
 * search, verification, and analytics
 */
export class PropertyService {
  private static instance: PropertyService;

  public static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  // =====================================================
  // PROPERTY CRUD OPERATIONS
  // =====================================================

  /**
   * Get property by ID with analytics
   */
  async getProperty(propertyId: string): Promise<PropertyWithAnalytics> {
    try {
      const { data, error } = await supabase
        .from('property_analytics_detailed')
        .select('*')
        .eq('property_id', propertyId)
        .single();

      if (error) throw new PropertyServiceError('Failed to fetch property', 'FETCH_ERROR', error);
      if (!data) throw new PropertyServiceError('Property not found', 'NOT_FOUND');

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching property', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get properties with filtering and pagination
   */
  async getProperties(filters: SearchFilters = {}, page = 1, pageSize = 20): Promise<PropertySearchResult> {
    try {
      const startTime = Date.now();
      
      let query = supabase
        .from('property_analytics_detailed')
        .select('*', { count: 'exact' });

      // Apply filters
      query = this.applySearchFilters(query, filters);

      // Apply sorting
      query = this.applySorting(query, filters.sort_by || 'date_desc');

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw new PropertyServiceError('Failed to fetch properties', 'FETCH_ERROR', error);

      const searchTime = Date.now() - startTime;

      return {
        properties: data || [],
        total_count: count || 0,
        page,
        page_size: pageSize,
        filters_applied: filters,
        search_metadata: {
          search_time_ms: searchTime,
          suggestions: await this.getSearchSuggestions(filters.search),
          facets: await this.getSearchFacets(filters)
        }
      };
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error searching properties', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Create new property
   */
  async createProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          is_available: true,
          is_verified: false,
          featured: false
        })
        .select()
        .single();

      if (error) throw new PropertyServiceError('Failed to create property', 'CREATE_ERROR', error);

      // Log activity
      await this.logPropertyActivity(data.id, 'property_created', 'Property created', {
        title: propertyData.title,
        location: propertyData.location
      });

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error creating property', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update property
   */
  async updateProperty(propertyId: string, updates: UpdatePropertyRequest): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw new PropertyServiceError('Failed to update property', 'UPDATE_ERROR', error);
      if (!data) throw new PropertyServiceError('Property not found', 'NOT_FOUND');

      // Log activity
      await this.logPropertyActivity(propertyId, 'property_updated', 'Property updated', updates);

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error updating property', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Delete property
   */
  async deleteProperty(propertyId: string): Promise<void> {
    try {
      // First, delete all associated images from storage
      await this.deleteAllPropertyImages(propertyId);

      // Delete property record
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw new PropertyServiceError('Failed to delete property', 'DELETE_ERROR', error);

      // Log activity
      await this.logPropertyActivity(propertyId, 'property_deleted', 'Property deleted');
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error deleting property', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // IMAGE MANAGEMENT
  // =====================================================

  /**
   * Upload multiple images for a property
   */
  async uploadPropertyImages(
    request: ImageUploadRequest,
    onProgress?: (progress: ImageUploadProgress[]) => void
  ): Promise<PropertyImage[]> {
    try {
      const uploadResults: PropertyImage[] = [];
      const progressArray: ImageUploadProgress[] = request.files.map(file => ({
        file_name: file.name,
        progress: 0,
        status: 'pending'
      }));

      if (onProgress) onProgress([...progressArray]);

      for (let i = 0; i < request.files.length; i++) {
        const file = request.files[i];
        const altText = request.alt_texts?.[i] || `${file.name}`;
        const isPrimary = request.is_primary_index === i;

        try {
          // Update progress
          progressArray[i].status = 'uploading';
          if (onProgress) onProgress([...progressArray]);

          // Upload to Supabase Storage
          const fileName = `${request.property_id}/${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          // Update progress
          progressArray[i].progress = 50;
          progressArray[i].status = 'processing';
          if (onProgress) onProgress([...progressArray]);

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          // Create thumbnail
          const thumbnailUrl = await this.createThumbnail(urlData.publicUrl);

          // Get image dimensions
          const dimensions = await this.getImageDimensions(file);

          // Save image record to database
          const { data: imageData, error: dbError } = await supabase
            .from('property_images')
            .insert({
              property_id: request.property_id,
              url: urlData.publicUrl,
              thumbnail_url: thumbnailUrl,
              alt_text: altText,
              order_index: i,
              file_size: file.size,
              file_type: file.type,
              width: dimensions.width,
              height: dimensions.height,
              is_primary: isPrimary
            })
            .select()
            .single();

          if (dbError) throw dbError;

          uploadResults.push(imageData);

          // Update progress
          progressArray[i].progress = 100;
          progressArray[i].status = 'completed';
          progressArray[i].url = urlData.publicUrl;
          if (onProgress) onProgress([...progressArray]);

        } catch (error) {
          progressArray[i].status = 'error';
          progressArray[i].error = error instanceof Error ? error.message : 'Upload failed';
          if (onProgress) onProgress([...progressArray]);
        }
      }

      // Update property images array
      await this.updatePropertyImagesArray(request.property_id);

      return uploadResults;
    } catch (error) {
      throw new PropertyServiceError('Failed to upload images', 'UPLOAD_ERROR', error);
    }
  }

  /**
   * Get property images
   */
  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('order_index', { ascending: true });

      if (error) throw new PropertyServiceError('Failed to fetch property images', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching property images', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Delete property image
   */
  async deletePropertyImage(imageId: string): Promise<void> {
    try {
      // Get image data first
      const { data: imageData, error: fetchError } = await supabase
        .from('property_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;
      if (!imageData) throw new PropertyServiceError('Image not found', 'NOT_FOUND');

      // Delete from storage
      const fileName = imageData.url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('property-images')
          .remove([`${imageData.property_id}/${fileName}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Update property images array
      await this.updatePropertyImagesArray(imageData.property_id);
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Failed to delete image', 'DELETE_ERROR', error);
    }
  }

  /**
   * Reorder property images
   */
  async reorderPropertyImages(propertyId: string, imageIds: string[]): Promise<void> {
    try {
      for (let i = 0; i < imageIds.length; i++) {
        await supabase
          .from('property_images')
          .update({ order_index: i })
          .eq('id', imageIds[i])
          .eq('property_id', propertyId);
      }

      await this.updatePropertyImagesArray(propertyId);
    } catch (error) {
      throw new PropertyServiceError('Failed to reorder images', 'UPDATE_ERROR', error);
    }
  }

  // =====================================================
  // SEARCH & FILTERING ENGINE
  // =====================================================

  /**
   * Advanced property search with geolocation
   */
  async searchProperties(filters: SearchFilters, page = 1, pageSize = 20): Promise<PropertySearchResult> {
    try {
      // If geolocation search is requested
      if (filters.lat && filters.lng && filters.radius) {
        return await this.searchPropertiesByLocation(filters, page, pageSize);
      }

      return await this.getProperties(filters, page, pageSize);
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Search failed', 'SEARCH_ERROR', error);
    }
  }

  /**
   * Search properties by geolocation
   */
  private async searchPropertiesByLocation(
    filters: SearchFilters,
    page: number,
    pageSize: number
  ): Promise<PropertySearchResult> {
    try {
      const { data, error } = await supabase.rpc('search_properties_by_location', {
        lat: filters.lat!,
        lng: filters.lng!,
        radius_km: filters.radius! / 1000, // Convert meters to kilometers
        search_filters: filters,
        page_number: page,
        page_size: pageSize
      });

      if (error) throw error;

      return {
        properties: data.properties || [],
        total_count: data.total_count || 0,
        page,
        page_size: pageSize,
        filters_applied: filters,
        search_metadata: {
          search_time_ms: data.search_time_ms || 0,
          suggestions: data.suggestions || [],
          facets: data.facets || {}
        }
      };
    } catch (error) {
      throw new PropertyServiceError('Geolocation search failed', 'GEO_SEARCH_ERROR', error);
    }
  }

  /**
   * Apply search filters to query
   */
  private applySearchFilters(query: any, filters: SearchFilters) {
    // Text search
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }

    // Location filter
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    // Property type filter
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }

    // Price range filter
    if (filters.min_price) {
      query = query.gte('price_per_year', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price_per_year', filters.max_price);
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    // Area filter
    if (filters.min_area) {
      query = query.gte('area_sqft', filters.min_area);
    }
    if (filters.max_area) {
      query = query.lte('area_sqft', filters.max_area);
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.contains('amenities', filters.amenities);
    }

    // Verification filter
    if (filters.is_verified !== undefined) {
      query = query.eq('is_verified', filters.is_verified);
    }

    // Featured filter
    if (filters.is_featured !== undefined) {
      query = query.eq('featured', filters.is_featured);
    }

    // Available from filter
    if (filters.available_from) {
      query = query.gte('created_at', filters.available_from);
    }

    // Always filter for available properties
    query = query.eq('is_available', true);

    return query;
  }

  /**
   * Apply sorting to query
   */
  private applySorting(query: any, sortBy: string) {
    switch (sortBy) {
      case 'price_asc':
        return query.order('price_per_year', { ascending: true });
      case 'price_desc':
        return query.order('price_per_year', { ascending: false });
      case 'date_asc':
        return query.order('created_at', { ascending: true });
      case 'date_desc':
        return query.order('created_at', { ascending: false });
      case 'relevance':
        return query.order('views_count', { ascending: false });
      default:
        return query.order('created_at', { ascending: false });
    }
  }

  /**
   * Get search suggestions
   */
  private async getSearchSuggestions(searchTerm?: string): Promise<string[]> {
    if (!searchTerm || searchTerm.length < 2) return [];

    try {
      const { data, error } = await supabase.rpc('get_search_suggestions', {
        search_term: searchTerm,
        limit_count: 5
      });

      if (error) return [];
      return data || [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get search facets for filtering
   */
  private async getSearchFacets(filters: SearchFilters): Promise<Record<string, Record<string, number>>> {
    try {
      const { data, error } = await supabase.rpc('get_search_facets', {
        search_filters: filters
      });

      if (error) return {};
      return data || {};
    } catch (error) {
      return {};
    }
  }

  // =====================================================
  // SAVED SEARCHES
  // =====================================================

  /**
   * Save search filters
   */
  async saveSearch(userId: string, name: string, filters: SearchFilters, alertFrequency = 'never'): Promise<SavedSearch> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: userId,
          name,
          filters,
          alert_frequency: alertFrequency,
          is_active: true,
          results_count: 0
        })
        .select()
        .single();

      if (error) throw new PropertyServiceError('Failed to save search', 'SAVE_ERROR', error);

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error saving search', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get user's saved searches
   */
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new PropertyServiceError('Failed to fetch saved searches', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching saved searches', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Delete saved search
   */
  async deleteSavedSearch(searchId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw new PropertyServiceError('Failed to delete saved search', 'DELETE_ERROR', error);
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error deleting saved search', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // PROPERTY VERIFICATION SYSTEM
  // =====================================================

  /**
   * Get property verification steps
   */
  async getVerificationSteps(propertyId: string): Promise<PropertyVerificationStep[]> {
    try {
      const { data, error } = await supabase
        .from('property_verification_steps')
        .select('*')
        .eq('property_id', propertyId)
        .order('step_order', { ascending: true });

      if (error) throw new PropertyServiceError('Failed to fetch verification steps', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching verification steps', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Update verification step status
   */
  async updateVerificationStep(
    stepId: string,
    status: string,
    completionData?: any
  ): Promise<PropertyVerificationStep> {
    try {
      const { data, error } = await supabase
        .from('property_verification_steps')
        .update({
          status,
          completion_data: completionData,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
          completed_by: status === 'completed' ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('id', stepId)
        .select()
        .single();

      if (error) throw new PropertyServiceError('Failed to update verification step', 'UPDATE_ERROR', error);

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error updating verification step', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get verification progress
   */
  async getVerificationProgress(propertyId: string): Promise<{
    total_steps: number;
    completed_steps: number;
    progress_percentage: number;
    current_step: PropertyVerificationStep | null;
    is_verified: boolean;
  }> {
    try {
      const steps = await this.getVerificationSteps(propertyId);
      const completedSteps = steps.filter(step => step.status === 'completed');
      const currentStep = steps.find(step => step.status === 'in_progress') ||
                         steps.find(step => step.status === 'pending');

      const progressPercentage = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;
      const isVerified = progressPercentage === 100;

      return {
        total_steps: steps.length,
        completed_steps: completedSteps.length,
        progress_percentage: progressPercentage,
        current_step: currentStep || null,
        is_verified: isVerified
      };
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error calculating verification progress', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Schedule property inspection
   */
  async scheduleInspection(
    propertyId: string,
    inspectorId: string,
    inspectionType: string,
    scheduledDate: string
  ): Promise<PropertyInspection> {
    try {
      const { data, error } = await supabase
        .from('property_inspections')
        .insert({
          property_id: propertyId,
          inspector_id: inspectorId,
          inspection_type: inspectionType,
          scheduled_date: scheduledDate,
          status: 'scheduled',
          inspection_notes: '',
          issues_found: [],
          recommendations: [],
          photos: []
        })
        .select()
        .single();

      if (error) throw new PropertyServiceError('Failed to schedule inspection', 'CREATE_ERROR', error);

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error scheduling inspection', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Complete property inspection
   */
  async completeInspection(
    inspectionId: string,
    notes: string,
    qualityScore: number,
    issuesFound: string[],
    recommendations: string[],
    photos: string[]
  ): Promise<PropertyInspection> {
    try {
      const { data, error } = await supabase
        .from('property_inspections')
        .update({
          status: 'completed',
          completed_date: new Date().toISOString(),
          inspection_notes: notes,
          quality_score: qualityScore,
          issues_found: issuesFound,
          recommendations: recommendations,
          photos: photos
        })
        .eq('id', inspectionId)
        .select()
        .single();

      if (error) throw new PropertyServiceError('Failed to complete inspection', 'UPDATE_ERROR', error);

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error completing inspection', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // PROPERTY ANALYTICS
  // =====================================================

  /**
   * Get property analytics
   */
  async getPropertyAnalytics(propertyId: string): Promise<PropertyAnalytics> {
    try {
      const { data, error } = await supabase.rpc('get_property_analytics', {
        property_id: propertyId
      });

      if (error) throw new PropertyServiceError('Failed to fetch property analytics', 'FETCH_ERROR', error);
      if (!data) throw new PropertyServiceError('Analytics data not found', 'NOT_FOUND');

      return data;
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching property analytics', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Record property view
   */
  async recordPropertyView(propertyId: string, userId?: string, ipAddress?: string, userAgent?: string): Promise<void> {
    try {
      await supabase
        .from('property_views')
        .insert({
          property_id: propertyId,
          user_id: userId,
          ip_address: ipAddress,
          user_agent: userAgent
        });
    } catch (error) {
      // Don't throw errors for view tracking
      console.error('Failed to record property view:', error);
    }
  }

  /**
   * Get market data for location and property type
   */
  async getMarketData(location: string, propertyType?: string): Promise<PropertyMarketData> {
    try {
      const { data, error } = await supabase.rpc('get_market_data', {
        location_filter: location,
        property_type_filter: propertyType
      });

      if (error) throw new PropertyServiceError('Failed to fetch market data', 'FETCH_ERROR', error);

      return data || {
        location,
        property_type: propertyType || 'all',
        average_price: 0,
        median_price: 0,
        price_per_sqft: 0,
        total_properties: 0,
        available_properties: 0,
        average_days_on_market: 0,
        price_trend: 'stable',
        demand_score: 0,
        competition_level: 'low'
      };
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching market data', 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get property recommendations for user
   */
  async getPropertyRecommendations(
    userId: string,
    limit = 10
  ): Promise<PropertyRecommendation[]> {
    try {
      const { data, error } = await supabase.rpc('get_property_recommendations', {
        user_id: userId,
        limit_count: limit
      });

      if (error) throw new PropertyServiceError('Failed to fetch recommendations', 'FETCH_ERROR', error);

      return data || [];
    } catch (error) {
      if (error instanceof PropertyServiceError) throw error;
      throw new PropertyServiceError('Unexpected error fetching recommendations', 'UNKNOWN_ERROR', error);
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Create thumbnail from image URL
   */
  private async createThumbnail(imageUrl: string): Promise<string> {
    try {
      // For now, return the same URL. In production, you'd use an image processing service
      // like Cloudinary, ImageKit, or implement server-side thumbnail generation
      return imageUrl + '?w=300&h=200&fit=crop';
    } catch (error) {
      return imageUrl; // Fallback to original image
    }
  }

  /**
   * Get image dimensions from file
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 }); // Fallback
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Update property images array in properties table
   */
  private async updatePropertyImagesArray(propertyId: string): Promise<void> {
    try {
      const images = await this.getPropertyImages(propertyId);
      const imageUrls = images.map(img => img.url);

      await supabase
        .from('properties')
        .update({ images: imageUrls })
        .eq('id', propertyId);
    } catch (error) {
      console.error('Failed to update property images array:', error);
    }
  }

  /**
   * Delete all property images from storage
   */
  private async deleteAllPropertyImages(propertyId: string): Promise<void> {
    try {
      const images = await this.getPropertyImages(propertyId);

      for (const image of images) {
        const fileName = image.url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('property-images')
            .remove([`${propertyId}/${fileName}`]);
        }
      }

      // Delete image records from database
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);
    } catch (error) {
      console.error('Failed to delete property images:', error);
    }
  }

  /**
   * Log property activity
   */
  private async logPropertyActivity(
    propertyId: string,
    activityType: string,
    description: string,
    metadata?: any
  ): Promise<void> {
    try {
      await supabase.from('property_activities').insert({
        property_id: propertyId,
        activity_type: activityType,
        description,
        metadata,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      // Don't throw errors for activity logging
      console.error('Failed to log property activity:', error);
    }
  }

  /**
   * Validate property data
   */
  validatePropertyData(data: CreatePropertyRequest | UpdatePropertyRequest): string[] {
    const errors: string[] = [];

    if ('title' in data && (!data.title || data.title.trim().length < 5)) {
      errors.push('Title must be at least 5 characters long');
    }

    if ('price_per_year' in data && (!data.price_per_year || data.price_per_year < 1000)) {
      errors.push('Price per year must be at least ₦1,000');
    }

    if ('bedrooms' in data && (!data.bedrooms || data.bedrooms < 0)) {
      errors.push('Bedrooms must be a positive number');
    }

    if ('bathrooms' in data && (!data.bathrooms || data.bathrooms < 0)) {
      errors.push('Bathrooms must be a positive number');
    }

    if ('location' in data && (!data.location || data.location.trim().length < 3)) {
      errors.push('Location must be at least 3 characters long');
    }

    return errors;
  }

  /**
   * Generate property slug for SEO-friendly URLs
   */
  generatePropertySlug(title: string, propertyId: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return `${slug}-${propertyId.slice(-8)}`;
  }

  /**
   * Calculate property score based on various factors
   */
  calculatePropertyScore(property: PropertyWithAnalytics): number {
    let score = 50; // Base score

    // Verification bonus
    if (property.is_verified) score += 20;

    // Featured bonus
    if (property.featured) score += 10;

    // View count factor
    if (property.views_count > 100) score += 10;
    else if (property.views_count > 50) score += 5;

    // Inquiry rate factor
    if (property.inquiry_conversion_rate > 0.1) score += 15;
    else if (property.inquiry_conversion_rate > 0.05) score += 10;

    // Response rate factor
    if (property.response_rate > 0.8) score += 10;
    else if (property.response_rate > 0.5) score += 5;

    // Image count factor
    const imageCount = property.images?.length || 0;
    if (imageCount >= 5) score += 10;
    else if (imageCount >= 3) score += 5;

    // Amenities factor
    const amenitiesCount = property.amenities?.length || 0;
    if (amenitiesCount >= 5) score += 5;

    return Math.min(100, Math.max(0, score));
  }
}

// Export singleton instance
export const propertyService = PropertyService.getInstance();
