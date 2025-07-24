CREATE TYPE "public"."run_status" AS ENUM('pending', 'running', 'passed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."test_run_step_status" AS ENUM('passed', 'failed', 'skipped');--> statement-breakpoint
CREATE TABLE "suite" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"domain" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suite_run" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"suite_id" integer NOT NULL,
	"status" "run_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"label" text NOT NULL,
	"task" text NOT NULL,
	"evaluation" text NOT NULL,
	"suite_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_run" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"test_id" integer NOT NULL,
	"suite_run_id" integer NOT NULL,
	"status" "run_status" NOT NULL,
	"error" text,
	"browser_use_id" text,
	"live_url" text
);
--> statement-breakpoint
CREATE TABLE "test_run_step" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_run_id" integer NOT NULL,
	"step_id" integer NOT NULL,
	"status" "test_run_step_status"
);
--> statement-breakpoint
CREATE TABLE "test_step" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"test_id" integer,
	"order" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "suite_run" ADD CONSTRAINT "suite_run_suite_id_suite_id_fk" FOREIGN KEY ("suite_id") REFERENCES "public"."suite"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test" ADD CONSTRAINT "test_suite_id_suite_id_fk" FOREIGN KEY ("suite_id") REFERENCES "public"."suite"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run" ADD CONSTRAINT "test_run_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run" ADD CONSTRAINT "test_run_suite_run_id_suite_run_id_fk" FOREIGN KEY ("suite_run_id") REFERENCES "public"."suite_run"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run_step" ADD CONSTRAINT "test_run_step_test_run_id_test_run_id_fk" FOREIGN KEY ("test_run_id") REFERENCES "public"."test_run"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_run_step" ADD CONSTRAINT "test_run_step_step_id_test_step_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."test_step"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_step" ADD CONSTRAINT "test_step_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE no action ON UPDATE no action;