# Shop brand campaign imagery — 2026-08-30

Created with the built-in Codex ImageGen tool in the logged-in session. These are original conceptual campaign images, not official brand photography or exact product representations. No paid external generation provider was used.

## Assets

- Judy Blue: `judy-blue-denim-sculpture-v1.png`
- Zenana: `zenana-soft-sculpture-v2.png` (v1 is retained as the original draft)
- Both outputs are 1254 × 1254 PNGs; the prompt requested 2048 × 2048, but these are the actual returned dimensions. Next Image supplies responsive optimized versions to the Shop cards.
- Consumed by `app/shop/components/GlobalShopExperience.tsx`. Original generated files remain preserved in the Codex generated-images directory.

## Verification

- Live port `3001` was confirmed to serve this checkout. Both original remote product images have been replaced in the exact Judy Blue and Zenana Shop cards.
- Desktop and `390 × 844` mobile layouts were visually inspected. Removed the opaque black overlay, preserved the full clothing subjects, and corrected Zenana's framing to prevent the heading from covering a model on mobile.
- Both Explore brand buttons were clicked and reached `/shop/brand/judy-blue` and `/shop/brand/zenana` respectively.
- Full TypeScript, scoped ESLint, and `git diff --check` passed; the browser error log was empty. Existing menu and saved-bag behavior were not modified.
- Final rendered screenshot: `/Users/arashsn/.codex/visualizations/2026/08/30/01a05316-ebb8-7c02-acc9-13c118311997/shop-brand-campaigns-desktop-final.jpg`.

## Reference direction

The user's [denim Pinterest reference](https://www.pinterest.com/pin/1146025436449556267/) and attached screenshot provided the primary direction: monumental garment scale, tactile fabric, clean studio staging, and fashion-editorial composition. The pin page did not load through the web tool; the provided screenshot was inspected directly and supplied as an image-generation reference.

Additional Pinterest searches surfaced [surreal shoe editorial](https://www.pinterest.com/pin/1618549856030219/) and [minimal knitwear editorial](https://kr.pinterest.com/pin/225531893826472192/). These are inspiration references, not evidence of awards. No award-winning claim is made.

## Final prompt — Judy Blue

Use case: ads-marketing. Create one original photorealistic fashion campaign image for the Judy Blue denim brand section of a fashion website. The supplied image is ONLY an art-direction reference for extraordinary scale, tactile blue denim, clean studio staging and editorial confidence; do not reproduce its logo, typography, model identity, or actual scene. Output a single square 2048 x 2048 image, no text, no logos, no watermarks, no webpage UI. Scene: a cool pale steel-blue seamless studio and softly reflective floor. An enormous rolled blue-jean cuff and flowing denim leg form one dramatic sculptural arch, with visible authentic twill weave, indigo fading, and golden double stitching, monumentally larger than the models. Two adult women with different body types, one curvy woman and one medium-build woman, wear beautifully fitting classic high-rise blue jeans and simple ivory cotton tops; full bodies, natural human anatomy, effortless fashion poses, one lightly leaning against the huge denim sculpture and one standing alongside. The jeans, their fit, and the giant denim form are unmistakably the heroes. Photorealistic magazine campaign, directional softbox lighting, refined tactile detail, confident and calm, subtle silver-blue reflections, no distracting props. Composition must work inside a responsive square/portrait website card: keep all faces, both models, and the recognizable main denim sculpture inside the central 70% width and upper 72% of the frame. Lower 28% is mostly uninterrupted softly shadowed studio floor with subdued blue tones for a white website heading that will be added in code. Do not put any writing or typography in the generated image. This is conceptual campaign imagery, not a product catalogue photograph.

## Base prompt — Zenana

Use case: ads-marketing. Create one original photorealistic fashion campaign image for the Zenana everyday-comfort brand section of a fashion website, a sophisticated sister image to a blue denim campaign. The supplied image is ONLY a visual reference for extraordinary scale, tactile fashion materials, clean seamless studio and editorial confidence. Translate that surreal material-scale idea into soft everyday clothing; do not copy its model, boot, logo, or typography. Output one square 2048 x 2048 image with no text, no logos, no watermark, no UI. Scene: a warm sand and oat-beige seamless photo studio, soft low-gloss floor. One enormous cream French-terry sweatshirt sleeve, thick ribbed cuff and draped fabric form a flowing sculptural loop, like a monumental cocoon-shaped lounge seat. An adult woman with natural skin texture and dark hair wears a refined, relaxed oatmeal crewneck sweatshirt with matching fluid wide-leg lounge trousers and simple tonal flats, sitting comfortably on the lower curve of the oversized cuff, one leg extended naturally, relaxed confident posture. Another adult woman with a different body type stands next to the sculptural fabric in an ivory relaxed cardigan over a taupe tank and soft full-length pants. Focus on approachable beautiful comfort, elegant everyday silhouettes, tactile cotton knit and ribbing, realistic hands and garment seams. Luxury editorial campaign photography, natural warm directional light, delicate shadows, accurate anatomy, cohesive beige/cream/taupe palette, no denim, no shoes as props, no furniture besides the garment sculpture. Keep faces, both models and the recognizable sculptural cuff inside central 70% width and upper 72% of frame. Lower 28% mostly calm, softly shadowed warm beige floor, suitable for a website heading added in code. Absolutely no typography or branding baked into the image. Conceptual campaign imagery, not an individual catalogue product photograph.

## Final framing edit — Zenana v2

Edit this exact Zenana campaign image only to improve framing and copy-safe space. Keep the same two adult women, faces, clothing, their exact comfortable poses, giant cream ribbed cuff sculpture, warm neutral colors, photographic lighting, realistic texture, and square canvas. Pull the camera back slightly and shift the entire group upward, so both women's whole bodies INCLUDING ALL SHOES and the entire main sculptural cuff are contained within the TOP 64% of the square image and central 70% width. The BOTTOM 36% must be completely empty continuous softly lit warm beige studio floor, with subtle natural shadow fading into the floor. This is essential because responsive website headings are placed over the bottom third. No bodies, limbs, shoes, or objects in the bottom 36%. Preserve photographic detail and art direction; change only overall scale/framing and extend the real floor. No added text, logo, graphics, or watermark.
