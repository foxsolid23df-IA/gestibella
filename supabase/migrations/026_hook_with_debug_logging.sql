-- 026_hook_with_debug_logging.sql — Hook with RAISE WARNING at every step
-- This will show EXACTLY what the hook does when it runs.
-- Check Supabase Dashboard → Logs → Auth after login to see the warnings.

DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_claims jsonb;
  v_user_id text;
  v_tenant_id text;
  v_role text;
  v_staff_count integer;
BEGIN
  v_user_id := event->>'user_id';
  RAISE WARNING 'HOOK STEP 1: user_id=%', v_user_id;

  IF v_user_id IS NULL OR v_user_id = '' THEN
    RAISE WARNING 'HOOK STEP 1b: user_id is NULL/empty, returning unchanged';
    RETURN event;
  END IF;

  v_claims := event->'claims';
  IF v_claims IS NULL THEN
    v_claims := '{}'::jsonb;
  END IF;
  RAISE WARNING 'HOOK STEP 2: claims=%', v_claims;

  -- Count staff with this auth_user_id
  SELECT COUNT(*) INTO v_staff_count FROM public.staff WHERE auth_user_id = v_user_id::uuid;
  RAISE WARNING 'HOOK STEP 3: staff count with auth_user_id=%: %', v_user_id, v_staff_count;

  -- Check super-admin
  IF EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = v_user_id::uuid AND is_super_admin = true
  ) THEN
    RAISE WARNING 'HOOK STEP 4: user IS super-admin, skipping tenant_id';
    RETURN event;
  END IF;
  RAISE WARNING 'HOOK STEP 4: user is NOT super-admin';

  -- Find tenant
  BEGIN
    SELECT tenant_id::text, role::text INTO v_tenant_id, v_role
    FROM public.staff
    WHERE auth_user_id = v_user_id::uuid
    LIMIT 1;
    RAISE WARNING 'HOOK STEP 5: found tenant_id=%, role=%', v_tenant_id, v_role;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'HOOK STEP 5 ERROR: %', SQLERRM;
    v_tenant_id := NULL;
    v_role := NULL;
  END;

  IF v_tenant_id IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{tenant_id}', to_jsonb(v_tenant_id));
    RAISE WARNING 'HOOK STEP 6: injected tenant_id into claims';
  ELSE
    RAISE WARNING 'HOOK STEP 6: tenant_id is NULL, NOT injecting';
  END IF;

  IF v_role IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{user_role}', to_jsonb(v_role));
  END IF;

  RAISE WARNING 'HOOK STEP 7: returning event with claims=%', v_claims;
  RETURN jsonb_set(event, '{claims}', v_claims);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'HOOK CRITICAL ERROR: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
    RETURN event;
END $$;
