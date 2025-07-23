CREATE TABLE "tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"browser_use_id" text NOT NULL
);
