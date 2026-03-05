-- Migrate project locations: AU states
UPDATE projects SET
  suburb = split_part(location, ', ', 1),
  state = split_part(location, ', ', 2),
  country = 'AU'
WHERE location IS NOT NULL
  AND location != ''
  AND split_part(location, ', ', 2) IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT');

-- Migrate project locations: Non-AU
UPDATE projects SET
  suburb = split_part(location, ', ', 1),
  state = '',
  country = split_part(location, ', ', 2)
WHERE location IS NOT NULL
  AND location != ''
  AND split_part(location, ', ', 2) NOT IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT');

-- Migrate company locations: AU states
UPDATE companies SET
  suburb = split_part(location, ', ', 1),
  state = split_part(location, ', ', 2),
  country = 'AU'
WHERE location IS NOT NULL
  AND location != ''
  AND split_part(location, ', ', 2) IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT');

-- Migrate company locations: Non-AU
UPDATE companies SET
  suburb = split_part(location, ', ', 1),
  state = '',
  country = split_part(location, ', ', 2)
WHERE location IS NOT NULL
  AND location != ''
  AND split_part(location, ', ', 2) NOT IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT');
