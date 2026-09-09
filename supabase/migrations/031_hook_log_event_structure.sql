-- 031_hook_log_event_structure.sql — Log the ACTUAL event structure Supabase passes
-- Check Supabase Dashboard → Logs → Postgres after login to see the output

DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_claims jsonb;
  v_user_id text;
  v_tenant_id text;
  v_role text;
BEGIN
  -- Log the FULL event structure
  RAISE WARNING 'HOOK EVENT KEYS: %', jsonb_object_keys(event);
  RAISE WARNING 'HOOK EVENT FULL: %', event;
  RAISE WARNING 'HOOK user_id path 1: %', event->>'user_id';
  RAISE WARNING 'HOOK user_id path 2: %', event->'payload'->'user'->>'id';

  -- Try both paths
  v_user_id := event->'payload'->'user'->>'id';
  IF v_user_id IS NULL THEN
    v_user_id := event->>'user_id';
  END IF;

  RAISE WARNING 'HOOK resolved user_id: %', v_user_id;

  IF v_user_id IS NULL OR v_user_id = '' THEN
    RAISE WARNING 'HOOK: no user_id found, returning unchanged';
    RETURN event;
  END IF;

  v_claims := event->'claims';
  IF v_claims IS NULL THEN
    v_claims := '{}'::jsonb;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = v_user_id::uuid AND is_super_admin = true
  ) THEN
    RAISE WARNING 'HOOK: super-admin, skipping';
    RETURN event;
  END IF;

  SELECT tenant_id::text, role::text INTO v_tenant_id, v_role
  FROM public.staff
  WHERE auth_user_id = v_user_id::uuid
  LIMIT 1;

  RAISE WARNING 'HOOK: tenant_id=%, role=%', v_tenant_id, v_role;

  IF v_tenant_id IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{tenant_id}', to_jsonb(v_tenant_id));
  END IF;
  IF v_role IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{user_role}', to_jsonb(v_role));
  END IF;

  RAISE WARNING 'HOOK: final claims=%', v_claims;
  RETURN jsonb_set(event, '{claims}', v_claims);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'HOOK ERROR: %', SQLERRM;
    RETURN event;
END $$;
