-- Insert sample data into waste_collections
-- This will populate your trends chart

INSERT INTO waste_collections (date, metal, plastic, paper, mixed_waste) VALUES
  (CURRENT_DATE - INTERVAL '6 days', 120, 200, 150, 100),
  (CURRENT_DATE - INTERVAL '5 days', 130, 210, 140, 90),
  (CURRENT_DATE - INTERVAL '4 days', 140, 220, 160, 110),
  (CURRENT_DATE - INTERVAL '3 days', 125, 190, 155, 95),
  (CURRENT_DATE - INTERVAL '2 days', 135, 230, 145, 105),
  (CURRENT_DATE - INTERVAL '1 day', 150, 240, 170, 120),
  (CURRENT_DATE, 160, 250, 180, 130);
