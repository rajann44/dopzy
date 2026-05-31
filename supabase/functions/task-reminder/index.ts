import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { Receiver } from 'https://esm.sh/@upstash/qstash@2.7.0';

Deno.serve(async (req) => {
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upstash-signature',
      },
    });
  }

  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get signatures and environment variables
  const signature = req.headers.get('upstash-signature') || '';
  const currentSigningKey = Deno.env.get('QSTASH_CURRENT_SIGNING_KEY');
  const nextSigningKey = Deno.env.get('QSTASH_NEXT_SIGNING_KEY');

  if (!currentSigningKey || !nextSigningKey) {
    console.error('Missing QStash signing keys in Deno environment.');
    return new Response(JSON.stringify({ error: 'Internal configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Read raw body for signature verification
  const rawBody = await req.text();

  // Verify the signature from QStash
  const receiver = new Receiver({
    currentSigningKey,
    nextSigningKey,
  });

  const isValid = await receiver.verify({
    signature,
    body: rawBody,
  }).catch((err) => {
    console.error('QStash verification failed with error:', err);
    return false;
  });

  if (!isValid) {
    console.warn('Unauthorized request: QStash signature verification failed.');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error('Failed to parse request body:', err);
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { userId, taskId, taskTitle } = payload;

  if (!userId || !taskId) {
    return new Response(JSON.stringify({ error: 'Missing userId or taskId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Initialize Supabase Client with service role to bypass RLS policies for notification creation
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Insert the notification record
  const { error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        type: 'task_reminder',
        title: 'Task Reminder',
        message: `Friendly reminder: your task "${taskTitle}" is due soon or scheduled now!`,
        is_read: false,
        link_to: `/tasks/${taskId}`,
      },
    ]);

  if (error) {
    console.error('Failed to insert notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to create notification' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`Successfully created reminder notification for user ${userId} on task ${taskId}`);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
