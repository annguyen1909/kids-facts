#!/usr/bin/env bash
set -e
BASE="content/animals"

u() { [ -f "$1" ] && jq --arg k "$2" --arg v "$3" ".[$k] = \$v" "$1" > "$1.tmp" && mv "$1.tmp" "$1" && echo "✓ $2: $(basename $1)"; }

echo "=== Round 3: Final 6 fixes ==="

# gorilla-diet: Bristol Zoo Gardens -> wild gorilla eating
u "$BASE/gorilla/images/gorilla-diet.json" "src" "https://upload.wikimedia.org/wikipedia/commons/7/72/Gorilla_gorilla_gorilla01.jpg"
u "$BASE/gorilla/images/gorilla-diet.json" "alt" "Wild western lowland gorilla feeding on plants in a rainforest clearing"
u "$BASE/gorilla/images/gorilla-diet.json" "caption" "Gorillas are herbivores, spending much of their day foraging for leaves, fruit, and stems."

# great-white-shark-core-range: cage diving photo -> wild shark
u "$BASE/great-white-shark/images/great-white-shark-core-range.json" "src" "https://upload.wikimedia.org/wikipedia/commons/0/0e/Carcharodon_carcharias.jpg"
u "$BASE/great-white-shark/images/great-white-shark-core-range.json" "alt" "Great white shark swimming freely in the open ocean near Isla Guadalupe, Mexico"
u "$BASE/great-white-shark/images/great-white-shark-core-range.json" "caption" "Great white sharks range across temperate coastal oceans worldwide, from South Africa to California."

# iguana-baby: Morikami Museum garden iguana -> clearly wild iguana
u "$BASE/iguana/images/iguana-baby.json" "src" "https://upload.wikimedia.org/wikipedia/commons/4/4d/Green_iguana_juvenile.jpg"
u "$BASE/iguana/images/iguana-baby.json" "alt" "A young green iguana perching on a branch in tropical forest"
u "$BASE/iguana/images/iguana-baby.json" "caption" "Juvenile iguanas hatch from eggs and are independent from birth, scrambling into trees to avoid predators."

# tokay-gecko-baby: captive hand-held -> wild tokay
u "$BASE/tokay-gecko/images/tokay-gecko-baby.json" "src" "https://upload.wikimedia.org/wikipedia/commons/a/ab/Tokay_gecko_%28Gekko_gecko%29.jpg"
u "$BASE/tokay-gecko/images/tokay-gecko-baby.json" "alt" "A young tokay gecko on a tree bark at night in Southeast Asia"
u "$BASE/tokay-gecko/images/tokay-gecko-baby.json" "caption" "Baby tokay geckos emerge at night, hunting insects with their large lidless eyes."

# tokay-gecko-diet: captive gecko -> wild tokay feeding
u "$BASE/tokay-gecko/images/tokay-gecko-diet.json" "src" "https://upload.wikimedia.org/wikipedia/commons/8/8c/Gekko_gecko_in_Taman_Negara.jpg"
u "$BASE/tokay-gecko/images/tokay-gecko-diet.json" "alt" "Wild tokay gecko on a tree trunk in tropical rainforest"
u "$BASE/tokay-gecko/images/tokay-gecko-diet.json" "caption" "Tokay geckos are voracious predators, eating insects, small lizards, and sometimes small mice."

# manta-ray-baby: Okinawa Churaumi Aquarium -> wild manta ray
u "$BASE/manta-ray/images/manta-ray-baby.json" "src" "https://upload.wikimedia.org/wikipedia/commons/2/22/Manta_birostris-komodo.jpg"
u "$BASE/manta-ray/images/manta-ray-baby.json" "alt" "Young oceanic manta ray gliding through open water near Komodo, Indonesia"
u "$BASE/manta-ray/images/manta-ray-baby.json" "caption" "Manta ray pups are born as fully formed miniature mantas and immediately swim independently."

echo ""
echo "=== Round 3 Done! ==="
