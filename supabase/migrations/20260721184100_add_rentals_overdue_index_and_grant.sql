-- Add a partial index to speed up the update_overdue_rentals() function.
-- CONCURRENTLY avoids blocking writes while the index is built.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rentals_overdue
  ON public.rentals (status, expected_return_date)
  WHERE actual_return_date IS NULL;

-- Ensure the RPC is callable by anon (edge function) and authenticated (frontend).
-- Guarded in case the function does not exist yet.
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.update_overdue_rentals() TO anon, authenticated;
EXCEPTION
  WHEN undefined_function THEN
    NULL;
END
$$;
