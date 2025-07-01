
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bell, User, CheckCircle } from 'lucide-react';

const WhatsAppIntegration = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const notifications = [
    {
      type: 'new_property',
      title: 'New Property Alert',
      description: 'Get notified when properties matching your criteria become available',
      icon: Bell,
      enabled: true
    },
    {
      type: 'price_drop',
      title: 'Price Drop Alert',
      description: 'Receive alerts when property prices are reduced',
      icon: CheckCircle,
      enabled: false
    },
    {
      type: 'application_status',
      title: 'Application Updates',
      description: 'Get updates on your rental applications',
      icon: User,
      enabled: true
    }
  ];

  const handleSubscribe = () => {
    if (phoneNumber) {
      setIsSubscribed(true);
      // In a real app, this would call an API to subscribe the user
    }
  };

  const openWhatsApp = (agentNumber: string, propertyTitle: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the property: ${propertyTitle}. Can you provide more details?`
    );
    window.open(`https://wa.me/${agentNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <MessageCircle className="h-8 w-8 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">WhatsApp Integration</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay connected with instant notifications and direct communication with agents via WhatsApp
        </p>
      </div>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your WhatsApp number (+234...)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSubscribe}
                disabled={!phoneNumber || isSubscribed}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
            
            {isSubscribed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  ✅ You're now subscribed to WhatsApp notifications at {phoneNumber}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <div className="grid md:grid-cols-3 gap-6">
        {notifications.map((notification) => (
          <Card key={notification.type} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <notification.icon className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">{notification.title}</CardTitle>
              <Badge variant={notification.enabled ? "default" : "secondary"} className="mx-auto">
                {notification.enabled ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center text-sm">
                {notification.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Contact with Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Chinedu Okafor</p>
                <p className="text-sm text-gray-600">Old GRA, New GRA Specialist</p>
              </div>
              <Button
                onClick={() => openWhatsApp('+2348123456789', 'Luxury 3-Bedroom Apartment')}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Blessing Amadi</p>
                <p className="text-sm text-gray-600">Eliozu, Woji Specialist</p>
              </div>
              <Button
                onClick={() => openWhatsApp('+2348123456790', 'Executive 4-Bedroom Duplex')}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Notification */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Sample WhatsApp Notification</h3>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-700">
              🏠 <strong>PhCityRent Alert</strong><br/>
              New property matches your search!<br/>
              📍 3-Bedroom Apartment in Old GRA<br/>
              💰 ₦450,000/month<br/>
              <br/>
              View details: phcityrent.com/properties/123<br/>
              Contact agent: +234 812 345 6789
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppIntegration;
