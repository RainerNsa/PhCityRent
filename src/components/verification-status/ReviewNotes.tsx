
import React from 'react';
import { Card } from '@/components/ui/card';

interface ReviewNotesProps {
  reviewerNotes: string;
}

const ReviewNotes = ({ reviewerNotes }: ReviewNotesProps) => {
  if (!reviewerNotes) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-3">Review Notes</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">{reviewerNotes}</p>
      </div>
    </Card>
  );
};

export default ReviewNotes;
