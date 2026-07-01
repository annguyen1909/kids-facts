#!/usr/bin/env bash
# Fix round 2: stale alt/caption texts + new genuinely captive images
set -e

BASE="content/animals"

update_src() {
  local file="$1"
  local new_src="$2"
  [ -f "$file" ] && jq --arg v "$new_src" '.src = $v' "$file" > "$file.tmp" && mv "$file.tmp" "$file" && echo "✓ src: $file"
}

update_alt() {
  local file="$1"
  local new_alt="$2"
  [ -f "$file" ] && jq --arg v "$new_alt" '.alt = $v' "$file" > "$file.tmp" && mv "$file.tmp" "$file" && echo "✓ alt: $file"
}

update_caption() {
  local file="$1"
  local new_cap="$2"
  [ -f "$file" ] && jq --arg v "$new_cap" '.caption = $v' "$file" > "$file.tmp" && mv "$file.tmp" "$file" && echo "✓ caption: $file"
}

echo "=== Round 2: Fix stale alt/caption texts ==="

# Great White Shark baby: alt still says "aquarium"
update_alt "$BASE/great-white-shark/images/great-white-shark-baby.json" \
  "Young great white shark swimming in the open ocean"

# Salmon core-baby: alt/caption still say "hatchery tank"
update_alt "$BASE/salmon/images/salmon-core-baby.json" \
  "Young Atlantic salmon swimming upstream in a river"
update_caption "$BASE/salmon/images/salmon-core-baby.json" \
  "Young salmon, called fry, must navigate rivers and survive predators before reaching the ocean."

# Seahorse core-range: alt says "aquarium", caption says "collection for aquariums"
update_alt "$BASE/seahorse/images/seahorse-core-range.json" \
  "Pacific seahorse clinging to coral in the wild ocean"
update_caption "$BASE/seahorse/images/seahorse-core-range.json" \
  "Seahorses use their prehensile tails to anchor themselves to coral and seagrass in the wild."

# Snake core-range: caption says "pet trade"
update_caption "$BASE/snake/images/snake-core-range.json" \
  "Ball pythons are found across West Africa, from Senegal to Uganda."

# Parrot core-range: caption says "pet trade"
update_caption "$BASE/parrot/images/parrot-core-range.json" \
  "The scarlet macaw's vivid plumage makes it one of the most recognizable birds in Central and South America."

echo ""
echo "=== Round 2: Fix genuinely captive images ==="

# ---- Angelfish ----
update_src "$BASE/angelfish/images/angelfish-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/e/e5/Emperor_angelfish_%28Pomacanthus_imperator%29_Ari_Atoll.jpg"
update_alt "$BASE/angelfish/images/angelfish-core-range.json" \
  "Emperor angelfish swimming over a coral reef in the Indian Ocean"
update_caption "$BASE/angelfish/images/angelfish-core-range.json" \
  "Emperor angelfish are found throughout the Indo-Pacific, from the Red Sea to Hawaii."

# ---- Chameleon (4 images) ----
# baby: Washington DC Zoo -> wild veiled chameleon
update_src "$BASE/chameleon/images/chameleon-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chameleon_baby_wild.jpg"
update_alt "$BASE/chameleon/images/chameleon-baby.json" \
  "A tiny baby chameleon perching on a branch in its natural habitat"
update_caption "$BASE/chameleon/images/chameleon-baby.json" \
  "Baby chameleons hatch fully independent and immediately begin hunting small insects."

# core-family: Berlin Aquarium Zoo -> wild chameleons
update_src "$BASE/chameleon/images/chameleon-core-family.json" \
  "https://upload.wikimedia.org/wikipedia/commons/4/4c/Camaleone_pantera_-_Furcifer_pardalis.jpg"
update_alt "$BASE/chameleon/images/chameleon-core-family.json" \
  "A pair of panther chameleons on a branch in Madagascar's rainforest"
update_caption "$BASE/chameleon/images/chameleon-core-family.json" \
  "Chameleons are mostly solitary but meet briefly during mating season."

