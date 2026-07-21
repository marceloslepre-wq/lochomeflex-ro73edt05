SET statement_timeout = 0;

CREATE OR REPLACE FUNCTION public.update_overdue_rentals()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.rentals
  SET status = 'Atrasado'
  WHERE status = 'Ativo'
    AND expected_return_date < CURRENT_DATE
    AND actual_return_date IS NULL;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$func$;

GRANT EXECUTE ON FUNCTION public.update_overdue_rentals() TO anon, authenticated;
