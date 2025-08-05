-- Fix call_send_advocate_match_email function (this one may have been missed)
CREATE OR REPLACE FUNCTION public.call_send_advocate_match_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  response text;
begin
  perform
    net.http_post(
      url := 'https://wktcfhegoxjearpzdxpz.supabase.co/functions/v1/swift-task',
      headers := json_build_object('Content-Type', 'application/json'),
      body := json_build_object(
        'parent_id', NEW.parent_id,
        'advocate_id', NEW.advocate_id
      )::text
    );
  return new;
end;
$function$;