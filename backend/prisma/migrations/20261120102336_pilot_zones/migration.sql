-- Pilot zone: neighbourhoods of Toulouse open at launch (reference data, needed in every environment)
INSERT INTO "zones" ("name", "city") VALUES
  ('Saint-Michel', 'Toulouse'),
  ('Saint-Cyprien', 'Toulouse'),
  ('Les Carmes', 'Toulouse'),
  ('Saint-Aubin', 'Toulouse'),
  ('Compans-Caffarelli', 'Toulouse')
ON CONFLICT ("name", "city") DO NOTHING;
