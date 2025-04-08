// pages/api/check-premium.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { isPremiumUser } from '../../lib/db';

export default function handler(
  req: NextApiRequest, 
  res: NextApiResponse<{ isPremium: boolean } | { error: string }>
) {
  const { userId } = req.query;
  
  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  const premium = isPremiumUser(userId);
  
  return res.status(200).json({ isPremium: premium });
}