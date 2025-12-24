import { Injectable, HttpException, OnModuleInit } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly token = process.env.WHATSAPP_TOKEN;
  private readonly phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private readonly apiVersion = 'v18.0';

  onModuleInit() {
    console.log('=== WhatsApp Service Initialization ===');
    console.log('Phone ID:', this.phoneId);
    console.log('Phone ID type:', typeof this.phoneId);
    console.log('Phone ID length:', this.phoneId?.length);
    console.log('Token exists:', !!this.token);
    console.log('Token type:', typeof this.token);
    console.log('Token length:', this.token?.length);
    console.log('Token starts with:', this.token?.substring(0, 3));

    if (!this.token || !this.phoneId) {
      throw new Error(
        'WhatsApp credentials not configured. Please set WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID environment variables.',
      );
    }
  }

  async sendReservationConfirmation(customerPhone: string, reservation: any) {
    try {
      console.log('=== Starting WhatsApp Send ===');
      console.log('Input phone:', customerPhone);
      console.log('Reservation:', reservation);

      // Validate input
      if (!customerPhone) {
        throw new HttpException('Customer phone number is required', 400);
      }

      if (!reservation || !reservation.guestName) {
        throw new HttpException('Reservation data is invalid', 400);
      }

      // Format phone number
      const to = customerPhone.replace(/\D/g, '');
      console.log('Formatted phone:', to);

      if (to.length < 10 || to.length > 15) {
        throw new HttpException(
          `Invalid phone number format. Length: ${to.length}`,
          400,
        );
      }

      const message = `*Reservation Confirmed*

*Reservation Details*
- Name: ${reservation.name}
- Date: ${reservation.date || 'Not specified'}
- Time: ${reservation.time || 'Not specified'}

شكراً لاختياركم خدماتنا 🌟`;

      const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
        name: 'booking_confirmation',
        language: { code: 'ar' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: "name" },
              { type: 'text', text: "" },
            ],
          },
        ],
      },
      };

      console.log('=== Request Details ===');
      console.log('URL:', url);
      console.log('Method: POST');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Headers:', {
        'Authorization': `Bearer ${this.token?.substring(0, 20)}...`,
        'Content-Type': 'application/json',
      });

      console.log('Attempting to send request...');

      const response = await axios({
        method: 'POST',
        url: url,
        data: payload,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
        validateStatus: function (status) {
          return status < 500; // Don't throw on 4xx errors
        },
      });

      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));

      if (response.status >= 400) {
        throw new HttpException(
          {
            message: response.data?.error?.message || 'WhatsApp API error',
            code: response.data?.error?.code,
            details: response.data,
          },
          response.status,
        );
      }

      console.log('✓ Message sent successfully');
      return response.data;

    } catch (error: any) {
      console.error('=== Caught Error ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received');
        console.error('Request:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }

      if (error.config) {
        console.error('Request config:', {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
        });
      }

      throw new HttpException(
        {
          message: error.response?.data?.error?.message || error.message || 'WhatsApp API error',
          code: error.response?.data?.error?.code || error.code,
          details: error.response?.data,
          errorType: error.constructor.name,
        },
        error.response?.status || 500,
      );
    }
  }
}