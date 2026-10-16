import 'server-only';
import { createHmac } from 'node:crypto';
import { serviceDatabase } from './supabase/server';
const local = new Map<string, { count: number; expires: number }>();
export async function allowLead(ip: string) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production' && serviceDatabase())
    throw new Error('Proteção de envio não configurada.');
  const key = createHmac('sha256', secret || 'local-development-only')
    .update(ip)
    .digest('hex');
  const db = serviceDatabase();
  if (db) {
    const { data, error } = await db.rpc('consume_lead_limit', {
      bucket_key: key,
    });
    if (error) throw new Error('Não foi possível validar o envio.');
    return data === true;
  }
  const now = Date.now();
  for (const [k, v] of local) if (v.expires < now) local.delete(k);
  const entry = local.get(key) || { count: 0, expires: now + 3600000 };
  entry.count++;
  local.set(key, entry);
  return entry.count <= 5;
}
