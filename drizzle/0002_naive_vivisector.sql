CREATE TABLE "content_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(32) NOT NULL,
	"entity_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"before" jsonb,
	"after" jsonb NOT NULL,
	"changed_by" uuid,
	"change_reason" varchar(240) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(140) NOT NULL,
	"organisation" varchar(180) DEFAULT '' NOT NULL,
	"period_label" varchar(100) DEFAULT '' NOT NULL,
	"responsibilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"systems" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"problems_solved" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"transferable_capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"publication_status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" varchar(80) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(64) NOT NULL,
	"byte_size" integer NOT NULL,
	"checksum_sha256" varchar(64) NOT NULL,
	"alt_text" varchar(500) DEFAULT '' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"publication_status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(140) NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"canonical_url" text,
	"og_image" uuid,
	"publication_status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(140) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"summary" text NOT NULL,
	"problem" text DEFAULT '' NOT NULL,
	"context" text DEFAULT '' NOT NULL,
	"solution" text DEFAULT '' NOT NULL,
	"role" varchar(240) DEFAULT '' NOT NULL,
	"responsibilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"architecture" text DEFAULT '' NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"maturity" varchar(32) DEFAULT 'Concept' NOT NULL,
	"visibility" varchar(16) DEFAULT 'PUBLIC' NOT NULL,
	"current_state" text DEFAULT '' NOT NULL,
	"outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"screenshots" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"repository_visibility" varchar(16) DEFAULT 'UNKNOWN' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"publication_status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(140) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"problem" text NOT NULL,
	"target_customer" text DEFAULT '' NOT NULL,
	"deliverables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"typical_engagement" text DEFAULT '' NOT NULL,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(160),
	"seo_description" varchar(320),
	"publication_status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(140) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL,
	"summary" text NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"publication_status" varchar(16) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "skills_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_revisions_version_uq" ON "content_revisions" USING btree ("entity_type","entity_id","version");--> statement-breakpoint
CREATE INDEX "content_revisions_entity_idx" ON "content_revisions" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "experience_public_order_idx" ON "experience" USING btree ("publication_status","sort_order");--> statement-breakpoint
CREATE INDEX "pages_public_order_idx" ON "pages" USING btree ("publication_status","slug");--> statement-breakpoint
CREATE INDEX "projects_public_order_idx" ON "projects" USING btree ("publication_status","sort_order");--> statement-breakpoint
CREATE INDEX "services_public_order_idx" ON "services" USING btree ("publication_status","sort_order");--> statement-breakpoint
CREATE INDEX "skills_public_order_idx" ON "skills" USING btree ("publication_status","sort_order");