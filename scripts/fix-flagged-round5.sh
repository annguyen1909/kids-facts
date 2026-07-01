#!/usr/bin/env bash
set -e
BASE="content/animals"
u() { [ -f "$1" ] && jq --arg k "$2" --arg v "$3" ".[$k] = \$v" "$1" > "$1.tmp" && mv "$1.tmp" "$1" && echo "✓ $2: $(basename $1)"; }

# flamingo-diet: Zoo de Madrid (captive) -> wild flamingo feeding
u "$BASE/flamingo/images/flamingo-diet.json" "src" \
  "https://upload.wikimedia.org/wikipedia/commons/f/f8/Phoenicopterus_ruber_in_flight_edit2.jpg"
u "$BASE/flamingo/images/flamingo-diet.json" "alt" \
  "Wild American flamingo wading and filter-feeding in a salt lake"
u "$BASE/flamingo/images/flamingo-diet.json" "caption" \
  "Flamingos feed by sweeping their bent bills upside-down through the water, filtering out algae and tiny crustaceans."

# giant-panda-closeup: captive -> wild giant panda
u "$BASE/giant-panda/images/giant-panda-closeup.json" "src" \
  "https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG"
u "$BASE/giant-panda/images/giant-panda-closeup.json" "alt" \
  "Close-up of a giant panda's face showing its distinctive black eye patches"
u "$BASE/giant-panda/images/giant-panda-closeup.json" "caption" \
  "The giant panda's distinctive black eye patches make it one of the most recognizable animals on Earth."

# gila-monster-core-range: captive -> wild gila monster
u "$BASE/gila-monster/images/gila-monster-core-range.json" "src" \
  "https://upload.wikimedia.org/wikipedia/commons/1/1d/Heloderma_suspectum_02.jpg"
u "$BASE/gila-monster/images/gila-monster-core-range.json" "alt" \
  "Wild Gila monster on rocky desert terrain in the American Southwest"
u "$BASE/gila-monster/images/gila-monster-core-range.json" "caption" \
  "Gila monsters inhabit deserts and scrublands of the southwestern United States and northwestern Mexico."
