// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<{ received: boolean } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook Error: ${errorMessage}`);
    return res.status(400).json({ error: `Webhook Error: ${errorMessage}` });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Get customer details from session
    const userId = session.metadata?.userId;
    
    if (userId) {
      // Import is inside the handler to avoid issues with Next.js edge functions
      const { updateUser, recordPayment } = await import('../../lib/db');
      
      // Update user's subscription status
      updateUser(userId, { isPremium: true });
      
      // Record the payment
      recordPayment({
        userId,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        paymentId: session.payment_intent as string,
        timestamp: new Date().toISOString()
      });
      
      console.log(`User ${userId} upgraded to premium!`);
    }
  }

  res.status(200).json({ received: true });
}