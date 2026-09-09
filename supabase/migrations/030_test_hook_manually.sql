-- 030_test_hook_manually.sql — Call the hook directly with a test event
-- This tells us EXACTLY what the hook returns

-- First, check the current hook source
SELECT prosrc FROM pg_proc WHERE proname = 'custom_access_token_hook';

-- Call the hook manually with a test event that mimics Supabase's structure
SELECT public.custom_access_token_hook(
  '{
    "user_id": "9857e2ec-5fd8-4f67-b0d5-968c20ef2891",
    "claims": {}
  }'::jsonb
) AS result_with_user_id;

-- Also test with payload.user.id structure
SELECT public.custom_access_token_hook(
  '{
    "payload": {
      "user": {
        "id": "9857e2ec-5fd8-4f67-b0d5-968c20ef2891"
      }
    },
    "claims": {}
  }'::jsonb
) AS result_with_payload;
