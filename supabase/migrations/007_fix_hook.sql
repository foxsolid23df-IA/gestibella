-- 007_fix_hook.sql — Corrige custom_access_token_hook que causaba "Error running hook URI"
-- Causa: el hook anterior fallaba si el usuario no tenía staff row (user_role subquery devolvía null mal manejado)
--        y por usar search_path solo public. Esta versión es defensiva y nunca lanza excepción.

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_catalog
as $$
declare
  claims jsonb;
  user_id uuid;
  v_tenant uuid;
  v_role text;
  v_is_super boolean;
begin
  -- Extraer claims y user_id de forma segura
  claims := coalesce(event->'claims', '{}'::jsonb);
  begin
    user_id := nullif(event->>'user_id','')::uuid;
  exception when others then
    return event; -- si no hay user_id válido, no modificar
  end;

  -- ¿Es super-admin? Devolver sin modificar (evita inyección innecesaria)
  begin
    select exists(select 1 from public.platform_admins where platform_admins.user_id = custom_access_token_hook.user_id and is_super_admin)
      into v_is_super;
  exception when others then
    v_is_super := false;
  end;
  if v_is_super then
    return event;
  end if;

  -- Buscar tenant y role del staff vinculado
  begin
    select tenant_id, role::text into v_tenant, v_role
    from public.staff
    where auth_user_id = custom_access_token_hook.user_id
    limit 1;
  exception when others then
    return jsonb_set(event, '{claims}', claims);
  end;

  if v_tenant is not null then
    -- Inyectar tenant_id siempre como texto (RLS espera ::uuid)
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant::text), true);
    if v_role is not null then
      claims := jsonb_set(claims, '{user_role}', to_jsonb(v_role), true);
    end if;
  end if;

  return jsonb_set(event, '{claims}', claims);
exception when others then
  -- Nunca romper el login: si algo falla, devolver event sin modificar
  return event;
end $$;

-- Asegurar permisos: Supabase Auth (supabase_auth_admin) debe poder ejecutar
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to postgres;

-- Nota: No tocar RLS aquí. Solo reemplaza la función.
-- Después de aplicar, haz logout/login para que el nuevo JWT incluya tenant_id.
