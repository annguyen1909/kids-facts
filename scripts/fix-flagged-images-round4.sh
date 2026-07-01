#!/usr/bin/env bash
set -e
BASE="content/animals"
u() { [ -f "$1" ] && jq --arg k "$2" --arg v "$3" ".[$k] = \$v" "$1" > "$1.tmp" && mv "$1.tmp" "$1" && echo "✓ $2: $(basename $1)"; }

echo "=== Round 4: Last 3 fixes ==="

# crocodile-baby: Rancho Texas Park (captive) -> wild Nile crocodile hatchling
u "$BASE/crocodile/images/crocodile-baby.json" "src" \
  "https://upload.wikimedia.org/wikipedia/commons/e/ef/Baby_Mugger_Crocodile_%28Crocodylus_palustris%29_Hatching.jpg"
u "$BASE/crocodile/images/crocodile-baby.json" "alt" \
  "A baby crocodile hatching from its egg in the wild"
u "$BASE/crocodile/images/crocodile-baby.json" "caption" \
  "Baby crocodiles call out from inside their eggs, and the mother carefully carries hatchlings to water in her jaws."

# dragonfly-diet: MHNT museum exuvia -> wild dragonfly eating prey
u "$BASE/dragonfly/images/dragonfly-diet.json" "src" \
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/Dragonfly_eating_a_bee.jpg"
u "$BASE/dragonfly/images/dragonfly-diet.json" "alt" \
  "A wild dragonfly eating an insect it caught mid-air"
u "$BASE/dragonfly/images/dragonfly-diet.json" "caption" \
  "Dragonflies are among the most successful predators in the insect world, catching up to 95% of the prey they pursue."

# leafcutter-ant-family: Wilhelma Zoo -> wild leafcutter ant colony
u "$BASE/leafcutter-ant/images/leafcutter-ant-family.json" "src" \
  "https://upload.wikimedia.org/wikipedia/commons/7/7a/Ants_carrying_leaves.jpg"
u "$BASE/leafcutter-ant/images/leafcutter-ant-family.json" "alt" \
  "Wild leafcutter ants carrying leaf fragments along a rainforest trail"
u "$BASE/leafcutter-ant/images/leafcutter-ant-family.json" "caption" \
  "Leafcutter ant colonies can contain millions of workers, each carrying leaf pieces up to 50 times their own body weight."

echo ""
echo "=== Round 4 Done! Running final audit ==="
