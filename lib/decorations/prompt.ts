/** Shared prompt for flat cartoon animal stickers. Animal name appears once (first line). */
export const DECORATION_PROMPT_VERSION = 5;

export const DECORATION_MODEL = "gemini-2.5-flash-image";

const PROMPT_BODY = `Flat cartoon sticker illustration for a wildlife encyclopedia website.

Subject: a friendly depiction of the animal named on the first line, full body, centered in frame, in a natural relaxed standing or walking pose — all limbs in normal resting positions, no waving or greeting gestures.

Art style: simple flat shapes, thick clean outlines, soft cel-shading, cute expressive face, child-friendly — like a modern children's book sticker.

Anatomy rules: draw the correct body plan for that exact species. Count every limb carefully before finishing — quadruped mammals and reptiles must have exactly four legs total, no more and no less. Birds: two legs and two wings only. Insects: six legs only. Fish: fins only, no legs. Dolphins and seals: two front flippers and a tail fluke, no hind legs. Use the correct limb type — paws, hooves, talons, flippers, or wings as that animal has in real life. Do not draw extra legs hidden behind the body, duplicated paws, or a third pair of limbs. Include or omit a tail only if that species normally has one. Ears, horns, tusks, trunk, antennae, gills, or scales only when that animal has them. Keep proportions species-typical even in a cute style. No merged limbs, no human hands or feet.

Color rules: use accurate, natural species colors for that animal only. Fur, feathers, skin, scales, paws, muzzle, ears, and markings must look biologically correct for the species. Do not tint limbs, torsos, or faces with unrelated hues. No neon, no rainbow, no arbitrary recoloring.

Background: completely transparent. No background fill, no gradient, no floor line, no drop shadow on a backdrop, no scenery, no border, no vignette. Output an isolated sticker cutout on alpha transparency.

Format: square 1:1 aspect ratio, three-quarter side view so all limbs are easy to count, character large with even padding, suitable as a website corner decoration.

Do not include: text, letters, numbers, watermark, logo, signature, extra animals, or busy props.`;

export function buildDecorationPrompt(animal: string): string {
  return `${animal.trim()}\n\n${PROMPT_BODY}`;
}
