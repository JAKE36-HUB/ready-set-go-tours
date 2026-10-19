-- Visitor data retention.
-- Deletes rows from public.visitors whose last activity is older than 1 month.
--
-- HOW TO USE
--   1. Enable pg_cron once:
--        Supabase Dashboard > Database > Extensions > enable "pg_cron"
--      (the CREATE EXTENSION below also works on plans that allow it)
--   2. Run this whole file in the SQL Editor.
--
-- This schedules a daily job at 03:00 UTC. Re-running the file is safe:
-- it removes any previous job with the same name before re-creating it.

create extension if not exists pg_cron;

-- Drop a previous copy of the job so re-running stays idempotent.
select cron.unschedule('delete-old-visitors')
where exists (
  select 1 from cron.job where jobname = 'delete-old-visitors'
);

select cron.schedule(
  'delete-old-visitors',
  '0 3 * * *',
  $job$
    delete from public.visitors
    where last_active_at < now() - interval '30 days';
  $job$
);

-- Verify the job is registered.
select jobid, jobname, schedule, command, active
from cron.job
where jobname = 'delete-old-visitors';
