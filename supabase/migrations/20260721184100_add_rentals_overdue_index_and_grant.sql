-- Add a partial index to speed up the update_overdue_rentals() function
-- and prevent lock contention that blocked previous migrations.
CREATE INDEX IF NOT EXISTS idx_rentals_overdue
  ON public.rentals (status, expected_return_date)
  WHERE actual_return_date IS NULL;

-- Ensure the RPC is callable by anon (edge function) and authenticated (frontend)
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.update_overdue_rentals() TO anon, authenticated;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END
$$;
