#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const animalsRoot = path.join(root, "content", "animals");
const timestamp = "2026-06-23T00:00:00.000Z";

const galleryKinds = [
  "hero",
  "habitat",
  "diet",
  "baby",
  "family",
  "range",
  "size",
  "closeup",
  "fun-fact",
];

const coreKinds = ["habitat", "diet", "family", "baby", "closeup", "range"];

const animals = [
  {
    slug: "great-white-shark",
    name: "Great White Shark",
    commonNames: ["Great white shark", "White shark"],
    scientificName: "Carcharodon carcharias",
    summary:
      "Great white sharks are huge ocean fish with strong jaws, sharp teeth, and excellent senses. They swim through coastal and offshore seas, hunt marine animals, and are among the best-known sharks in the world.",
    heroTitle: "Great White Shark Facts",
    metaTitle: "Great White Shark Facts | Habitat, Diet, Teeth & Photos",
    metaDescription:
      "Discover great white shark facts with photos, ocean habitat, diet, pups, senses, and conservation. Learn where great white sharks live and how they hunt in the sea.",
    searchIntents: [
      "great white shark facts",
      "where do great white sharks live",
      "what do great white sharks eat",
      "how big is a great white shark",
      "are great white sharks endangered",
      "how many teeth does a great white shark have",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Chondrichthyes",
      order: "Lamniformes",
      family: "Lamnidae",
      genus: "Carcharodon",
      species: "C. carcharias",
    },
    classificationLabels: ["fish", "carnivore", "large"],
    habitats: ["ocean", "coast", "open sea"],
    continents: ["Worldwide"],
    countries: ["United States", "South Africa", "Australia", "Mexico", "New Zealand"],
    biomes: ["marine"],
    dietType: "Carnivore",
    dietItems: ["fish", "seals", "sea lions", "rays", "smaller sharks"],
    lifespan: {
      wild: "40 to 70 years",
    },
    size: {
      lengthMin: "11 feet",
      lengthMax: "20 feet",
    },
    weight: {
      min: "1,500 pounds",
      max: "5,000 pounds",
    },
    speed: "Up to 35 mph in bursts",
    conservationStatus: "Vulnerable",
    populationTrend: "Decreasing",
    behaviors: [
      "ocean cruising",
      "ambush hunting",
      "surface investigating",
      "seasonal movement",
      "wide-ranging travel",
    ],
    adaptations: [
      "rows of sharp teeth",
      "strong sense of smell",
      "electroreception",
      "streamlined body",
      "powerful tail",
    ],
    predators: ["larger orcas", "humans"],
    prey: ["fish", "seals", "sea lions", "rays"],
    reproduction: {
      offspringName: "pup",
      gestationOrIncubation: "Probably about 12 months",
      offspringCount: "2 to 10 pups",
    },
    funFacts: [
      "Great white sharks can replace lost teeth again and again.",
      "They can sense tiny electrical signals made by other animals.",
      "A great white shark is a fish, not a mammal.",
      "Young great whites usually eat more fish than adults do.",
      "Great white sharks can travel long distances across the ocean.",
      "Their dark top and pale belly help them blend into ocean water.",
    ],
    faq: [
      {
        question: "What is a great white shark?",
        answer:
          "A great white shark is a large ocean fish with a strong body, rows of sharp teeth, and excellent senses for hunting.",
      },
      {
        question: "Where do great white sharks live?",
        answer:
          "Great white sharks live in coastal and offshore oceans around the world, especially in temperate seas.",
      },
      {
        question: "What do great white sharks eat?",
        answer:
          "They are carnivores that eat fish, rays, seals, sea lions, and other marine animals.",
      },
      {
        question: "Are great white sharks fish or mammals?",
        answer:
          "They are fish. Great white sharks breathe through gills and do not feed milk to their young.",
      },
      {
        question: "How big is a great white shark?",
        answer:
          "Adults can grow to about 11 to 20 feet long, and some weigh several thousand pounds.",
      },
      {
        question: "What is a baby great white shark called?",
        answer:
          "A baby great white shark is called a pup. Pups can swim and hunt on their own soon after birth.",
      },
      {
        question: "Are great white sharks endangered?",
        answer:
          "Great white sharks are listed as Vulnerable, so they need protection from overfishing and accidental capture.",
      },
      {
        question: "How do great white sharks find prey?",
        answer:
          "They use smell, hearing, eyesight, and special sensors that can detect electrical signals from nearby animals.",
      },
    ],
    relatedAnimals: ["orca", "bottlenose-dolphin", "otter"],
    comparisonCandidates: ["orca"],
    coreMdx: `## What is a great white shark?

A great white shark is a huge **ocean fish** with a torpedo-shaped body, a pointed snout, and rows of sharp teeth. Even though it is powerful, it is still just one part of a larger ocean food web.

Its scientific name is *Carcharodon carcharias*. Great white sharks are among the best-known sharks in the world.

## Where does it live?

Great white sharks live in **coastal seas** and the open ocean in many parts of the world. They are often found in temperate waters near South Africa, Australia, California, and other coasts.

Young sharks may spend more time in shallower coastal habitat, while larger adults can travel far across open sea routes.

## What does it eat?

Great white sharks are [carnivores](/diets/carnivore). They eat fish, rays, smaller sharks, seals, and sea lions.

They often hunt by surprise. A shark may rise from below and bite upward with powerful jaws, then wait for prey to weaken before feeding.

## How does it behave?

Great white sharks usually live **alone**, but they sometimes gather where food is plentiful. They are always moving through the water, using smell, vision, and special electric sensors to notice prey.

Their dark back and pale belly help them blend into the ocean from above and below. This color pattern is a kind of camouflage.

## Life cycle and pups

A baby great white shark is called a **pup**. Pups are born alive in the water and can swim on their own right away.

Young great whites usually hunt smaller prey than adults do. As they grow larger, their diet changes and may include more marine mammals.

## How big and strong is it?

Great white sharks are among the largest predatory fish on Earth. Adults can grow up to about **20 feet long** and weigh thousands of pounds.

Their strong tail helps drive them through the water, and their teeth are replaced throughout life when old teeth break or fall out.

## Why is it at risk?

Great white sharks are listed as [Vulnerable](/conservation-status/vulnerable). They face threats from fishing gear, accidental capture, and the slow pace at which they grow and reproduce.

Protecting ocean habitat and reducing bycatch help keep great white shark populations healthy.`,
    gallery: {
      metaDescription:
        "Browse great white shark photos showing ocean habitat, hunting behavior, close-up teeth, and marine life features.",
      intro:
        "Explore great white shark photos for learning and classroom observation, from surface swimming to close-up shark features.",
    },
  },
  {
    slug: "orca",
    name: "Orca",
    commonNames: ["Orca", "Killer whale"],
    scientificName: "Orcinus orca",
    summary:
      "Orcas are the largest members of the dolphin family. They are smart marine mammals that live in pods, use sound to communicate, and hunt fish or marine mammals in oceans around the world.",
    heroTitle: "Orca Facts",
    metaTitle: "Orca Facts | Habitat, Diet, Pod Life & Photos",
    metaDescription:
      "Discover orca facts with photos, ocean habitat, pod behavior, diet, calves, and conservation. Learn why orcas are dolphins and how pods hunt together.",
    searchIntents: [
      "orca facts",
      "are orcas whales or dolphins",
      "where do orcas live",
      "what do orcas eat",
      "how big is an orca",
      "what is an orca pod",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Artiodactyla",
      family: "Delphinidae",
      genus: "Orcinus",
      species: "O. orca",
    },
    classificationLabels: ["mammal", "carnivore", "large"],
    habitats: ["ocean", "coast", "open sea"],
    continents: ["Worldwide"],
    countries: ["United States", "Canada", "Norway", "Iceland", "New Zealand", "Argentina"],
    biomes: ["marine"],
    dietType: "Carnivore",
    dietItems: ["fish", "squid", "seals", "penguins", "other marine animals"],
    lifespan: {
      wild: "30 to 80 years",
    },
    size: {
      lengthMin: "16 feet",
      lengthMax: "32 feet",
    },
    weight: {
      min: "3,000 pounds",
      max: "12,000 pounds",
    },
    speed: "Up to 34 mph",
    conservationStatus: "Data Deficient",
    populationTrend: "Varies by population",
    behaviors: [
      "pod living",
      "echolocation",
      "cooperative hunting",
      "surface breathing",
      "family learning",
    ],
    adaptations: [
      "echolocation",
      "powerful tail flukes",
      "streamlined body",
      "sharp conical teeth",
      "strong social memory",
    ],
    predators: ["humans"],
    prey: ["fish", "squid", "seals", "other marine animals"],
    reproduction: {
      offspringName: "calf",
      gestationOrIncubation: "About 17 months",
      offspringCount: "Usually 1 calf",
    },
    funFacts: [
      "Orcas are actually the largest dolphins on Earth.",
      "Each pod can have its own calls and hunting habits.",
      "Orcas breathe air and must surface through a blowhole.",
      "A tall dorsal fin can help identify an adult male orca.",
      "Some orca populations specialize in fish while others hunt mammals.",
      "Orca calves stay close to their mother for years.",
    ],
    faq: [
      {
        question: "What is an orca?",
        answer:
          "An orca is a large marine mammal also called a killer whale. It is actually the biggest member of the dolphin family.",
      },
      {
        question: "Are orcas whales or dolphins?",
        answer:
          "Orcas are dolphins. They belong to the dolphin family even though they are often called killer whales.",
      },
      {
        question: "Where do orcas live?",
        answer:
          "Orcas live in oceans around the world, from cold polar seas to temperate coasts and open ocean waters.",
      },
      {
        question: "What do orcas eat?",
        answer:
          "Orcas are carnivores that eat fish, squid, seals, and other marine animals depending on the pod.",
      },
      {
        question: "What is an orca pod?",
        answer:
          "A pod is a family group of orcas that travels, hunts, rests, and communicates together.",
      },
      {
        question: "What is a baby orca called?",
        answer:
          "A baby orca is called a calf. Calves stay close to their mother and learn pod calls and hunting habits.",
      },
      {
        question: "How big is an orca?",
        answer:
          "Orcas can grow from about 16 to 32 feet long, and large males can weigh many thousands of pounds.",
      },
      {
        question: "Are orcas endangered?",
        answer:
          "Orca conservation depends on the population. Some groups face serious threats from pollution, noise, and low food supply.",
      },
    ],
    relatedAnimals: ["bottlenose-dolphin", "great-white-shark", "otter"],
    comparisonCandidates: ["bottlenose-dolphin"],
    coreMdx: `## What is an orca?

An orca is a giant **marine mammal** with a black-and-white body, a tall dorsal fin, and strong family bonds. It is often called a killer whale, but it is actually the largest member of the dolphin family.

Its scientific name is *Orcinus orca*.

## Where does it live?

Orcas live in **oceans around the world**. Some pods stay close to coastlines, while others travel across the open sea in cold, temperate, or even warmer waters.

Different populations use different hunting areas depending on what food they eat and where their families have traveled for generations.

## What does it eat?

Orcas are [carnivores](/diets/carnivore). They eat fish, squid, seals, and other marine animals.

Some pods mainly hunt fish, while others focus on mammals. Orcas often work together to surround prey, separate it from a group, or tire it out before feeding.

## How do orcas live in pods?

Orcas are [social animals](/topics/social-animals) that live in close family groups called **pods**. Pod members stay in contact with whistles, calls, and body movements.

Young orcas learn where to travel and how to hunt by staying with older family members. Some pods have their own call patterns, almost like a family language.

## Life cycle and calves

A baby orca is called a **calf**. The calf is born tail-first in the water and stays close to its mother while learning to surface, swim, and keep up with the pod.

Because pods stay together for many years, calves grow up surrounded by relatives that help keep them safe.

## How big and fast is it?

Orcas are among the strongest predators in the ocean. Large adults can reach about **32 feet long** and swim at speeds up to about **34 mph**.

Their streamlined body and powerful tail flukes help them move quickly through open water.

## Why is it at risk?

Orca conservation is different from one population to another. Some groups are doing fairly well, while others are under pressure from pollution, boat noise, fishing gear, and a shortage of prey.

Protecting clean oceans and healthy fish populations helps orcas and the animals they share the sea with.`,
    gallery: {
      metaDescription:
        "Browse orca photos showing ocean habitat, pods, calves, dorsal fins, and cooperative hunting behavior.",
      intro:
        "Explore orca photos for learning and classroom observation, from pod life and calves to open-ocean swimming.",
    },
  },
  {
    slug: "otter",
    name: "Otter",
    commonNames: ["Sea otter", "Otter"],
    scientificName: "Enhydra lutris",
    summary:
      "Sea otters are furry marine mammals that float on their backs, use tools to open shellfish, and spend much of their life in cold coastal waters. Thick fur helps keep them warm because they do not have blubber like seals.",
    heroTitle: "Otter Facts",
    metaTitle: "Otter Facts | Habitat, Diet, Tools & Photos",
    metaDescription:
      "Discover otter facts with photos, coastal habitat, diet, pups, fur, and tool use. Learn how sea otters stay warm and why kelp forests help them survive.",
    searchIntents: [
      "otter facts",
      "what do otters eat",
      "where do otters live",
      "do otters use tools",
      "how do sea otters stay warm",
      "what is a baby otter called",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Carnivora",
      family: "Mustelidae",
      genus: "Enhydra",
      species: "E. lutris",
    },
    classificationLabels: ["mammal", "carnivore", "medium"],
    habitats: ["coast", "kelp forest", "ocean"],
    continents: ["North America", "Asia"],
    countries: ["United States", "Canada", "Russia", "Japan"],
    biomes: ["marine"],
    dietType: "Carnivore",
    dietItems: ["sea urchins", "crabs", "clams", "mussels", "snails"],
    lifespan: {
      wild: "10 to 20 years",
    },
    size: {
      lengthMin: "3.5 feet",
      lengthMax: "5 feet",
    },
    weight: {
      min: "30 pounds",
      max: "100 pounds",
    },
    speed: "Up to 5 to 6 mph in water",
    conservationStatus: "Endangered",
    populationTrend: "Stable to increasing in some areas",
    behaviors: [
      "floating on the back",
      "tool use",
      "grooming",
      "rafting in groups",
      "pup care",
    ],
    adaptations: [
      "very thick fur",
      "sensitive whiskers",
      "dexterous paws",
      "tool use",
      "webbed feet",
    ],
    predators: ["orcas", "great white sharks", "eagles", "humans"],
    prey: ["sea urchins", "crabs", "clams", "mussels"],
    reproduction: {
      offspringName: "pup",
      gestationOrIncubation: "About 4 to 8 months with delayed implantation",
      offspringCount: "Usually 1 pup",
    },
    funFacts: [
      "Sea otters have some of the thickest fur in the animal world.",
      "They sometimes use rocks as tools to crack open shellfish.",
      "Sea otters often wrap themselves in kelp so they do not drift away.",
      "A group of resting sea otters can be called a raft.",
      "They float on their backs while eating.",
      "Sea otters help kelp forests by eating sea urchins that chew on kelp roots.",
    ],
    faq: [
      {
        question: "What is an otter?",
        answer:
          "This page covers the sea otter, a marine mammal with thick fur, webbed feet, and the ability to float on its back while eating.",
      },
      {
        question: "Where do otters live?",
        answer:
          "Sea otters live in cold coastal waters of the North Pacific, especially near kelp forests and rocky shores.",
      },
      {
        question: "What do otters eat?",
        answer:
          "Sea otters are carnivores that eat shellfish and other marine animals such as sea urchins, crabs, clams, and mussels.",
      },
      {
        question: "Do otters use tools?",
        answer:
          "Yes. Sea otters may use rocks to crack open hard shells while floating on their backs.",
      },
      {
        question: "How do sea otters stay warm?",
        answer:
          "Instead of thick blubber, sea otters stay warm with extremely dense fur that traps air close to the skin.",
      },
      {
        question: "What is a baby otter called?",
        answer:
          "A baby sea otter is called a pup. Pups stay very close to their mother and float on the surface while she dives for food.",
      },
      {
        question: "Why are otters important?",
        answer:
          "Sea otters help keep kelp forests healthy by eating sea urchins that can damage kelp beds.",
      },
      {
        question: "Are otters endangered?",
        answer:
          "Some sea otter populations are protected and recovering, but the species still faces threats from oil spills, disease, and changing ocean conditions.",
      },
    ],
    relatedAnimals: ["orca", "bottlenose-dolphin", "great-white-shark"],
    comparisonCandidates: ["bottlenose-dolphin"],
    coreMdx: `## What is an otter?

This page focuses on the **sea otter**, a marine mammal that spends much of its life in coastal ocean water. Sea otters have thick fur, webbed feet, sensitive whiskers, and clever paws that can hold food and tools.

Its scientific name is *Enhydra lutris*.

## Where does it live?

Sea otters live in **cold coastal waters** of the North Pacific, especially near rocky shores and kelp forests. Kelp gives them shelter and a place to anchor while resting at the surface.

They are much more tied to the coast than orcas or great white sharks, and they spend a lot of time floating rather than swimming long distances offshore.

## What does it eat?

Sea otters are [carnivores](/diets/carnivore). They eat sea urchins, crabs, clams, mussels, snails, and other small marine animals.

Some otters use rocks as tools to crack open hard shells. They often float on their backs while holding food on their chest.

## How does it behave?

Sea otters may rest alone or gather in floating groups called **rafts**. They groom their fur constantly because clean fur traps air and keeps them warm.

Otters sometimes wrap themselves in kelp so they do not drift away while resting. Their whiskers help them feel prey in dark or cloudy water.

## Life cycle and pups

A baby sea otter is called a **pup**. The mother carries, cleans, and protects the pup while it is very young.

Pups float on the surface because their fur traps so much air. The mother dives for food and returns to feed and groom the pup.

## How big and warm is it?

Sea otters are much smaller than orcas or sharks, but they are strong swimmers with dense fur. Adults can grow to about **5 feet long**.

Unlike seals, sea otters do not rely on thick blubber. Their extremely thick fur is what helps them stay warm in cold water.

## Why is it at risk?

Sea otters have recovered in some places, but they still face threats from oil spills, disease, harmful algal blooms, and changes in coastal ecosystems.

Keeping coastal waters clean and healthy helps sea otters and the kelp forests they protect.`,
    gallery: {
      metaDescription:
        "Browse otter photos showing coastal habitat, floating behavior, pups, tool use, and close-up marine mammal features.",
      intro:
        "Explore sea otter photos for learning and classroom observation, from kelp forests and pups to tool use and thick fur.",
    },
  },
];

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath, value) {
  fs.writeFileSync(filePath, `${value}\n`, "utf8");
}

