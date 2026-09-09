-- 032_new_hook_name.sql — Create hook with NEW name to bypass cache
-- Then configure Supabase to use the new function name

-- 1) Create the new hook function
CREATE OR REPLACE FUNCTION public.custom_access_token_hook_v2(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_claims jsonb;
  v_user_id text;
  v_tenant_id text;
  v_role text;
BEGIN
  -- Try both paths for user_id
  v_user_id := event->'payload'->'user'->>'id';
  IF v_user_id IS NULL THEN
    v_user_id := event->>'user_id';
  END IF;

  IF v_user_id IS NULL OR v_user_id = '' THEN
    RETURN event;
  END IF;

  v_claims := event->'claims';
  IF v_claims IS NULL THEN
    v_claims := '{}'::jsonb;
  END IF;

  -- Super-admin check
  IF EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = v_user_id::uuid AND is_super_admin = true
  ) THEN
    RETURN event;
  END IF;

  -- Find tenant and role
  SELECT tenant_id::text, role::text INTO v_tenant_id, v_role
  FROM public.staff
  WHERE auth_user_id = v_user_id::uuid
  LIMIT 1;

  IF v_tenant_id IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{tenant_id}', to_jsonb(v_tenant_id));
  END IF;

  IF v_role IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{user_role}', to_jsonb(v_role));
  END IF;

  RETURN jsonb_set(event, '{claims}', v_claims);
EXCEPTION
  WHEN OTHERS THEN
    RETURN event;
END $$;

-- 2) Test it manually
SELECT public.custom_access_token_hook_v2(
  '{
    "payload": {
      "user": {
        "id": "9857e2ec-5fd8-4f67-b0d5-968c20ef2891"
      }
    },
    "claims": {}
  }'::jsonb
) AS test_result;
