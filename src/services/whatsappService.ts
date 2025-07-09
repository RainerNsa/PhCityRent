// WhatsApp Business API Integration Service
import { supabase } from '@/integrations/supabase/client';

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  message_type: 'text' | 'image' | 'document' | 'template' | 'interactive';
  content: string;
  media_url?: string;
  template_name?: string;
  template_params?: string[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
  updated_at: string;
  property_id?: string;
  user_id?: string;
  conversation_id: string;
}

export interface WhatsAppTemplate {
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  components: Array<{
    type: 'header' | 'body' | 'footer' | 'buttons';
    text?: string;
    parameters?: string[];
    buttons?: Array<{
      type: 'quick_reply' | 'url' | 'phone_number';
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

export interface PropertyInquiry {
  property_id: string;
  user_phone: string;
  user_name: string;
  inquiry_type: 'viewing' | 'pricing' | 'availability' | 'general';
  message: string;
  status: 'new' | 'responded' | 'scheduled' | 'closed';
  created_at: string;
  response_time?: number;
}

class WhatsAppService {
  private readonly WHATSAPP_TOKEN = import.meta.env.VITE_WHATSAPP_TOKEN;
  private readonly WHATSAPP_PHONE_ID = import.meta.env.VITE_WHATSAPP_PHONE_ID;
  private readonly WEBHOOK_VERIFY_TOKEN = import.meta.env.VITE_WHATSAPP_WEBHOOK_TOKEN;
  private readonly API_BASE = 'https://graph.facebook.com/v18.0';

  // Send text message
  async sendTextMessage(
    to: string, 
    message: string, 
    propertyId?: string,
    userId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${this.WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send message');
      }

      // Save message to database
      await this.saveMessage({
        from: this.WHATSAPP_PHONE_ID,
        to,
        message_type: 'text',
        content: message,
        status: 'sent',
        property_id: propertyId,
        user_id: userId,
        conversation_id: this.generateConversationId(to)
      });

      return { success: true, messageId: data.messages[0].id };
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      };
    }
  }

  // Send template message
  async sendTemplateMessage(
    to: string,
    templateName: string,
    parameters: string[] = [],
    propertyId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${this.WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'en'
            },
            components: parameters.length > 0 ? [{
              type: 'body',
              parameters: parameters.map(param => ({
                type: 'text',
                text: param
              }))
            }] : []
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send template message');
      }

      // Save message to database
      await this.saveMessage({
        from: this.WHATSAPP_PHONE_ID,
        to,
        message_type: 'template',
        content: `Template: ${templateName}`,
        template_name: templateName,
        template_params: parameters,
        status: 'sent',
        property_id: propertyId,
        conversation_id: this.generateConversationId(to)
      });

      return { success: true, messageId: data.messages[0].id };
    } catch (error) {
      console.error('Failed to send WhatsApp template:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send template' 
      };
    }
  }

  // Send property details
  async sendPropertyDetails(
    to: string, 
    property: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const message = this.formatPropertyMessage(property);
      
      // Send property image if available
      if (property.images && property.images.length > 0) {
        await this.sendImageMessage(to, property.images[0], message);
      } else {
        await this.sendTextMessage(to, message, property.id);
      }

      // Send interactive buttons for actions
      await this.sendPropertyActionButtons(to, property.id);

      return { success: true };
    } catch (error) {
      console.error('Failed to send property details:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send property details' 
      };
    }
  }

  // Send image message
  async sendImageMessage(
    to: string, 
    imageUrl: string, 
    caption?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${this.WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'image',
          image: {
            link: imageUrl,
            caption: caption
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send image');
      }

      // Save message to database
      await this.saveMessage({
        from: this.WHATSAPP_PHONE_ID,
        to,
        message_type: 'image',
        content: caption || 'Image',
        media_url: imageUrl,
        status: 'sent',
        conversation_id: this.generateConversationId(to)
      });

      return { success: true, messageId: data.messages[0].id };
    } catch (error) {
      console.error('Failed to send WhatsApp image:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send image' 
      };
    }
  }

  // Send interactive buttons
  async sendPropertyActionButtons(
    to: string, 
    propertyId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${this.WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: 'What would you like to do next?'
            },
            action: {
              buttons: [
                {
                  type: 'reply',
                  reply: {
                    id: `schedule_viewing_${propertyId}`,
                    title: '📅 Schedule Viewing'
                  }
                },
                {
                  type: 'reply',
                  reply: {
                    id: `get_directions_${propertyId}`,
                    title: '🗺️ Get Directions'
                  }
                },
                {
                  type: 'reply',
                  reply: {
                    id: `contact_landlord_${propertyId}`,
                    title: '📞 Contact Landlord'
                  }
                }
              ]
            }
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send interactive message');
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to send interactive buttons:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send buttons' 
      };
    }
  }

  // Handle incoming webhook
  async handleWebhook(body: any): Promise<{ success: boolean; response?: string }> {
    try {
      if (body.entry && body.entry[0] && body.entry[0].changes) {
        const change = body.entry[0].changes[0];
        
        if (change.field === 'messages' && change.value.messages) {
          const message = change.value.messages[0];
          await this.processIncomingMessage(message, change.value.contacts[0]);
        }

        if (change.field === 'messages' && change.value.statuses) {
          const status = change.value.statuses[0];
          await this.updateMessageStatus(status.id, status.status);
        }
      }

      return { success: true, response: 'Webhook processed' };
    } catch (error) {
      console.error('Failed to process webhook:', error);
      return { success: false };
    }
  }

  // Process incoming message
  private async processIncomingMessage(message: any, contact: any): Promise<void> {
    try {
      // Save incoming message
      await this.saveMessage({
        from: message.from,
        to: this.WHATSAPP_PHONE_ID,
        message_type: message.type,
        content: this.extractMessageContent(message),
        status: 'delivered',
        conversation_id: this.generateConversationId(message.from)
      });

      // Process message based on type and content
      await this.handleMessageIntent(message, contact);
    } catch (error) {
      console.error('Failed to process incoming message:', error);
    }
  }

  // Handle message intent
  private async handleMessageIntent(message: any, contact: any): Promise<void> {
    const content = this.extractMessageContent(message).toLowerCase();
    const from = message.from;

    // Property search intent
    if (content.includes('property') || content.includes('house') || content.includes('apartment')) {
      await this.handlePropertySearchIntent(from, content);
      return;
    }

    // Viewing request intent
    if (content.includes('viewing') || content.includes('visit') || content.includes('see')) {
      await this.handleViewingRequestIntent(from, content);
      return;
    }

    // Pricing inquiry intent
    if (content.includes('price') || content.includes('cost') || content.includes('rent')) {
      await this.handlePricingInquiryIntent(from, content);
      return;
    }

    // Button response
    if (message.type === 'interactive' && message.interactive.type === 'button_reply') {
      await this.handleButtonResponse(from, message.interactive.button_reply.id);
      return;
    }

    // Default response
    await this.sendDefaultResponse(from);
  }

  // Handle property search intent
  private async handlePropertySearchIntent(from: string, content: string): Promise<void> {
    const searchResults = await this.searchProperties(content);
    
    if (searchResults.length > 0) {
      await this.sendTextMessage(
        from, 
        `I found ${searchResults.length} properties that might interest you. Let me share the top matches:`
      );

      // Send top 3 properties
      for (const property of searchResults.slice(0, 3)) {
        await this.sendPropertyDetails(from, property);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between messages
      }
    } else {
      await this.sendTextMessage(
        from,
        "I couldn't find properties matching your criteria. Let me help you refine your search. What's your budget range and preferred location?"
      );
    }
  }

  // Handle viewing request intent
  private async handleViewingRequestIntent(from: string, content: string): Promise<void> {
    await this.sendTextMessage(
      from,
      "I'd be happy to help you schedule a property viewing! Please share:\n\n1. Property you're interested in\n2. Your preferred date and time\n3. Your contact details\n\nOur team will confirm the appointment within 2 hours."
    );
  }

  // Handle pricing inquiry intent
  private async handlePricingInquiryIntent(from: string, content: string): Promise<void> {
    await this.sendTextMessage(
      from,
      "For accurate pricing information, please share:\n\n1. Your budget range\n2. Preferred location\n3. Property type (apartment, house, etc.)\n4. Number of bedrooms\n\nI'll send you properties within your budget with current market rates."
    );
  }

  // Handle button responses
  private async handleButtonResponse(from: string, buttonId: string): Promise<void> {
    const [action, propertyId] = buttonId.split('_').slice(0, 2);

    switch (action) {
      case 'schedule':
        await this.sendTextMessage(
          from,
          "Great! To schedule your viewing, please reply with your preferred:\n\n📅 Date (e.g., Tomorrow, Monday, Jan 15)\n⏰ Time (e.g., 10am, 2pm, evening)\n\nOur team will confirm within 2 hours."
        );
        break;

      case 'get':
        const property = await this.getPropertyById(propertyId);
        if (property) {
          const directionsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(property.location)}`;
          await this.sendTextMessage(
            from,
            `📍 Directions to ${property.title}:\n\n${property.location}\n\nGoogle Maps: ${directionsUrl}\n\nFor assistance, call our office: +234-801-234-5678`
          );
        }
        break;

      case 'contact':
        await this.sendTextMessage(
          from,
          "I'll connect you with the landlord. Please share:\n\n1. Your full name\n2. Your phone number\n3. Best time to call\n\nThe landlord will contact you within 4 hours."
        );
        break;
    }
  }

  // Send default response
  private async sendDefaultResponse(from: string): Promise<void> {
    await this.sendTextMessage(
      from,
      "Hello! 👋 Welcome to PHCityRent.\n\nI can help you with:\n🏠 Finding properties\n📅 Scheduling viewings\n💰 Pricing information\n📞 Contacting landlords\n\nWhat are you looking for today?"
    );
  }

  // Utility methods
  private formatPropertyMessage(property: any): string {
    return `🏠 *${property.title}*\n\n📍 Location: ${property.location}\n💰 Price: ₦${property.price.toLocaleString()}/month\n🛏️ Bedrooms: ${property.bedrooms}\n🚿 Bathrooms: ${property.bathrooms}\n📏 Size: ${property.size}sqm\n\n${property.description}\n\n✨ Amenities: ${property.amenities?.join(', ') || 'Contact for details'}`;
  }

  private extractMessageContent(message: any): string {
    switch (message.type) {
      case 'text':
        return message.text.body;
      case 'interactive':
        return message.interactive.button_reply?.title || message.interactive.list_reply?.title || '';
      default:
        return `[${message.type}]`;
    }
  }

  private generateConversationId(phoneNumber: string): string {
    return `conv_${phoneNumber}_${this.WHATSAPP_PHONE_ID}`;
  }

  private async saveMessage(messageData: Omit<WhatsAppMessage, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      await supabase
        .from('whatsapp_messages')
        .insert([{
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Failed to save WhatsApp message:', error);
    }
  }

  private async updateMessageStatus(messageId: string, status: string): Promise<void> {
    try {
      await supabase
        .from('whatsapp_messages')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', messageId);
    } catch (error) {
      console.error('Failed to update message status:', error);
    }
  }

  private async searchProperties(query: string): Promise<any[]> {
    try {
      // Extract search criteria from query
      const budgetMatch = query.match(/(\d+)k?/);
      const locationMatch = query.match(/(gra|trans|amadi|township|rumuola|eliozu|woji)/i);
      
      let searchQuery = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .limit(5);

      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]) * (budgetMatch[0].includes('k') ? 1000 : 1);
        searchQuery = searchQuery.lte('price', budget * 1.2); // 20% buffer
      }

      if (locationMatch) {
        searchQuery = searchQuery.ilike('location', `%${locationMatch[1]}%`);
      }

      const { data, error } = await searchQuery;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to search properties:', error);
      return [];
    }
  }

  private async getPropertyById(propertyId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get property:', error);
      return null;
    }
  }

  // Public methods for sending notifications
  async sendPaymentConfirmation(
    phoneNumber: string, 
    amount: number, 
    reference: string
  ): Promise<{ success: boolean; error?: string }> {
    const message = `✅ Payment Confirmed!\n\nAmount: ₦${amount.toLocaleString()}\nReference: ${reference}\nDate: ${new Date().toLocaleDateString()}\n\nThank you for using PHCityRent! Your receipt has been sent to your email.`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  async sendViewingReminder(
    phoneNumber: string, 
    propertyTitle: string, 
    viewingDate: string
  ): Promise<{ success: boolean; error?: string }> {
    const message = `📅 Viewing Reminder\n\n🏠 Property: ${propertyTitle}\n📅 Date: ${viewingDate}\n\nPlease arrive 5 minutes early. Contact us if you need to reschedule: +234-801-234-5678`;
    
    return await this.sendTextMessage(phoneNumber, message);
  }

  async sendPropertyAlert(
    phoneNumber: string, 
    property: any
  ): Promise<{ success: boolean; error?: string }> {
    const message = `🚨 New Property Alert!\n\nA property matching your criteria is now available:\n\n${this.formatPropertyMessage(property)}\n\nInterested? Reply to this message or visit our website.`;
    
    return await this.sendTextMessage(phoneNumber, message, property.id);
  }
}

export const whatsappService = new WhatsAppService();
export default WhatsAppService;