function placeholderSrc(slug, key) {
  return `https://placehold.co/1600x1067/png?text=${slug}+${key}`;
}

function buildImageRecord(animalSlug, imageSlug, imageType, alt, caption, location, featuredOnPages) {
  return {
    id: imageSlug,
    animalSlug,
    slug: imageSlug,
    fileName: `${imageSlug}.webp`,
    src: placeholderSrc(animalSlug, imageSlug),
    width: 1600,
    height: 1067,
    alt,
    caption,
    imageType,
    galleryTopics: [imageType],
    featuredOnPages,
    location,
    acquisitionNotes:
      featuredOnPages[0] === "core"
        ? "Core article placeholder image following the repo template; replace with curated source later."
        : "Gallery placeholder image following the repo template; replace with curated source later.",
    updatedAt: timestamp,
  };
}

const imageCopy = {
  "great-white-shark": {
    hero: ["Great white shark swimming near the surface", "Great white sharks are powerful ocean fish with sharp teeth.", "Open ocean"],
    habitat: ["Great white shark gliding through blue coastal water", "Great white sharks often patrol coastal seas and offshore waters.", "Coastal ocean"],
    diet: ["Great white shark hunting in open water", "Great white sharks eat fish and larger marine animals.", "Marine feeding grounds"],
    baby: ["Young great white shark swimming in clear water", "Young great white sharks hunt smaller prey than adults do.", "Coastal nursery habitat"],
    family: ["Two great white sharks swimming in the same area", "Great white sharks are mostly solitary but may gather where food is plentiful.", "Open sea"],
    range: ["Great white shark in deep blue ocean habitat", "Great white sharks live in oceans around the world.", "Temperate ocean"],
    size: ["Full-body great white shark showing long streamlined shape", "A great white shark's body is built for speed and power.", "Open ocean"],
    closeup: ["Close-up great white shark head with rows of teeth", "Rows of sharp teeth help great white sharks grip slippery prey.", "Marine habitat"],
    "fun-fact": ["Great white shark rising toward the surface", "Great white sharks can replace lost teeth many times during life.", "Surface waters"],
    core: {
      habitat: ["Great white shark cruising through cool coastal water", "Coastal seas give great whites access to food-rich hunting grounds.", "Coastal ocean"],
      diet: ["Great white shark approaching prey in blue water", "Powerful jaws help great white sharks bite and tear large prey.", "Open ocean"],
      family: ["Great white sharks swimming near one another offshore", "Even mostly solitary sharks may gather in places with abundant food.", "Marine feeding zone"],
      baby: ["Young great white shark swimming alone near shore", "Pups begin life as independent hunters in safer coastal nursery areas.", "Nearshore habitat"],
      closeup: ["Great white shark face showing eye snout and teeth", "A great white shark uses smell, sight, and other senses while hunting.", "Blue water habitat"],
      range: ["Great white shark passing through deep open sea", "Great white sharks travel long distances between coastal feeding areas.", "Open ocean"],
    },
  },
  orca: {
    hero: ["Orca surfacing with tall dorsal fin above the sea", "Orcas are giant dolphins that live and hunt in family pods.", "Open ocean"],
    habitat: ["Orca pod swimming across calm coastal water", "Orcas use coastlines and open sea routes in oceans around the world.", "Coastal ocean"],
    diet: ["Orca surfacing during a hunt", "Different orca pods hunt different kinds of prey.", "Marine feeding grounds"],
    baby: ["Young orca calf swimming beside its mother", "Orca calves stay close to their mother while learning to swim and surface.", "Open ocean"],
    family: ["Several orcas traveling together as a pod", "Pods help orcas hunt, communicate, and protect calves.", "Coastal waters"],
    range: ["Orcas in broad ocean habitat beneath open sky", "Orcas live from icy seas to temperate coasts around the world.", "Worldwide ocean"],
    size: ["Full-body orca showing streamlined shape and dorsal fin", "Large adult orcas can grow much longer than most other dolphins.", "Marine habitat"],
    closeup: ["Close-up orca head and eye patch at the surface", "The white eye patch makes an orca easy to recognize.", "Sea surface"],
    "fun-fact": ["Orca tail and dorsal fin cutting through the water", "Some orca pods have their own calls and hunting traditions.", "Open sea"],
    core: {
      habitat: ["Orcas moving through cold coastal water", "Many orca populations return to the same coasts and travel routes again and again.", "Coastal ocean"],
      diet: ["Orcas surfacing together during a coordinated hunt", "Orcas often cooperate to surround prey before feeding.", "Open ocean"],
      family: ["Tight orca pod swimming side by side", "Pod members stay connected for years and learn from older relatives.", "Coastal sea"],
      baby: ["Orca calf surfacing close to an adult", "Calves depend on their family while learning pod calls and movement patterns.", "Marine nursery habitat"],
      closeup: ["Orca head showing eye patch and smooth black skin", "An orca must surface regularly to breathe through its blowhole.", "Sea surface"],
      range: ["Orca pod crossing broad ocean water", "Healthy prey populations help support orcas across very wide marine ranges.", "Open ocean"],
    },
  },
  otter: {
    hero: ["Sea otter floating on its back in coastal water", "Sea otters float on their backs and use thick fur to stay warm.", "Coastal ocean"],
    habitat: ["Sea otter among kelp in shallow coastal habitat", "Kelp forests give sea otters shelter, food, and resting places.", "Kelp forest coast"],
    diet: ["Sea otter holding shellfish while eating", "Sea otters eat shellfish and other marine animals while floating.", "Coastal waters"],
    baby: ["Sea otter mother with pup resting on the surface", "A sea otter pup stays close to its mother while she dives for food.", "Protected coastal water"],
    family: ["Several sea otters resting together in kelp", "Sea otters may gather in floating groups called rafts.", "Kelp forest"],
    range: ["Sea otter floating in cool Pacific coastal water", "Sea otters live along cold North Pacific coasts.", "North Pacific coast"],
    size: ["Full-body sea otter showing paws tail and dense fur", "Sea otters are smaller than seals but strong swimmers in cold water.", "Marine habitat"],
    closeup: ["Close-up sea otter face with whiskers and wet fur", "Sensitive whiskers help sea otters detect prey underwater.", "Coastal sea"],
    "fun-fact": ["Sea otter using a rock to open shellfish", "Sea otters are famous for using rocks as tools.", "Rocky coastal waters"],
    core: {
      habitat: ["Sea otter floating beside thick kelp", "Kelp helps sea otters rest and stay anchored near shore.", "Kelp forest coast"],
      diet: ["Sea otter eating shellfish on its chest", "Sea otters often crack hard shells while floating on their backs.", "Coastal waters"],
      family: ["Sea otters resting together in a floating raft", "Group resting helps sea otters stay near one another in moving water.", "Kelp raft"],
      baby: ["Sea otter pup resting on its mother's chest", "Pups depend on their mother for warmth, grooming, and food.", "Protected bay"],
      closeup: ["Sea otter face showing nose whiskers and dense fur", "A sea otter's dense fur traps air and helps keep cold water out.", "North Pacific coast"],
      range: ["Sea otter in cold coastal habitat with low waves", "Sea otters survive best where healthy coastal ecosystems still support shellfish and kelp.", "Cold coastal ocean"],
    },
  },
};

