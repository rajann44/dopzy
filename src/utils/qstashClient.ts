import { Client } from '@upstash/qstash';

const qstashToken = import.meta.env.VITE_QSTASH_TOKEN;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

if (!qstashToken) {
  console.warn('QStash Token is missing. Please define VITE_QSTASH_TOKEN.');
}

export const qstash = new Client({
  token: qstashToken || '',
  baseUrl: import.meta.env.VITE_QSTASH_URL,
});

interface ScheduleReminderParams {
  userId: string;
  taskId: string;
  taskTitle: string;
  delaySeconds: number; // e.g., delay in seconds before sending
}

/**
 * Schedules a task reminder via QStash.
 */
export async function scheduleTaskReminder({
  userId,
  taskId,
  taskTitle,
  delaySeconds,
}: ScheduleReminderParams) {
  // If we are on localhost, QStash cloud cannot call our localhost server directly.
  // In production, we hit the Supabase edge function url.
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // You can define VITE_QSTASH_RECEIVER_URL in .env if you use ngrok/localtunnel for local webhook testing.
  const receiverUrl = import.meta.env.VITE_QSTASH_RECEIVER_URL || `${supabaseUrl}/functions/v1/task-reminder`;

  if (isLocal && !import.meta.env.VITE_QSTASH_RECEIVER_URL) {
    console.info(
      `[QStash Local Mock] Scheduled reminder for task "${taskTitle}" in ${delaySeconds}s (Target: ${receiverUrl}).`
    );
    // Locally, we will mock/simulate this or print it. If QSTASH_TOKEN is set and receiverUrl is public, we can still publish.
  }

  try {
    const response = await qstash.publishJSON({
      url: receiverUrl,
      body: {
        userId,
        taskId,
        taskTitle,
      },
      delay: delaySeconds,
      // You can also add headers here if needed
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[QStash] Message successfully scheduled:', response);
    return response;
  } catch (error) {
    console.error('[QStash] Error scheduling reminder:', error);
    throw error;
  }
}
