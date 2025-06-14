
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Phone, 
  User,
  Calendar,
  AlertCircle
} from "lucide-react";

interface VerificationStatusData {
  agentId: string;
  applicantName: string;
  submissionDate: string;
  status: "pending_review" | "documents_reviewed" | "referee_contacted" | "approved" | "rejected" | "needs_info";
  currentStep: number;
  totalSteps: number;
  reviewerNotes?: string;
  refereeStatus?: "pending" | "contacted" | "confirmed" | "failed";
  nextAction?: string;
  estimatedCompletion?: string;
}

const VerificationStatus = () => {
  const [searchId, setSearchId] = useState("");
  const [statusData, setStatusData] = useState<VerificationStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demo
  const mockStatusData: VerificationStatusData = {
    agentId: "AGT-PHC-EMEKA001",
    applicantName: "Emeka Okafor",
    submissionDate: "2024-01-15T10:30:00Z",
    status: "referee_contacted",
    currentStep: 3,
    totalSteps: 5,
    reviewerNotes: "Documents verified successfully. Referee has been contacted.",
    refereeStatus: "contacted",
    nextAction: "Waiting for referee confirmation",
    estimatedCompletion: "2024-01-17"
  };

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (searchId.includes("EMEKA") || searchId === "AGT-PHC-EMEKA001") {
        setStatusData(mockStatusData);
      } else {
        setStatusData(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "documents_reviewed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "referee_contacted":
        return <Phone className="w-5 h-5 text-blue-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "needs_info":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "needs_info":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const verificationSteps = [
    { step: 1, title: "Application Submitted", description: "Your verification form has been received" },
    { step: 2, title: "Document Review", description: "Our team is reviewing your documents" },
    { step: 3, title: "Referee Contact", description: "We're contacting your provided referee" },
    { step: 4, title: "Final Review", description: "Final verification and approval process" },
    { step: 5, title: "Completion", description: "Verification complete and agent ID assigned" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-pulse-100 p-3 rounded-lg w-fit mx-auto mb-4">
            <Shield className="w-8 h-8 text-pulse-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Status</h1>
          <p className="text-gray-600">Check the status of your PHCityRent agent verification</p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Check Your Application Status</h2>
          <div className="flex gap-3">
            <Input
              placeholder="Enter your Agent ID (e.g., AGT-PHC-EMEKA001)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !searchId}
              className="bg-pulse-500 hover:bg-pulse-600"
            >
              {isLoading ? "Searching..." : "Check Status"}
            </Button>
          </div>
        </Card>

        {/* Status Results */}
        {statusData && (
          <div className="space-y-6">
            {/* Application Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-pulse-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-pulse-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{statusData.applicantName}</h3>
                    <p className="text-sm text-gray-600">Agent ID: {statusData.agentId}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(statusData.status)}>
                  {getStatusIcon(statusData.status)}
                  <span className="ml-2">{statusData.status.replace('_', ' ').toUpperCase()}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Submitted</p>
                  <p className="font-medium">
                    {new Date(statusData.submissionDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Progress</p>
                  <p className="font-medium">
                    Step {statusData.currentStep} of {statusData.totalSteps}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Est. Completion</p>
                  <p className="font-medium">
                    {statusData.estimatedCompletion ? 
                      new Date(statusData.estimatedCompletion).toLocaleDateString() : 
                      "TBD"
                    }
                  </p>
                </div>
              </div>
            </Card>

            {/* Progress Steps */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Verification Progress</h3>
              <div className="space-y-4">
                {verificationSteps.map((step) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.step <= statusData.currentStep 
                        ? 'bg-pulse-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.step <= statusData.currentStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.step}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        step.step <= statusData.currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.step === statusData.currentStep && statusData.nextAction && (
                        <p className="text-sm text-pulse-600 font-medium mt-1">
                          Current: {statusData.nextAction}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviewer Notes */}
            {statusData.reviewerNotes && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">Review Notes</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">{statusData.reviewerNotes}</p>
                </div>
              </Card>
            )}

            {/* Referee Status */}
            {statusData.refereeStatus && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">Referee Verification</h3>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Referee Status</p>
                    <Badge className={
                      statusData.refereeStatus === "confirmed" 
                        ? "bg-green-100 text-green-800"
                        : statusData.refereeStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }>
                      {statusData.refereeStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Contact Support */}
            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about your verification? Contact our support team.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </Card>
          </div>
        )}

        {statusData === null && searchId && !isLoading && (
          <Card className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Not Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find an application with that Agent ID. Please check your ID and try again.
            </p>
            <Button variant="outline">Contact Support</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;
