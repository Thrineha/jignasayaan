Place real assets here:
- hero-reel.mp4  (cinematic homepage video, per WRD section 6)
- hero-poster.jpg (fallback poster frame for the hero video)
- handbook.pdf   (downloadable parent handbook, per WRD section 18)

journey/ -- The Journey section's scrolling "train window" filmstrip.
Currently filled with original hand-drawn vector illustrations (not
sourced from any photo, stock library, or existing artwork -- built from
scratch with basic SVG shapes, so there's no copyright question) depicting
the train itself in motion across each scene:
  - countryside-fields.svg   -- crossing green fields at midday
  - western-ghats-hills.svg  -- winding along a misty hillside embankment
  - sunset-sky.svg           -- backlit silhouette against a sunset, smoke trailing
  - kerala-backwaters.svg    -- crossing a causeway over water, with reflection
  - temple-silhouette.svg    -- night crossing past a temple, lit windows

These are a reasonable placeholder for launch, but real photography will
look better. Replace with real expedition photos or licensed stock images
(same filenames, .jpg/.png/.webp all work -- update the `src` extensions
in components/TrainWindowStrip.tsx to match). Landscape orientation,
roughly 4:3, works best with the window-frame crop.
