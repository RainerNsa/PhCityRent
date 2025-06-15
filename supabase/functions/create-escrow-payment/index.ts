
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) throw new Error("User not authenticated");

    const { propertyId, amount, tenantName, tenantEmail, tenantPhone, transactionType } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Calculate escrow fee (2.5%)
    const escrowFee = Math.round(amount * 0.025);
    const totalAmount = amount + escrowFee;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Escrow Service - ${transactionType}`,
              description: `Secure escrow payment for property rental`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/escrow/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/escrow?canceled=true`,
      metadata: {
        propertyId,
        userId: user.id,
        transactionType,
      },
    });

    // Create escrow transaction record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: transaction, error } = await supabaseService
      .from("escrow_transactions")
      .insert({
        user_id: user.id,
        property_id: propertyId,
        tenant_name: tenantName,
        tenant_email: tenantEmail,
        tenant_phone: tenantPhone,
        amount: amount,
        escrow_fee: escrowFee,
        transaction_type: transactionType,
        stripe_session_id: session.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial milestones
    await supabaseService.from("escrow_milestones").insert([
      {
        transaction_id: transaction.id,
        milestone_type: "funds_deposited",
        status: "pending",
      },
      {
        transaction_id: transaction.id,
        milestone_type: "agreement_verified",
        status: "pending",
      },
      {
        transaction_id: transaction.id,
        milestone_type: "keys_transferred",
        status: "pending",
      },
      {
        transaction_id: transaction.id,
        milestone_type: "funds_released",
        status: "pending",
      },
    ]);

    return new Response(JSON.stringify({ url: session.url, transactionId: transaction.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating escrow payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
