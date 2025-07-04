
import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import EnhancedBreadcrumb from '@/components/ui/enhanced-breadcrumb';
import BasicMessaging from '@/components/messaging/BasicMessaging';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedBreadcrumb 
            items={[{ label: 'Messages' }]} 
          />

          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Messages</h1>
                <p className="text-orange-100 text-lg">
                  Stay connected with agents and landlords
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-full">
                <MessageSquare className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-0">
            <BasicMessaging />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
