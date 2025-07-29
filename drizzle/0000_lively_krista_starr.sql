CREATE TYPE "public"."cron_cadence" AS ENUM('hourly', 'daily');--> statement-breakpoint
CREATE TYPE "public"."run_status" AS ENUM('pending', 'running', 'passed', 'failed');--> statement-breakpoint
CREATE TABLE "suite" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cron_cadence" "cron_cadence",
	"last_cron_run_at" timestamp,
	"notifications_email_address" text
);
--> statement-breakpoint
CREATE TABLE "suite_run" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"finished_at" timestamp,
	"suite_id" integer NOT NULL,
	"status" "run_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"label" text NOT NULL,
	"evaluation" text NOT NULL,
	"suite_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_run" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"finished_at" timestamp,
	"test_id" integer NOT NULL,
	"suite_run_id" integer,
	"status" "run_status" NOT NULL,
	"error" text,
	"browser_use_id" text,
	"live_url" text,
	"public_share_url" text
);
--> statement-breakpoint
CREATE TABLE "test_run_step" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_run_id" integer NOT NULL,
	"step_id" integer NOT NULL,
	"status" "run_status" NOT NULL,
	CONSTRAINT "test_run_step_unique" UNIQUE("test_run_id","step_id")
);
--> statement-breakpoint
CREATE TABLE "test_step" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"test_id" integer NOT NULL,
	"order" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "suite_run" ADD CONSTRAINT "suite_run_suite_id_suite_id_fk" FOREIGN KEY ("suite_id") REFERENCES "public"."suite"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test" ADD CONSTRAINT "test_suite_id_suite_id_fk" FOREIGN KEY ("suite_id") REFERENCES "public"."suite"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run" ADD CONSTRAINT "test_run_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run" ADD CONSTRAINT "test_run_suite_run_id_suite_run_id_fk" FOREIGN KEY ("suite_run_id") REFERENCES "public"."suite_run"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run_step" ADD CONSTRAINT "test_run_step_test_run_id_test_run_id_fk" FOREIGN KEY ("test_run_id") REFERENCES "public"."test_run"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run_step" ADD CONSTRAINT "test_run_step_step_id_test_step_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."test_step"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_step" ADD CONSTRAINT "test_step_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE cascade ON UPDATE no action;