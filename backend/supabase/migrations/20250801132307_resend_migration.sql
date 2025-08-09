-- Migration to rename sendgrid_configured to resend_configured
ALTER TABLE public.api_settings RENAME COLUMN sendgrid_configured TO resend_configured; 