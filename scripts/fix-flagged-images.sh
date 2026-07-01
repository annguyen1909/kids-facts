#!/usr/bin/env bash
# Fix all flagged images by replacing src URLs with wild Wikimedia Commons photos
set -e

BASE="content/animals"

update_src() {
  local file="$1"
  local new_src="$2"
  if [ -f "$file" ]; then
    jq --arg src "$new_src" '.src = $src' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    echo "✓ Updated: $file"
  else
    echo "✗ Not found: $file"
  fi
}

echo "=== Fixing Flagged Images ==="

# ---------- Great White Shark ----------
# baby: aquarium photo -> wild shark off Guadalupe Island
update_src "$BASE/great-white-shark/images/great-white-shark-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg"

# size: shark cage diving -> wild great white
update_src "$BASE/great-white-shark/images/great-white-shark-size.json" \
  "https://upload.wikimedia.org/wikipedia/commons/0/0e/Carcharodon_carcharias.jpg"

# ---------- Hippopotamus ----------
# core-range: Whipsnade Zoo -> wild hippo in Ngorongoro Crater
update_src "$BASE/hippopotamus/images/hippopotamus-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Hippo_at_Ngorongoro.jpg"

# ---------- Kangaroo ----------
# size: Zoo Aquarium Madrid -> wild eastern grey kangaroo
update_src "$BASE/kangaroo/images/kangaroo-size.json" \
  "https://upload.wikimedia.org/wikipedia/commons/e/e2/Kangaroo_and_joey03.jpg"

# ---------- Kingfisher ----------
# core-family: MHNT.ZOO specimen -> wild kingfisher in Italy
update_src "$BASE/kingfisher/images/kingfisher-core-family.json" \
  "https://upload.wikimedia.org/wikipedia/commons/1/1f/Alcedo_atthis_-_Riserva_naturale_regionale_del_Lago_di_Penne.jpg"

# ---------- Meerkat ----------
# fun-fact: Zoo Praha -> wild meerkat in Tswalu Kalahari
update_src "$BASE/meerkat/images/meerkat-fun-fact.json" \
  "https://upload.wikimedia.org/wikipedia/commons/f/ff/Meerkat_%28Suricata_suricatta%29_Tswalu.jpg"

# ---------- Ostrich ----------
# hero: Whipsnade Zoo -> wild ostrich in Etosha
update_src "$BASE/ostrich/images/ostrich-hero.json" \
  "https://upload.wikimedia.org/wikipedia/commons/d/d3/Ostrich_at_Etosha.jpg"

# size: MHNT.ZOO -> wild male ostrich in Masai Mara
update_src "$BASE/ostrich/images/ostrich-size.json" \
  "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ostrich_1_-_Etosha_2014.jpg"

# ---------- Parrot (Scarlet Macaw) ----------
# baby: Henry Doorly Zoo -> wild scarlet macaw
update_src "$BASE/parrot/images/parrot-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/4/4f/Ara_macao_-Laguna_del_Lagarto_Lodge%2C_Boca_Tapada%2C_Costa_Rica-8.jpg"

# core-baby: Zoo Muenster -> wild scarlet macaw
update_src "$BASE/parrot/images/parrot-core-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/7/7e/Scarlet-Macaw.jpg"

# core-range: Phoenix Zoo -> wild macaw in Costa Rica
update_src "$BASE/parrot/images/parrot-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/8/87/Ara_macao_-Costa_Rica-8.jpg"

# ---------- Peacock ----------
# core-diet: MHNT.ZOO -> wild peacock feeding
update_src "$BASE/peacock/images/peacock-core-diet.json" \
  "https://upload.wikimedia.org/wikipedia/commons/a/a5/Pavo_cristatus_male.jpg"

# ---------- Puffin ----------
# core-range: MHNT.ZOO -> wild Atlantic puffin on Staffa
update_src "$BASE/puffin/images/puffin-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Puffin_Latrabjarg_1.jpg"

# ---------- Salmon ----------
# core-baby: hatchery/tank -> wild Atlantic salmon
update_src "$BASE/salmon/images/salmon-core-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/6/6f/Atlantic_Salmon.jpg"

# ---------- Seahorse ----------
# core-range: New England Aquarium -> wild seahorse
update_src "$BASE/seahorse/images/seahorse-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/d/d5/Seahorse_tasman.jpg"

# ---------- Snake (Ball Python) ----------
# core-baby: Antalya Aquarium -> wild ball python
update_src "$BASE/snake/images/snake-core-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/4/45/Python_regius_02.jpg"

# core-family: same Antalya Aquarium -> wild ball python
update_src "$BASE/snake/images/snake-core-family.json" \
  "https://upload.wikimedia.org/wikipedia/commons/4/49/Python_regius_jonge.jpg"

# core-range: pet photo -> wild ball python in Burkina Faso
update_src "$BASE/snake/images/snake-core-range.json" \
  "https://upload.wikimedia.org/wikipedia/commons/9/97/Python-Regius-Burkina.jpg"

# habitat: Bronx Zoo -> wild python in Togo
update_src "$BASE/snake/images/snake-habitat.json" \
  "https://upload.wikimedia.org/wikipedia/commons/3/30/Python_regius_in_Togo.jpg"

# ---------- Snake (continued) ----------
# ---------- Tiger ----------
# baby: Pittsburgh Zoo cub -> wild tiger cub
update_src "$BASE/tiger/images/tiger-baby.json" \
  "https://upload.wikimedia.org/wikipedia/commons/2/2b/WildTigerAtRanthambore.jpg"

# fun-fact: Leipzig Zoo -> wild Bengal tiger
update_src "$BASE/tiger/images/tiger-fun-fact.json" \
  "https://upload.wikimedia.org/wikipedia/commons/b/be/Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg"

echo ""
echo "=== Done! ==="
echo "Run 'npm run content:audit-images-suitability' to verify"