# core-range: flagged for "pet" -> use specific wild photo
update_src "$BASE/chameleon/images/chameleon-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/c/c6/Chamaeleo_chamaeleon_male.jpg"
update_alt "$BASE/chameleon/images/chameleon-core-range.json" \
  "A wild Mediterranean chameleon on a branch, showing its range across Europe and Africa"
update_caption "$BASE/chameleon/images/chameleon-core-range.json" \
  "The common chameleon ranges from southern Spain and the Canary Islands across North Africa to the Middle East."

# habitat: Berlin Zoo -> wild chameleon in natural habitat
update_src "$BASE/chameleon/images/chameleon-habitat.json" \
  "https://upload.wikimedia.org/wikipedia/commons/b/b9/Furcifer_pardalis_edit2.jpg"
update_alt "$BASE/chameleon/images/chameleon-habitat.json" \
  "A panther chameleon in the wild rainforest of Madagascar"
update_caption "$BASE/chameleon/images/chameleon-habitat.json" \
  "Chameleons thrive in tropical forests and bushlands, where they blend into leafy surroundings."

# ---- Cheetah (2 images) ----
# closeup: Australia Zoo -> wild cheetah closeup
update_src "$BASE/cheetah/images/cheetah-closeup.json" \
  "https://upload.wikimedia.org/wikipedia/commons/f/ff/Cheetah_closeup.jpg"
update_alt "$BASE/cheetah/images/cheetah-closeup.json" \
  "Close-up of a wild cheetah's face showing distinctive black tear stripes"
update_caption "$BASE/cheetah/images/cheetah-closeup.json" \
  "The cheetah's tear stripes reduce glare from the sun, helping it spot prey across open grasslands."

# core-closeup: Whipsnade Zoo -> wild cheetah
update_src "$BASE/cheetah/images/cheetah-core-closeup.json" \
  "https://upload.wikimedia.org/wikipedia/commons/6/67/Cheetah_%28Acinonyx_jubatus%29_female_2_%28cropped%29.jpg"
update_alt "$BASE/cheetah/images/cheetah-core-closeup.json" \
  "Wild cheetah in the African savanna showing spotted coat"
update_caption "$BASE/cheetah/images/cheetah-core-closeup.json" \
  "Each cheetah's spot pattern is unique, similar to a human fingerprint."

# ---- Flamingo ----
# size: MHNT.ZOO -> wild flamingo
update_src "$BASE/flamingo/images/flamingo-size.json" \
  "https://upload.wikimedia.org/wikipedia/commons/9/9e/Flamingos_Laguna_Colorada.jpg"
update_alt "$BASE/flamingo/images/flamingo-size.json" \
  "Wild flamingos standing in a lake, showing their full height"
update_caption "$BASE/flamingo/images/flamingo-size.json" \
  "Flamingos can stand up to 1.4 metres tall and use their long legs to wade in shallow salt lakes."

# ---- Giraffe ----
# core-diet: Buffalo Zoo -> wild giraffe feeding in nature
update_src "$BASE/giraffe/images/giraffe-core-diet.json" \
  "https://upload.wikimedia.org/wikipedia/commons/7/75/Giraffa_camelopardalis_reticulata_%28Laikipia%2C_Kenya%29.jpg"
update_alt "$BASE/giraffe/images/giraffe-core-diet.json" \
  "Wild reticulated giraffe stretching its long neck to feed on acacia leaves in Kenya"
update_caption "$BASE/giraffe/images/giraffe-core-diet.json" \
  "Giraffes spend up to 16 hours a day feeding, using their long tongues to strip leaves from thorny acacias."

# ---- Gorilla ----
# baby: SF Zoo -> wild gorilla mother and infant
update_src "$BASE/gorilla/images/gorilla-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/4/46/Western_Lowland_Gorilla_%28Gorilla_gorilla_gorilla%29_mother_%26_infant.jpg"
update_alt "$BASE/gorilla/images/gorilla-baby.json" \
  "Wild western lowland gorilla mother carrying her baby in the rainforest"
update_caption "$BASE/gorilla/images/gorilla-baby.json" \
  "Gorilla mothers carry their infants for the first few months and nurse them for up to 3 years."

echo ""
echo "=== Round 2 Done! ==="
