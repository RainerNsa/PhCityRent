
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
  reviewer_type: 'tenant' | 'visitor';
}

interface PropertyReviewsProps {
  propertyId: string;
  reviews?: Review[];
  allowReview?: boolean;
}

const PropertyReviews = ({ propertyId, reviews = [], allowReview = true }: PropertyReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    rating: star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 : 0
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !reviewerName || !comment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and provide a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically submit the review to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });

      // Reset form
      setRating(0);
      setReviewerName('');
      setComment('');
      setShowReviewForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? hoverRating || rating : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Reviews & Ratings
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  {renderStars(averageRating)}
                  <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
              </div>
            </div>
            {allowReview && (
              <Button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
              >
                Write a Review
              </Button>
            )}
          </div>
        </CardHeader>

        {reviews.length > 0 && (
          <CardContent>
            <div className="space-y-4">
              {/* Rating Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Rating Distribution</h4>
                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label>Your Rating *</Label>
                <div className="mt-1">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div>
                <Label htmlFor="reviewer_name">Your Name *</Label>
                <Input
                  id="reviewer_name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="review_comment">Your Review *</Label>
                <Textarea
                  id="review_comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this property..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.reviewer_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{review.reviewer_name}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {review.reviewer_type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful_count})
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">Be the first to review this property!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyReviews;
