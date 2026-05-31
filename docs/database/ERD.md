## Dopzy Database ERD

Last verified against live Supabase `public` schema on 2026-06-01.

```mermaid
erDiagram
  users ||--o| client_profiles : has
  users ||--o| cotasker_profiles : has

  users ||--o{ tasks : creates
  users ||--o{ tasks : assigned_to

  tasks ||--o{ offers : receives
  users ||--o{ offers : submits

  tasks ||--o{ wallet_transactions : tracks
  users ||--o{ wallet_transactions : client
  users ||--o{ wallet_transactions : cotasker

  tasks ||--o{ reviews : belongs_to
  users ||--o{ reviews : writes
  users ||--o{ reviews : receives

  users ||--o{ notifications : gets

  tasks ||--o{ chat_requests : context
  users ||--o{ chat_requests : sender
  users ||--o{ chat_requests : receiver

  tasks ||--o{ conversations : context
  conversations ||--o{ chat_messages : contains
  users ||--o{ chat_messages : sends

  users {
    uuid id PK
    text email
    user_role role
    text name
    cotasker_status co_tasker_status
    bool is_disabled
  }

  client_profiles {
    uuid user_id PK,FK
    text location
    bool is_verified
  }

  cotasker_profiles {
    uuid user_id PK,FK
    text bio
    jsonb skills
    numeric rating
    integer completed_jobs
  }

  tasks {
    uuid id PK
    uuid client_id FK
    uuid assigned_cotasker_id FK
    task_status status
    moderation_status moderation_status
    integer offers_count
  }

  offers {
    uuid id PK
    uuid task_id FK
    uuid cotasker_id FK
    numeric price
    offer_status status
  }

  wallet_transactions {
    uuid id PK
    uuid task_id FK
    uuid client_id FK
    uuid cotasker_id FK
    numeric amount
    payment_status status
  }

  reviews {
    uuid id PK
    uuid task_id FK
    uuid from_user_id FK
    uuid to_user_id FK
    int rating
  }

  notifications {
    uuid id PK
    uuid user_id FK
    text type
    bool is_read
  }

  chat_requests {
    uuid id PK
    uuid task_id FK
    uuid sender_id FK
    uuid receiver_id FK
    text status
  }

  conversations {
    uuid id PK
    uuid task_id FK
    jsonb participant_ids
  }

  chat_messages {
    uuid id PK
    uuid conversation_id FK
    uuid sender_id FK
  }
```
