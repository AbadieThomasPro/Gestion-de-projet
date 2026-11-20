CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	CONSTRAINT "zones_name_city_unique" UNIQUE("name","city")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "zone_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_zone_id_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE restrict ON UPDATE no action;