
import React, { useState } from "react";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Phone, 
  AlertCircle
} from "lucide-react";
import VerificationStatusHeader from "./verification-status/VerificationStatusHeader";
import StatusSearchForm from "./verification-status/StatusSearchForm";
import ApplicationOverview from "./verification-status/ApplicationOverview";
import ProgressSteps from "./verification-status/ProgressSteps";
import ReviewNotes from "./verification-status/ReviewNotes";
import RefereeStatus from "./verification-status/RefereeStatus";
import SupportSection from "./verification-status/SupportSection";
import ApplicationNotFound from "./verification-status/ApplicationNotFound";

const VerificationStatus = () => {
  const [searchId, setSearchId] = useState("");
  const { checkStatus, isLoading, statusData } = useVerificationStatus();

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    await checkStatus(searchId.trim());
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <VerificationStatusHeader />

        <StatusSearchForm
          searchId={searchId}
          onSearchIdChange={setSearchId}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {statusData && (
          <div className="space-y-6">
            <ApplicationOverview
              statusData={statusData}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />

            <ProgressSteps statusData={statusData} />

            <ReviewNotes reviewerNotes={statusData.reviewerNotes || ""} />

            <RefereeStatus refereeStatus={statusData.refereeStatus || ""} />

            <SupportSection />
          </div>
        )}

        {statusData === null && searchId && !isLoading && (
          <ApplicationNotFound />
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;
