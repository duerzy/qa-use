CREATE TYPE "public"."cron_cadence" AS ENUM('hourly', 'daily');--> statement-breakpoint
ALTER TABLE "suite" ADD COLUMN "cron_cadence" "cron_cadence";--> statement-breakpoint
ALTER TABLE "suite" ADD COLUMN "last_cron_run_at" timestamp;