## Data Dictionary

Last verified against live Supabase `public` schema on 2026-06-01.

### Enums

- `public.user_role`: `client`, `tasker`, `admin`
- `public.tasker_status`: `none`, `pending`, `approved`, `rejected`
- `public.task_status`: `open`, `receiving_offers`, `assigned`, `in_progress`, `completed`, `cancelled`
- `public.moderation_status`: `approved`, `pending`, `rejected`
- `public.offer_status`: `pending`, `accepted`, `rejected`, `withdrawn`
- `public.payment_status`: `pending`, `reserved`, `released`, `refunded`

### Tables

#### `public.users`
- Purpose: Canonical app user profile linked to `auth.users`, including shared client and tasker profile attributes.
- Primary key: `id` (uuid).
- Important columns: `email`, `role`, `name`, `tasker_status`, `bio`, `location`, `is_verified`, `tasker_*`, `is_disabled`.
- Relationships: parent for most domain tables.

#### `public.tasks`
- Purpose: Client-posted tasks/jobs.
- Primary key: `id` (uuid).
- Important columns: `client_id`, `assigned_tasker_id`, `status`, `moderation_status`, `offers_count`.
- Relationships: parent for `offers`, `reviews`, `wallet_transactions`, `chat_requests`, `conversations`.

#### `public.offers`
- Purpose: Co-tasker bids for tasks.
- Primary key: `id` (uuid).
- Important columns: `task_id`, `tasker_id`, `price`, `estimated_hours`, `status`.
- Notes: `offers_count` in `tasks` is maintained via trigger logic.

#### `public.wallet_transactions`
- Purpose: Internal escrow ledger states for task payments.
- Primary key: `id` (uuid).
- Important columns: `task_id`, `client_id`, `tasker_id`, `amount`, `status`.
- Notes: tracks reserve/release/refund lifecycle, not external PSP settlement by itself.

#### `public.reviews`
- Purpose: Post-completion ratings and feedback.
- Primary key: `id` (uuid).
- Important columns: `task_id`, `from_user_id`, `to_user_id`, `rating`, `comment`.

#### `public.notifications`
- Purpose: In-app system/user notifications.
- Primary key: `id` (uuid).
- Important columns: `user_id`, `type`, `title`, `message`, `is_read`, `link_to`.

#### `public.chat_requests`
- Purpose: Pre-offer direct inquiry requests.
- Primary key: `id` (uuid).
- Important columns: `task_id`, `sender_id`, `receiver_id`, `question`, `status`.

#### `public.conversations`
- Purpose: Chat thread metadata, optionally tied to a task.
- Primary key: `id` (uuid).
- Important columns: `participant_ids`, `last_message`, `last_message_at`, `unread_count`, `task_id`.

#### `public.chat_messages`
- Purpose: Message events inside conversations.
- Primary key: `id` (uuid).
- Important columns: `conversation_id`, `sender_id`, `text`, `created_at`.

### RLS Policy Intent (High-Level)

- Users can generally read public profile data in `users`; self-update is restricted; admin override exists.
- Task visibility is limited to approved tasks, owners, and admins.
- Offer visibility is scoped to task owner and offering tasker.
- Wallet transactions are scoped to client and tasker participants.
- Conversations/messages/chat requests are scoped to involved participants.
