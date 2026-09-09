-- 018_fix_hook_minimal.sql — Minimal hook with full error handling
-- Previous versions crashed because:
-- 1) auth.users query failed in security definer
-- 2) claims could be NULL causing jsonb_set to fail
-- This version is bulletproof: only reads public.staff, handles all NULLs.

DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_claims jsonb;
  v_user_id text;
  v_tenant_id text;
  v_role text;
BEGIN
  -- Safely extract user_id
  v_user_id := event->>'user_id';
  IF v_user_id IS NULL OR v_user_id = '' THEN
    RETURN event;
  END IF;

  -- Safely extract or initialize claims
  v_claims := event->'claims';
  IF v_claims IS NULL THEN
    v_claims := '{}'::jsonb;
  END IF;

  -- Skip super-admins
  IF EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = v_user_id::uuid AND is_super_admin = true
  ) THEN
    RETURN event;
  END IF;

  -- Find tenant and role from staff (only queries public.staff)
  SELECT tenant_id::text, role::text INTO v_tenant_id, v_role
  FROM public.staff
  WHERE auth_user_id = v_user_id::uuid
  LIMIT 1;

  -- Inject tenant_id if found
  IF v_tenant_id IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{tenant_id}', to_jsonb(v_tenant_id));
  END IF;

  -- Inject user_role if found
  IF v_role IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{user_role}', to_jsonb(v_role));
  END IF;

  RETURN jsonb_set(event, '{claims}', v_claims);
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, return event unchanged (don't crash auth)
    RAISE WARNING 'custom_access_token_hook error: %', SQLERRM;
    RETURN event;
END $$;
