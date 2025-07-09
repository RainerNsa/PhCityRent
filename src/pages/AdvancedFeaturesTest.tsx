// Test version of Advanced Features to debug UI issues
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';

const AdvancedFeaturesTest = () => {
  const [activeTab, setActiveTab] = useState("payments");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Simple Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Advanced Features Test
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Testing if the basic UI structure is working properly.
            </p>
          </div>

          {/* Simple Tab Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {['payments', 'ai', 'analytics', 'whatsapp'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "outline"}
                className="p-4 h-auto"
              >
                <div className="text-center">
                  <div className="font-semibold capitalize">{tab}</div>
                  <div className="text-sm opacity-75">Test {tab}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Simple Content Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Active Tab: {activeTab}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  UI Test Successful!
                </h3>
                <p className="text-gray-600 mb-4">
                  The basic UI structure is working. Current tab: <strong>{activeTab}</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Test Card 1</h4>
                      <p className="text-sm text-gray-500">This card is rendering</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Test Card 2</h4>
                      <p className="text-sm text-gray-500">This card is also rendering</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Test Card 3</h4>
                      <p className="text-sm text-gray-500">All cards are working</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Different Content Based on Tab */}
          {activeTab === 'payments' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800">Payments Tab</h3>
                  <p className="text-blue-600">This is the payments tab content.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'ai' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-800">AI Tab</h3>
                  <p className="text-purple-600">This is the AI tab content.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800">Analytics Tab</h3>
                  <p className="text-green-600">This is the analytics tab content.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'whatsapp' && (
            <Card>
              <CardContent className="p-6">
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800">WhatsApp Tab</h3>
                  <p className="text-yellow-600">This is the WhatsApp tab content.</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedFeaturesTest;
