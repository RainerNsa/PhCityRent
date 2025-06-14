
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'status_update' | 'referee_contact' | 'welcome';
  applicationId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, applicationId, recipientEmail, recipientPhone, data }: NotificationRequest = await req.json();

    // Get application details
    const { data: application, error: appError } = await supabaseClient
      .from('agent_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError) throw appError;

    let notificationResult = { success: false, message: '' };

    switch (type) {
      case 'status_update':
        notificationResult = await sendStatusUpdateNotification(application, data);
        break;
      case 'referee_contact':
        notificationResult = await sendRefereeContactNotification(application, data);
        break;
      case 'welcome':
        notificationResult = await sendWelcomeNotification(application);
        break;
    }

    // Log notification attempt
    await supabaseClient
      .from('notification_log')
      .insert({
        application_id: applicationId,
        notification_type: type,
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone,
        status: notificationResult.success ? 'sent' : 'failed',
        sent_at: notificationResult.success ? new Date().toISOString() : null,
        error_message: notificationResult.success ? null : notificationResult.message
      });

    return new Response(
      JSON.stringify(notificationResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: notificationResult.success ? 200 : 500,
      }
    );

  } catch (error) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function sendStatusUpdateNotification(application: any, data: any) {
  // This would integrate with your email service (like Resend)
  // For now, we'll simulate the notification
  console.log(`Sending status update to ${application.email}: Status changed to ${data.newStatus}`);
  
  return {
    success: true,
    message: `Status update notification sent for application ${application.agent_id}`
  };
}

async function sendRefereeContactNotification(application: any, data: any) {
  // This would integrate with WhatsApp Business API or SMS service
  console.log(`Contacting referee ${data.refereePhone} for application ${application.agent_id}`);
  
  return {
    success: true,
    message: `Referee contact notification sent for application ${application.agent_id}`
  };
}

async function sendWelcomeNotification(application: any) {
  // Send welcome email/SMS to new applicant
  console.log(`Sending welcome notification to ${application.full_name} (${application.agent_id})`);
  
  return {
    success: true,
    message: `Welcome notification sent for application ${application.agent_id}`
  };
}
