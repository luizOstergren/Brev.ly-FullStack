CREATE TABLE "uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"remote_key" text NOT NULL,
	"remote_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_short_url_unique" UNIQUE("short_url"),
	CONSTRAINT "uploads_remote_key_unique" UNIQUE("remote_key")
);
