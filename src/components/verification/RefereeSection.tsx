
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface RefereeSectionProps {
  form: UseFormReturn<any>;
}

const RefereeSection = ({ form }: RefereeSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Referee Information</h3>
      <p className="text-sm text-gray-600">
        Provide someone who can vouch for your trustworthiness (past client, landlord, pastor, etc.)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="refereeFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referee Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Chief Williams Okoro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="refereeWhatsappNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referee WhatsApp Number</FormLabel>
              <FormControl>
                <Input placeholder="+234 805 987 6543" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="refereeRole"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referee Role/Relationship</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Past client, Landlord, Pastor, Business partner" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RefereeSection;