for (const animal of animals) {
  const baseDir = path.join(animalsRoot, animal.slug);
  const imagesDir = path.join(baseDir, "images");
  const galleryDir = path.join(baseDir, "gallery");

  writeJson(path.join(baseDir, "animal.json"), {
    id: `animal-${animal.slug}`,
    slug: animal.slug,
    name: animal.name,
    commonNames: animal.commonNames,
    scientificName: animal.scientificName,
    summary: animal.summary,
    heroTitle: animal.heroTitle,
    metaTitle: animal.metaTitle,
    metaDescription: animal.metaDescription,
    searchIntents: animal.searchIntents,
    taxonomy: animal.taxonomy,
    classificationLabels: animal.classificationLabels,
    habitats: animal.habitats,
    continents: animal.continents,
    countries: animal.countries,
    biomes: animal.biomes,
    dietType: animal.dietType,
    dietItems: animal.dietItems,
    lifespan: animal.lifespan,
    size: animal.size,
    weight: animal.weight,
    speed: animal.speed,
    conservationStatus: animal.conservationStatus,
    populationTrend: animal.populationTrend,
    behaviors: animal.behaviors,
    adaptations: animal.adaptations,
    predators: animal.predators,
    prey: animal.prey,
    reproduction: animal.reproduction,
    funFacts: animal.funFacts,
    faq: animal.faq,
    relatedAnimals: animal.relatedAnimals,
    comparisonCandidates: animal.comparisonCandidates,
    galleryIds: [`${animal.slug}-gallery-main`],
    updatedAt: timestamp,
    publishedAt: timestamp,
  });

  writeText(path.join(baseDir, "core.mdx"), animal.coreMdx);

  writeJson(path.join(galleryDir, "main.json"), {
    id: `${animal.slug}-gallery-main`,
    animalSlug: animal.slug,
    galleryType: "main",
    slug: "gallery",
    title: `${animal.name} Photo Gallery`,
    metaTitle: `${animal.name} Photo Gallery`,
    metaDescription: animal.gallery.metaDescription,
    intro: animal.gallery.intro,
    imageSlugs: galleryKinds.map((kind) => `${animal.slug}-${kind}`),
    updatedAt: timestamp,
  });

  for (const kind of galleryKinds) {
    const [alt, caption, location] = imageCopy[animal.slug][kind];
    writeJson(
      path.join(imagesDir, `${animal.slug}-${kind}.json`),
      buildImageRecord(animal.slug, `${animal.slug}-${kind}`, kind, alt, caption, location, ["gallery"]),
    );
  }

  for (const kind of coreKinds) {
    const [alt, caption, location] = imageCopy[animal.slug].core[kind];
    writeJson(
      path.join(imagesDir, `${animal.slug}-core-${kind}.json`),
      buildImageRecord(
        animal.slug,
        `${animal.slug}-core-${kind}`,
        kind,
        alt,
        caption,
        location,
        ["core"],
      ),
    );
  }

  console.log(`Populated ${animal.slug}`);
}
