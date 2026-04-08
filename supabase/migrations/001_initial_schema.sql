-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  display_name text,
  username text NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9_]{3,20}$'::text),
  avatar_url text DEFAULT 'https://zkopjlkquoqtdytijatb.supabase.co/storage/v1/object/public/avatars/default-avatar.png'::text,
  bio text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.typing_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  char_index integer NOT NULL,
  expected_char text NOT NULL,
  wrong_types text NOT NULL,
  is_correct boolean NOT NULL,
  time_ms real NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  isTyped boolean NOT NULL DEFAULT false,
  CONSTRAINT typing_details_pkey PRIMARY KEY (id),
  CONSTRAINT typing_details_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.typing_sessions(id)
);
CREATE TABLE public.typing_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mode text NOT NULL CHECK (mode = ANY (ARRAY['practice'::text, 'quiz'::text])),
  text_type text NOT NULL,
  text_content text NOT NULL,
  duration_seconds real,
  total_chars integer NOT NULL,
  correct_chars integer NOT NULL,
  errors integer NOT NULL DEFAULT 0,
  wpm real NOT NULL DEFAULT '0'::real,
  accuracy real NOT NULL DEFAULT '0'::real,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  typed_chars integer NOT NULL DEFAULT 0,
  completion_rate real NOT NULL DEFAULT '0'::real,
  CONSTRAINT typing_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT typing_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);