CREATE TYPE "public"."test_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "suite" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"task" text NOT NULL,
	"evaluation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "test_status" NOT NULL,
	"suite_id" integer NOT NULL,
	"error" text,
	"browser_use_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_step" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"order" integer NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "tests" CASCADE;--> statement-breakpoint
ALTER TABLE "test" ADD CONSTRAINT "test_suite_id_suite_id_fk" FOREIGN KEY ("suite_id") REFERENCES "public"."suite"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_step" ADD CONSTRAINT "test_step_test_id_test_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."test"("id") ON DELETE no action ON UPDATE no action;