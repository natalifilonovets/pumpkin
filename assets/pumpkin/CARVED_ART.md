# Quiz lantern artwork

Generated with the built-in imagegen tool. Transparent 1254 × 1254 PNG assets:
- `carved-dark.png`: dark hollow interior and unlit candle.
- `carved-lit.png`: matching illuminated lighting plate.

The original `base.png` remains the editable pumpkin-making asset. The quiz uses the rendered carvings directly, without geometric face overlays. Lighting plates crossfade with solved questions; a feathered patch reveals the flame on the first correct answer. Reduced-motion preferences disable continuous flicker.

## Dark asset prompt

Use case: stylized-concept. Production game asset for a magical family-movie Halloween workshop. Create one exquisite carved jack-o-lantern pumpkin, full object isolated on genuinely transparent background, centered square composition with 8 percent clear margin, entire curved woody stem and bottom visible. Frontal view slightly from above, wide squat orange pumpkin with rich textured ribs, charming asymmetrical handcrafted slightly curved triangular eyes, small handcut nose and broad crooked friendly toothy grin. CRITICAL: holes are genuinely deep hollow cutouts with thick 3D pumpkin flesh bevels, irregular knife-cut walls, fibrous golden flesh, occlusion shadows, perspective thickness. Not flat icons or graphics pasted on a pumpkin. A candle is nestled inside visible through the broad mouth, but UNLIT: dark wick, no flame, dark brown hollow cavity. External warm workshop key light from upper left and soft plum rim light; warmly illuminated outer skin but inside dark. Rich physically rendered polished stylized 3D family animated movie aesthetic, cinematic, tactile, lovingly handmade. No background scenery, no table, no text, no extra pumpkin, no flat vector shapes. Keep all openings large enough to later animate inner candle glow.

## Illuminated edit prompt

Edit this exact production game asset. Preserve the exact pumpkin silhouette, framing, size, stem, ribs, skin texture, expression, eye/nose/mouth opening boundaries, carved wall geometry and candle position. Change ONLY internal lighting: light the candle wick with a beautifully rendered small golden flame, and illuminate the hollow interior richly with warm amber orange candlelight, cream gold brightest near candle. Translucent golden thick carved flesh edges, deep occlusion shadows retained, delicate warm transmitted light on adjacent skin. Keep dimensional fibrous knife-cut walls. Outer pumpkin lighting should remain nearly identical so this can crossfade over the original precisely. Transparent background preserved. No other elements or text. Rendered polished cinematic family-movie Halloween aesthetic, not vector graphics.


## Six quiz expressions

`faces-atlas.png` is the final built-in imagegen artwork: three columns and four rows, with six dark expressions in the upper two rows and matching lit expressions in the lower two. The quiz selects an expression when each question appears. Correct answers illuminate that same face; the expression changes only on advancing to the next question. Wrong answers preserve the expression and light. `faces-dark.png` is the generation reference.

Final atlas edit prompt:

Production sprite atlas editing. Output MUST have real alpha transparency: REMOVE all brown, orange and purple backdrop outside pumpkin silhouettes, no colored rectangular panels, no shadows outside pumpkins. Arrange EXACTLY THREE columns and FOUR rows of equal square cells in a 3:4 portrait canvas. Rows 1 and 2: the six exact pumpkins from the input, dark hollow interior and unlit candle preserved. Rows 3 and 4: EXACT duplicates of rows 1 and 2 respectively in the exact same scale/cell coordinates, but candles lit with small rendered golden flames and warm amber light illuminating hollow carved face, thick fibrous walls and edges. Preserve exact expression, geometry, silhouette, stem and texture of each counterpart. Six expressions: grin, round surprised, wink, crescent laughing, friendly zigzag spooky, star-eyed grin. Put all pumpkins fully within cells with 5 percent transparent margin. Same exact cell-relative position for each dark/lit pair. In every cell wick center is at 50% horizontal and about 73% vertical. No labels, grid borders, background colors, scenery, text or extra objects. High quality polished family-animation cinematic render; genuine carved depth. Actual transparent background essential for compositing in existing workshop.


Rendering correction: runtime now draws only one dark atlas cell per frame. It derives an amber lighting mask directly from that cell's cavity pixels, then animates a candle flame at the wick. Independently generated dark/lit plates are no longer blended in the quiz, avoiding misregistered contours and doubled features.
