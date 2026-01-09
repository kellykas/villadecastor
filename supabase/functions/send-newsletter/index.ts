import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendNewsletterRequest {
  campaignId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract and validate Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with user's auth token for validation
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify JWT and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub;

    // Create service role client for admin check and operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' });
    
    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { campaignId }: SendNewsletterRequest = await req.json();

    // Validate campaignId
    if (!campaignId || typeof campaignId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid campaign ID' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error("Campaign not found");
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from("email_subscribers")
      .select("email, name")
      .eq("is_active", true);

    if (subscribersError) {
      throw new Error("Failed to fetch subscribers");
    }

    if (!subscribers || subscribers.length === 0) {
      throw new Error("No active subscribers found");
    }

    // Update campaign status to sending
    await supabase
      .from("email_campaigns")
      .update({ status: "sending" })
      .eq("id", campaignId);

    let sentCount = 0;
    const errors: string[] = [];

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      try {
        const personalizedContent = campaign.content
          .replace(/{{name}}/g, subscriber.name || "Subscriber");

        await resend.emails.send({
          from: "Villa de Castor <newsletter@resend.dev>",
          to: [subscriber.email],
          subject: campaign.subject,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              ${personalizedContent}
              <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666; text-align: center;">
                You received this email because you subscribed to Villa de Castor newsletter.<br>
                <a href="{{unsubscribe_url}}" style="color: #666;">Unsubscribe</a>
              </p>
            </body>
            </html>
          `,
        });
        sentCount++;
      } catch (emailError: any) {
        console.error(`Failed to send to ${subscriber.email}:`, emailError);
        errors.push(subscriber.email);
      }
    }

    // Update campaign with results
    await supabase
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        sent_count: sentCount,
      })
      .eq("id", campaignId);

    console.log(`Newsletter sent to ${sentCount} subscribers`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sentCount, 
        errors: errors.length > 0 ? errors : undefined 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
