# Artisan carving assets

Three imagegen raster atlases supply all 14 designs. Left column: unlit cavities; right column: authored candlelit interiors. Both states preserve textured pumpkin flesh, inner walls and self-shadowing. The renderer draws one lighting state at a time; it does not crossfade mismatched plates.

The existing pumpkin body and workshop image are unchanged. 5 eye pairs × 4 noses × 5 mouths = 100 combinations. Selection, keyboard arrows/Home/End, randomize, reset, edit, saving and mission progression retain their original flow. New nose slots follow the requested triangle / crooked / rounded / heart order.

`manifest.json` records source dimensions, manually inspected row boundaries and destination placement. `PROMPTS.json` records generation prompts. The nose generator retained a coloured matte despite transparency requests, so the renderer clips the textured raster to traced silhouettes; those masks draw no solid face shapes and require no canvas pixel reads, including under file://. Eyes and mouths have native alpha. Asset failures disable LIGHT IT UP rather than substituting vector icons.

Selector canvases show individual authored features on parchment patterns in wooden trays. Transfer and carving-reveal animations respect reduced-motion preferences. LIGHT IT UP uses the authored emissive plates with subtle exposure flicker.

Full-resolution 1200px assembly previews are in ../../output/. The previews were composed with macOS CoreGraphics using the same source crops, masks and placement as the browser renderer and inspected visually. They verify the assembled raster art, rather than browser layout. Browser visual review was unavailable. JavaScriptCore smoke tests covered all 100 combinations in both lighting states, loading gates, selection, light/edit/randomize/reset and the existing six-question flow.


## Free placement

Drag any stencil onto the pumpkin, then drag the placed carving to move it. Its right handle changes width, its bottom handle changes height, and its corner changes both independently. Touch and pen use Pointer Events; keyboard arrows move, Alt+arrows resize, and Shift increases the step. Positions use logical canvas coordinates, persist with progress, and are used by lit presentation and PNG export. Reset restores default sizes and positions. Dropping a stencil outside the pumpkin cancels the change.
