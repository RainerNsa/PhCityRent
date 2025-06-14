
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Home, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

interface AgentData {
  agentId: string;
  name: string;
  verificationDate: string;
  operatingAreas: string[];
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  verificationBadge: "verified" | "pending" | "rejected";
}

const AgentDashboard = () => {
  const [agentData] = useState<AgentData>({
    agentId: "AGT-PHC-EMEKA001",
    name: "Emeka Okafor",
    verificationDate: "2024-01-15",
    operatingAreas: ["GRA", "Trans Amadi", "Eagle Island"],
    totalListings: 23,
    activeListings: 18,
    totalViews: 1247,
    totalInquiries: 89,
    verificationBadge: "verified"
  });

  const [recentListings] = useState([
    {
      id: 1,
      title: "3 Bedroom Duplex - GRA",
      location: "Old GRA, Port Harcourt",
      price: "₦2,500,000/year",
      status: "active",
      views: 156,
      inquiries: 12,
      datePosted: "2024-01-10"
    },
    {
      id: 2,
      title: "2 Bedroom Flat - Trans Amadi",
      location: "Trans Amadi Industrial Layout",
      price: "₦1,800,000/year",
      status: "active",
      views: 203,
      inquiries: 18,
      datePosted: "2024-01-08"
    },
    {
      id: 3,
      title: "4 Bedroom Bungalow - Eagle Island",
      location: "Eagle Island, Port Harcourt",
      price: "₦3,200,000/year",
      status: "rented",
      views: 89,
      inquiries: 7,
      datePosted: "2024-01-05"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-pulse-100 p-3 rounded-lg">
                <Shield className="w-8 h-8 text-pulse-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                <p className="text-gray-600">Welcome back, {agentData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={agentData.verificationBadge === "verified" ? "default" : "secondary"}
                className="bg-green-100 text-green-800"
              >
                <Shield className="w-3 h-3 mr-1" />
                Verified Agent
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">Agent ID</p>
                <p className="text-xs text-gray-600">{agentData.agentId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold">{agentData.activeListings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{agentData.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inquiries</p>
                <p className="text-2xl font-bold">{agentData.totalInquiries}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-pulse-500 hover:bg-pulse-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Listing
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              View Inquiries
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Viewing
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Recent Listings</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 text-sm font-medium text-gray-600">Property</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Location</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Performance</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((listing) => (
                  <tr key={listing.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-sm text-gray-600">Posted {listing.datePosted}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{listing.location}</td>
                    <td className="py-4 text-sm font-medium">{listing.price}</td>
                    <td className="py-4">
                      <Badge 
                        variant={listing.status === "active" ? "default" : "secondary"}
                        className={listing.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="text-sm">
                        <p>{listing.views} views</p>
                        <p className="text-gray-600">{listing.inquiries} inquiries</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
