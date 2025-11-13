UPDATE "Setlist" SET "higawariLabel" = 'A' WHERE id = 26;

UPDATE "Setlist" SET "higawariLabel" = 'B' WHERE id = 27;

UPDATE "Setlist" SET "higawariLabel" = '밤' WHERE id IN (
  SELECT DISTINCT s.id
  FROM "Setlist" s
  JOIN "Concert" c ON c."setlistId" = s.id
  WHERE c."eventId" = 1 AND c.block = '밤'
);

UPDATE "Setlist" SET "higawariLabel" = '낮' WHERE id IN (
  SELECT DISTINCT s.id
  FROM "Setlist" s
  JOIN "Concert" c ON c."setlistId" = s.id
  WHERE c."eventId" = 1 AND c.block = '낮'
);
