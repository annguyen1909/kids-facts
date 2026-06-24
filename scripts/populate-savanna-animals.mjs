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

const featuredOnPagesByKind = {
  hero: ["gallery"],
  habitat: ["gallery"],
  diet: ["gallery"],
  baby: ["gallery"],
  family: ["gallery"],
  range: ["gallery"],
  size: ["gallery"],
  closeup: ["gallery"],
  "fun-fact": ["gallery"],
};

const galleryTopicsByKind = {
  hero: ["hero"],
  habitat: ["habitat"],
  diet: ["diet"],
  baby: ["baby"],
  family: ["family"],
  range: ["range"],
  size: ["size"],
  closeup: ["closeup"],
  "fun-fact": ["fun-fact"],
};

const animals = [
  {
    slug: "cheetah",
    name: "Cheetah",
    commonNames: ["Cheetah", "African cheetah", "Asiatic cheetah"],
    scientificName: "Acinonyx jubatus",
    summary:
      "Cheetahs are slim, long-legged cats built for speed. They live mostly in open African grasslands, hunt by day with quick bursts of speed, and use black tear marks to reduce glare.",
    heroTitle: "Cheetah Facts",
    metaTitle: "Cheetah Facts | Habitat, Speed, Diet & Photos",
    metaDescription:
      "Discover cheetah facts with photos, speed, habitat, diet, cub life, and conservation. Learn where cheetahs live and why they are the fastest land animals.",
    searchIntents: [
      "cheetah facts",
      "how fast can a cheetah run",
      "where do cheetahs live",
      "what do cheetahs eat",
      "are cheetahs endangered",
      "why do cheetahs have tear marks",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Carnivora",
      family: "Felidae",
      genus: "Acinonyx",
      species: "A. jubatus",
    },
    classificationLabels: ["mammal", "carnivore", "fast"],
    habitats: ["savanna", "grassland", "open woodland"],
    continents: ["Africa", "Asia"],
    countries: ["Kenya", "Tanzania", "Namibia", "Botswana", "South Africa", "Iran"],
    biomes: ["savanna", "grassland"],
    dietType: "Carnivore",
    dietItems: ["gazelle", "hare", "young wildebeest", "impala", "ground birds"],
    lifespan: {
      wild: "10 to 12 years",
      captivity: "Up to 17 years in human care",
    },
    size: {
      lengthMin: "3.5 feet",
      lengthMax: "5 feet",
      heightMin: "2.3 feet",
      heightMax: "3 feet",
    },
    weight: {
      min: "46 pounds",
      max: "160 pounds",
    },
    speed: "Up to 60 to 70 mph in short bursts",
    conservationStatus: "Vulnerable",
    populationTrend: "Decreasing",
    behaviors: [
      "daytime hunting",
      "short sprint chases",
      "scent marking",
      "male coalitions",
      "cub hiding",
    ],
    adaptations: [
      "lightweight body",
      "long legs",
      "flexible spine",
      "semi-retractable claws",
      "tear marks that reduce sun glare",
    ],
    predators: ["lions", "hyenas", "leopards", "humans"],
    prey: ["gazelle", "impala", "hare", "young antelope"],
    reproduction: {
      offspringName: "cub",
      gestationOrIncubation: "About 3 months",
      offspringCount: "Usually 3 to 5 cubs",
    },
    funFacts: [
      "The cheetah is the fastest land animal on Earth.",
      "Black tear marks under a cheetah's eyes help cut glare in bright sunlight.",
      "A cheetah's claws do not pull all the way in like most cats' claws.",
      "Cheetahs usually hunt during the day instead of at night.",
      "Male cheetahs often live in small groups called coalitions.",
      "A sprinting cheetah uses its tail like a rudder when turning.",
    ],
    faq: [
      {
        question: "What is a cheetah?",
        answer:
          "A cheetah is a large wild cat built for speed. It has a slim body, long legs, black spots, and dark tear marks below its eyes.",
      },
      {
        question: "How fast can a cheetah run?",
        answer:
          "A cheetah can reach about 60 to 70 miles per hour for a very short chase. It cannot keep that top speed for long.",
      },
      {
        question: "Where do cheetahs live?",
        answer:
          "Most wild cheetahs live in African savannas, grasslands, and open woodlands. A very small population also survives in Iran.",
      },
      {
        question: "What do cheetahs eat?",
        answer:
          "Cheetahs are carnivores that eat meat. They often hunt gazelles, impalas, hares, and other small to medium animals.",
      },
      {
        question: "Do cheetahs roar like lions?",
        answer:
          "No. Cheetahs cannot roar like lions. They make chirps, purrs, growls, and yelps instead.",
      },
      {
        question: "Why do cheetahs have tear marks?",
        answer:
          "The dark streaks below a cheetah's eyes help reduce glare from the sun and may help it focus on prey.",
      },
      {
        question: "What is a baby cheetah called?",
        answer:
          "A baby cheetah is called a cub. Cubs stay hidden in cover when they are very young.",
      },
      {
        question: "Are cheetahs endangered?",
        answer:
          "Cheetahs are listed as Vulnerable, which means they need protection. Habitat loss and conflict with people make survival harder.",
      },
    ],
    relatedAnimals: ["lion", "zebra", "gazelle"],
    comparisonCandidates: ["lion"],
    coreMdx: `## What is a cheetah?

A cheetah is a slender wild cat built for **speed**. It has a small head, long legs, black spots, and dark tear marks under its eyes. Those tear marks help cut sunlight glare while the cat watches prey across open land.

Cheetahs belong to the cat family [Felidae](/families/felidae). Their scientific name is *Acinonyx jubatus*.

## Where does it live?

Most wild cheetahs live in **savannas**, grasslands, and open woodlands in Africa. They need wide spaces where they can see prey and have room to sprint. Explore more [savanna animals](/habitats/savanna).

A very small population of Asiatic cheetahs survives in Iran. Compared with lions, cheetahs usually avoid thick forest and crowded places where larger predators may ambush them.

## What does it eat?

Cheetahs are [carnivores](/diets/carnivore). They eat meat from animals such as gazelles, impalas, hares, and young antelope.

Unlike lions, cheetahs usually hunt **alone** or in small male groups. They creep close, explode into a short chase, and trip prey with a swipe of the paw.

## How does it behave?

Cheetahs are most active in the daytime, especially early morning and late afternoon. Day hunting helps them avoid lions and hyenas that are often more active after dark.

Adult females usually live alone except when raising cubs. Adult males may form small **coalitions**, often with brothers, to defend a hunting area together.

## Life cycle and babies

A baby cheetah is called a **cub**. Cubs are born with a long gray mantle of fur along the back that helps them blend into grass and brush.

The mother moves her cubs often to keep them hidden. Young cheetahs stay with their mother for many months while learning to stalk, turn quickly, and catch prey.

## How big and fast is it?

Cheetahs are lightly built compared with lions and leopards. Their flexible spine, long tail, and springy legs help them make fast turns while chasing prey.

They can sprint up to about **60 to 70 mph**, making them the fastest land animals. Even so, they can only keep that top speed for a short distance before overheating.

## Why is it at risk?

Cheetahs are listed as [Vulnerable](/conservation-status/vulnerable). Their numbers are under pressure because grasslands are shrinking and many cubs do not survive near bigger predators.

People also compete with cheetahs for land and sometimes kill them to protect livestock. Protected habitat and wildlife corridors give cheetahs a better chance to survive.`,
    gallery: {
      metaDescription:
        "Browse a cheetah photo gallery with fast-running cats, cubs, close-ups, and grassland habitat images.",
      intro:
        "Explore cheetah photos for learning and classroom observation, from sprinting hunters to spotted cubs in the savanna.",
    },
    imageContent: {
      hero: {
        alt: "Adult cheetah standing alert in sunny grassland",
        caption: "Cheetahs have slim bodies and spots that help them blend into dry grass.",
        location: "African savanna",
      },
      habitat: {
        alt: "Cheetah walking through open savanna habitat",
        caption: "Open grasslands give cheetahs room to spot prey and sprint.",
        location: "Savanna habitat",
      },
      diet: {
        alt: "Cheetah carrying prey across short grass",
        caption: "Cheetahs often hunt small antelope such as gazelles and impalas.",
        location: "Open grassland",
      },
      baby: {
        alt: "Young cheetah cub sitting in tall grass",
        caption: "Cheetah cubs stay hidden while their mother hunts nearby.",
        location: "Grassland den area",
      },
      family: {
        alt: "Mother cheetah resting beside older cubs",
        caption: "A mother cheetah teaches her cubs how to stalk and chase prey.",
        location: "Savanna plain",
      },
      range: {
        alt: "Wide African grassland with scattered shrubs",
        caption: "Most wild cheetahs now survive in scattered parts of Africa.",
        location: "Eastern Africa",
      },
      size: {
        alt: "Full-body cheetah showing long legs and tail",
        caption: "A cheetah's long legs and tail help it balance during fast turns.",
        location: "Open plain",
      },
      closeup: {
        alt: "Close-up cheetah face with tear marks visible",
        caption: "Dark tear marks may help reduce sunlight glare during daytime hunts.",
        location: "Wildlife reserve",
      },
      "fun-fact": {
        alt: "Running cheetah with tail stretched behind body",
        caption: "A cheetah uses its tail like a rudder when twisting during a chase.",
        location: "Savanna chase ground",
      },
      core: {
        habitat: {
          alt: "Cheetah scanning grassland from a low mound",
          caption: "Cheetahs prefer open places where they can see prey from far away.",
          location: "African grassland",
        },
        diet: {
          alt: "Cheetah eating prey in open country",
          caption: "After a sprint, a cheetah must rest before it can feed safely.",
          location: "Savanna habitat",
        },
        family: {
          alt: "Young cheetahs traveling together with their mother",
          caption: "Cheetah cubs learn survival skills by watching and copying their mother.",
          location: "Eastern Africa",
        },
        baby: {
          alt: "Small cheetah cub hiding in brush",
          caption: "A cub's long back fur helps it blend into grass and scrub.",
          location: "Hidden den site",
        },
        closeup: {
          alt: "Cheetah face showing whiskers and amber eyes",
          caption: "A cheetah's light body and focused eyes are built for quick daytime hunts.",
          location: "Wildlife conservancy",
        },
        range: {
          alt: "Dry savanna landscape with distant trees",
          caption: "Cheetahs need large connected grasslands to keep healthy wild populations.",
          location: "Southern Africa",
        },
      },
    },
  },
  {
    slug: "giraffe",
    name: "Giraffe",
    commonNames: ["Giraffe", "Northern giraffe", "Masai giraffe"],
    scientificName: "Giraffa camelopardalis",
    summary:
      "Giraffes are the tallest land animals on Earth. They use their long necks and tongues to browse leaves high in trees and live in loose herds across African savannas.",
    heroTitle: "Giraffe Facts",
    metaTitle: "Giraffe Facts | Habitat, Height, Diet & Photos",
    metaDescription:
      "Discover giraffe facts with photos, long-neck adaptations, habitat, diet, calves, and conservation. Learn how tall giraffes are and why they need savanna trees.",
    searchIntents: [
      "giraffe facts",
      "how tall is a giraffe",
      "where do giraffes live",
      "what do giraffes eat",
      "why do giraffes have long necks",
      "are giraffes endangered",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Artiodactyla",
      family: "Giraffidae",
      genus: "Giraffa",
      species: "G. camelopardalis",
    },
    classificationLabels: ["mammal", "herbivore", "tall"],
    habitats: ["savanna", "woodland", "grassland"],
    continents: ["Africa"],
    countries: ["Kenya", "Tanzania", "Namibia", "Botswana", "South Africa", "Niger"],
    biomes: ["savanna", "woodland"],
    dietType: "Herbivore",
    dietItems: ["acacia leaves", "shoots", "flowers", "seed pods"],
    lifespan: {
      wild: "20 to 25 years",
      captivity: "Up to 30 years in human care",
    },
    size: {
      lengthMin: "8 feet",
      lengthMax: "14 feet",
      heightMin: "14 feet",
      heightMax: "19 feet",
    },
    weight: {
      min: "1,200 pounds",
      max: "4,200 pounds",
    },
    speed: "Up to 35 mph",
    conservationStatus: "Vulnerable",
    populationTrend: "Decreasing",
    behaviors: [
      "browsing tall trees",
      "loose herd living",
      "calf guarding",
      "neck sparring",
      "watchful scanning",
    ],
    adaptations: [
      "long neck",
      "long grasping tongue",
      "powerful heart",
      "tall legs",
      "patterned coat camouflage",
    ],
    predators: ["lions", "hyenas", "crocodiles", "humans"],
    prey: [],
    reproduction: {
      offspringName: "calf",
      gestationOrIncubation: "About 15 months",
      offspringCount: "Usually 1 calf",
    },
    funFacts: [
      "A giraffe's tongue can be about 18 to 20 inches long.",
      "Giraffes are the tallest land animals in the world.",
      "Each giraffe has a unique patch pattern.",
      "Newborn calves can stand not long after birth.",
      "Giraffes sleep only for short periods at a time.",
      "Male giraffes sometimes swing their necks in contests called necking.",
    ],
    faq: [
      {
        question: "What is a giraffe?",
        answer:
          "A giraffe is a tall African mammal with a very long neck and legs. It is the tallest land animal on Earth.",
      },
      {
        question: "Where do giraffes live?",
        answer:
          "Giraffes live in African savannas, open woodlands, and grasslands where trees grow far apart.",
      },
      {
        question: "What do giraffes eat?",
        answer:
          "Giraffes are herbivores. They mainly eat leaves, shoots, flowers, and seed pods from tall trees such as acacias.",
      },
      {
        question: "How tall is a giraffe?",
        answer:
          "Adult giraffes can grow to about 14 to 19 feet tall. Males are usually taller than females.",
      },
      {
        question: "Why do giraffes have long tongues?",
        answer:
          "A giraffe's long tongue helps it pull leaves from thorny branches high above the ground.",
      },
      {
        question: "What is a baby giraffe called?",
        answer:
          "A baby giraffe is called a calf. Calves can stand and walk soon after they are born.",
      },
      {
        question: "Do giraffes live alone?",
        answer:
          "Giraffes usually live in loose groups called herds. The group may change as animals move around for food.",
      },
      {
        question: "Are giraffes endangered?",
        answer:
          "Giraffes are listed as Vulnerable overall. Habitat loss and broken-up migration routes have reduced some wild populations.",
      },
    ],
    relatedAnimals: ["zebra", "gazelle", "african-elephant"],
    comparisonCandidates: ["african-elephant"],
    coreMdx: `## What is a giraffe?

A giraffe is the **tallest land animal** on Earth. It has a very long neck, long legs, a spotted coat, and a dark tongue that can wrap around leaves.

Giraffes belong to the family Giraffidae. Their scientific name is *Giraffa camelopardalis*.

## Where does it live?

Giraffes live in **savannas** and open woodlands across Africa. They do best in places with scattered trees, especially acacias, where they can browse leaves above the reach of many other animals. Explore more [savanna animals](/habitats/savanna).

Open country also helps giraffes spot danger from far away. Their height gives them an excellent view over grass and shrubs.

## What does it eat?

Giraffes are herbivores, so they eat **plants** instead of meat. Their favorite foods include leaves, shoots, flowers, and seed pods from thorny trees.

Their long tongue and tough lips help them pull leaves around thorns without getting hurt. Because food sits high in trees, giraffes do not need to compete with many shorter grazers.

## How does it behave?

Giraffes usually live in loose herds that change over time. These groups are calmer and less tightly organized than a lion pride, but herd life still helps giraffes stay alert to danger. Read more about [social animals](/topics/social-animals).

Male giraffes may spar by swinging their necks in contests called **necking**. Females often stay near calves and move steadily between feeding spots.

## Life cycle and babies

A baby giraffe is called a **calf**. The calf drops to the ground at birth, then usually stands within a short time and starts following its mother soon after.

Calves are vulnerable to lions and hyenas, so staying close to adults matters. A mother giraffe nurses and guards her calf while it learns where to feed and when to run.

## How big and fast is it?

Adult giraffes can grow up to about **19 feet tall**. Even though they look slow and gentle, giraffes can run up to about **35 mph** when they need to escape.

Their long legs cover a lot of ground in each stride, and their strong heart pumps blood all the way up the neck to the brain.

## Why is it at risk?

Giraffes are listed as [Vulnerable](/conservation-status/vulnerable). Some populations are shrinking because land is being cleared, migration routes are cut apart, and water can be harder to find.

Protected parks, wildlife corridors, and local conservation work help giraffes move safely across their habitat and keep wild herds connected.`,
    gallery: {
      metaDescription:
        "Browse a giraffe photo gallery with tall adults, calves, feeding behavior, and African savanna habitat images.",
      intro:
        "Explore giraffe photos for learning and classroom observation, from high browsing and calf care to wide savanna scenes.",
    },
    imageContent: {
      hero: {
        alt: "Tall giraffe standing beside acacia trees",
        caption: "Giraffes use their height to reach leaves high above the ground.",
        location: "African savanna",
      },
      habitat: {
        alt: "Giraffe walking across open savanna woodland",
        caption: "Savannas with scattered trees give giraffes food and open views.",
        location: "East African savanna",
      },
      diet: {
        alt: "Giraffe using long tongue to eat leaves",
        caption: "A giraffe's tongue helps it pull leaves from thorny branches.",
        location: "Acacia woodland",
      },
      baby: {
        alt: "Young giraffe calf standing near its mother",
        caption: "Giraffe calves can stand soon after birth and stay close to adults.",
        location: "Savanna nursery area",
      },
      family: {
        alt: "Small herd of giraffes moving together on grassland",
        caption: "Giraffes often travel in loose groups that shift as they feed.",
        location: "Open woodland",
      },
      range: {
        alt: "Wide savanna landscape with acacia trees",
        caption: "Giraffes live in parts of Africa where trees and open ground meet.",
        location: "Sub-Saharan Africa",
      },
      size: {
        alt: "Full-body giraffe showing long legs and neck",
        caption: "A giraffe's long neck and towering legs make it the tallest land animal.",
        location: "Grassland reserve",
      },
      closeup: {
        alt: "Close-up giraffe head with long eyelashes",
        caption: "Large eyes and long eyelashes help protect giraffes from dust and thorns.",
        location: "Wildlife park",
      },
      "fun-fact": {
        alt: "Giraffe stretching tongue around tree branch",
        caption: "A giraffe's tongue can be long enough to curl around thorny twigs.",
        location: "Browsing site",
      },
      core: {
        habitat: {
          alt: "Giraffe beside thorn trees in dry woodland",
          caption: "Giraffes depend on tree-rich savannas where food grows above ground level.",
          location: "Dry savanna woodland",
        },
        diet: {
          alt: "Giraffe browsing leaves high in a tree crown",
          caption: "High browsing lets giraffes reach food that many other herbivores cannot reach.",
          location: "East Africa",
        },
        family: {
          alt: "Several giraffes watching the same direction together",
          caption: "Loose herds help giraffes watch for danger while they feed.",
          location: "Savanna plain",
        },
        baby: {
          alt: "Giraffe calf walking under the legs of its mother",
          caption: "Calves stay close to adults while learning to move through open country.",
          location: "Grassland nursery area",
        },
        closeup: {
          alt: "Giraffe face showing nose patches and long lashes",
          caption: "A giraffe's face is adapted for browsing branches full of leaves and thorns.",
          location: "Tree-line habitat",
        },
        range: {
          alt: "Sunlit savanna with distant tree belt",
          caption: "Wild giraffes need connected savannas so herds can keep moving between feeding areas.",
          location: "Southern Africa",
        },
      },
    },
  },
  {
    slug: "gazelle",
    name: "Gazelle",
    commonNames: ["Gazelle", "Thomson's gazelle", "Grant's gazelle"],
    scientificName: "Gazella spp.",
    summary:
      "Gazelles are fast, alert antelopes that live in herds on African and Asian grasslands. Their speed, sharp hearing, and springing jumps help them escape predators.",
    heroTitle: "Gazelle Facts",
    metaTitle: "Gazelle Facts | Habitat, Speed, Diet & Photos",
    metaDescription:
      "Discover gazelle facts with photos, herd behavior, grassland habitat, diet, fawns, and survival tricks. Learn how gazelles escape predators in open country.",
    searchIntents: [
      "gazelle facts",
      "what do gazelles eat",
      "where do gazelles live",
      "how fast can a gazelle run",
      "what is a baby gazelle called",
      "why do gazelles jump",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Artiodactyla",
      family: "Bovidae",
      genus: "Gazella",
      species: "Gazella spp.",
    },
    classificationLabels: ["mammal", "herbivore", "hoofed"],
    habitats: ["savanna", "grassland", "semi-desert"],
    continents: ["Africa", "Asia"],
    countries: ["Kenya", "Tanzania", "Ethiopia", "Sudan", "Mongolia", "India"],
    biomes: ["savanna", "grassland"],
    dietType: "Herbivore",
    dietItems: ["grass", "leaves", "shoots", "herbs"],
    lifespan: {
      wild: "10 to 12 years",
      captivity: "Up to 15 years in human care",
    },
    size: {
      lengthMin: "3 feet",
      lengthMax: "5.5 feet",
      heightMin: "2 feet",
      heightMax: "3 feet",
    },
    weight: {
      min: "26 pounds",
      max: "165 pounds",
    },
    speed: "Up to 50 to 60 mph",
    conservationStatus: "Least Concern",
    populationTrend: "Stable in some places, decreasing in others",
    behaviors: [
      "herd living",
      "watchful scanning",
      "bounding jumps",
      "fast zigzag running",
      "seasonal movement",
    ],
    adaptations: [
      "slender legs",
      "sharp hearing",
      "wide-set eyes",
      "light body",
      "quick turning ability",
    ],
    predators: ["cheetahs", "lions", "leopards", "wild dogs", "humans"],
    prey: [],
    reproduction: {
      offspringName: "fawn",
      gestationOrIncubation: "About 5 to 6 months",
      offspringCount: "Usually 1 fawn",
    },
    funFacts: [
      "Many gazelles perform high leaps called stotting or pronking.",
      "Gazelles can make sharp turns while running at high speed.",
      "A baby gazelle is called a fawn.",
      "Gazelles often live in herds that help them watch for predators.",
      "Wide eyes on the sides of the head help gazelles spot danger.",
      "Some gazelles can go a long time with little standing water.",
    ],
    faq: [
      {
        question: "What is a gazelle?",
        answer:
          "A gazelle is a small to medium antelope with slender legs, large eyes, and quick speed. Gazelles usually live in open grasslands and savannas.",
      },
      {
        question: "Where do gazelles live?",
        answer:
          "Gazelles live in parts of Africa and Asia, especially grasslands, savannas, and other open habitats.",
      },
      {
        question: "What do gazelles eat?",
        answer:
          "Gazelles are herbivores. They eat grasses, leaves, herbs, and tender shoots.",
      },
      {
        question: "How fast can a gazelle run?",
        answer:
          "Many gazelles can run about 50 to 60 miles per hour and make quick turns to escape predators.",
      },
      {
        question: "Why do gazelles jump high?",
        answer:
          "Gazelles may leap high to show they are strong, confuse predators, or help the herd notice danger.",
      },
      {
        question: "What is a baby gazelle called?",
        answer:
          "A baby gazelle is called a fawn. Fawns often lie still and hidden when they are very young.",
      },
      {
        question: "Do gazelles live in herds?",
        answer:
          "Yes. Many gazelles live in herds, which helps them watch for danger and move together across open country.",
      },
      {
        question: "Are gazelles endangered?",
        answer:
          "Some gazelle species are doing fairly well, while others are in trouble. This page uses a general gazelle profile, so local conservation status can differ by species.",
      },
    ],
    relatedAnimals: ["zebra", "cheetah", "lion"],
    comparisonCandidates: ["lion"],
    coreMdx: `## What is a gazelle?

A gazelle is a fast, lightweight **antelope** with long legs and large eyes. Many gazelles live in herds and rely on speed, sharp hearing, and quick turns to escape predators.

Gazelles belong to the cattle-and-antelope family Bovidae. Different species live across Africa and parts of Asia.

## Where does it live?

Gazelles live in **savannas**, grasslands, and other open habitats where they can see danger coming from far away. Their bodies are built for running across firm ground rather than climbing through thick forest. Explore more [savanna animals](/habitats/savanna).

Some gazelles also live in dry, scrubby country where plants are short and scattered.

## What does it eat?

Gazelles are herbivores, which means they eat **plants**. They feed on grasses, leaves, herbs, and tender shoots.

Because gazelles eat low plants, they often share habitat with taller browsers such as giraffes. Open feeding areas also make it easier for the herd to watch for predators.

## How does it behave?

Gazelles often live in **herds** that help keep many eyes and ears on the landscape at once. Read more about [social animals](/topics/social-animals).

When danger appears, a gazelle may spring high into the air, then dash away in quick turns. These jumps can confuse predators and show that the animal is strong and ready to flee.

## Life cycle and babies

A baby gazelle is called a **fawn**. Young fawns often stay hidden in grass while the mother feeds nearby and returns to nurse them.

As the fawn grows stronger, it begins to follow the herd and learn when to freeze, run, and stay close to adults.

## How big and fast is it?

Gazelles are much smaller than zebras or giraffes, but they are extremely quick. Many can run up to about **50 to 60 mph** and turn suddenly while escaping a cheetah.

Their slim legs, light body, and strong lungs make them excellent runners in open country.

## Why is it at risk?

Some gazelle species are still common, but others are under pressure from habitat loss, fences, hunting, and competition with livestock.

Protecting open grasslands and migration routes helps gazelles move safely between feeding areas and find space away from people and predators.`,
    gallery: {
      metaDescription:
        "Browse a gazelle photo gallery with grazing herds, fawns, open grassland habitat, and close-up antelope images.",
      intro:
        "Explore gazelle photos for learning and classroom observation, from fast-running herds to hidden fawns in dry grass.",
    },
    imageContent: {
      hero: {
        alt: "Alert gazelle standing in open grassland",
        caption: "Gazelles are light, fast antelopes that watch carefully for danger.",
        location: "Savanna grassland",
      },
      habitat: {
        alt: "Gazelles crossing open savanna plain",
        caption: "Open country helps gazelles spot predators before a chase begins.",
        location: "East African grassland",
      },
      diet: {
        alt: "Gazelle grazing on short green grass",
        caption: "Gazelles feed on grasses, herbs, and tender leaves close to the ground.",
        location: "Seasonal pasture",
      },
      baby: {
        alt: "Young gazelle fawn hiding in dry grass",
        caption: "Gazelle fawns often stay hidden and still while adults keep watch nearby.",
        location: "Grassland cover",
      },
      family: {
        alt: "Small herd of gazelles moving together",
        caption: "Herd life gives gazelles many eyes and ears to detect danger.",
        location: "Open plain",
      },
      range: {
        alt: "Wide dry grassland with scattered shrubs",
        caption: "Gazelles live in open landscapes across parts of Africa and Asia.",
        location: "African and Asian grasslands",
      },
      size: {
        alt: "Side view of gazelle showing slim legs and horns",
        caption: "A gazelle's light body helps it accelerate and turn quickly.",
        location: "Short-grass savanna",
      },
      closeup: {
        alt: "Close-up gazelle head with large eyes and ears",
        caption: "Large eyes and ears help gazelles notice predators from far away.",
        location: "Wildlife reserve",
      },
      "fun-fact": {
        alt: "Gazelle leaping high while running",
        caption: "High bouncing jumps can signal strength and confuse a chasing predator.",
        location: "Predator watch zone",
      },
      core: {
        habitat: {
          alt: "Gazelle standing on open plain with distant herd",
          caption: "Gazelles do best in open habitats where they can rely on sharp eyesight and speed.",
          location: "Dry savanna",
        },
        diet: {
          alt: "Gazelle lowering head to browse leaves",
          caption: "Gazelles switch between grass and leafy plants as seasons change.",
          location: "Mixed grassland",
        },
        family: {
          alt: "Gazelle herd clustered closely together",
          caption: "Living in herds helps gazelles react quickly when one animal spots danger.",
          location: "Open range",
        },
        baby: {
          alt: "Small gazelle fawn lying quietly in cover",
          caption: "Staying still is one of a young fawn's first defenses against predators.",
          location: "Hidden nest patch",
        },
        closeup: {
          alt: "Gazelle face showing narrow muzzle and alert ears",
          caption: "A gazelle's light head and wide field of view help it scan for danger while feeding.",
          location: "Savanna edge",
        },
        range: {
          alt: "Broad grassland under a bright sky",
          caption: "Healthy gazelle populations need connected grasslands and room to move with the seasons.",
          location: "Open migration route",
        },
      },
    },
  },
  {
    slug: "zebra",
    name: "Zebra",
    commonNames: ["Zebra", "Plains zebra", "Common zebra"],
    scientificName: "Equus quagga",
    summary:
      "Zebras are striped hoofed mammals that live in African grasslands and savannas. They graze in herds, stay alert together, and use speed and powerful kicks to escape predators.",
    heroTitle: "Zebra Facts",
    metaTitle: "Zebra Facts | Habitat, Stripes, Diet & Photos",
    metaDescription:
      "Discover zebra facts with photos, stripes, herd behavior, grassland habitat, foals, and conservation. Learn why zebras live in groups and what their stripes may do.",
    searchIntents: [
      "zebra facts",
      "why do zebras have stripes",
      "where do zebras live",
      "what do zebras eat",
      "what is a baby zebra called",
      "how fast can a zebra run",
    ],
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Perissodactyla",
      family: "Equidae",
      genus: "Equus",
      species: "E. quagga",
    },
    classificationLabels: ["mammal", "herbivore", "hoofed"],
    habitats: ["savanna", "grassland", "open woodland"],
    continents: ["Africa"],
    countries: ["Kenya", "Tanzania", "Botswana", "Namibia", "Zimbabwe", "South Africa"],
    biomes: ["savanna", "grassland"],
    dietType: "Herbivore",
    dietItems: ["grass", "young shoots", "stems"],
    lifespan: {
      wild: "20 to 25 years",
      captivity: "Up to 30 years in human care",
    },
    size: {
      lengthMin: "6.5 feet",
      lengthMax: "8.5 feet",
      heightMin: "4 feet",
      heightMax: "5 feet",
    },
    weight: {
      min: "440 pounds",
      max: "990 pounds",
    },
    speed: "Up to 40 mph",
    conservationStatus: "Near Threatened",
    populationTrend: "Decreasing",
    behaviors: [
      "herd living",
      "grazing",
      "migration",
      "mutual grooming",
      "strong defensive kicking",
    ],
    adaptations: [
      "striped coat",
      "powerful legs",
      "sharp hearing",
      "wide-angle vision",
      "strong teeth for grazing",
    ],
    predators: ["lions", "hyenas", "wild dogs", "crocodiles", "humans"],
    prey: [],
    reproduction: {
      offspringName: "foal",
      gestationOrIncubation: "About 12 to 13 months",
      offspringCount: "Usually 1 foal",
    },
    funFacts: [
      "Every zebra has a unique stripe pattern.",
      "A zebra foal can stand shortly after birth.",
      "Zebras use powerful kicks to defend themselves from predators.",
      "Zebras often live in herds with a lot of calling and body signals.",
      "Scientists still study exactly how stripes help zebras the most.",
      "Zebras can travel long distances to find fresh grazing and water.",
    ],
    faq: [
      {
        question: "What is a zebra?",
        answer:
          "A zebra is an African hoofed mammal related to horses and donkeys. It is famous for its black-and-white striped coat.",
      },
      {
        question: "Where do zebras live?",
        answer:
          "Zebras live in African savannas, grasslands, and open woodlands where they can graze and move in herds.",
      },
      {
        question: "What do zebras eat?",
        answer:
          "Zebras are herbivores. They mainly eat grass, along with some shoots and stems.",
      },
      {
        question: "Why do zebras have stripes?",
        answer:
          "Stripes may help confuse biting insects, make moving herds harder for predators to track, and help zebras recognize one another.",
      },
      {
        question: "What is a baby zebra called?",
        answer:
          "A baby zebra is called a foal. Foals can stand and follow the herd soon after birth.",
      },
      {
        question: "How fast can a zebra run?",
        answer:
          "A zebra can run up to about 40 miles per hour and can also kick very hard if cornered.",
      },
      {
        question: "Do zebras live in groups?",
        answer:
          "Yes. Zebras usually live in family groups or larger herds, which helps them watch for danger together.",
      },
      {
        question: "Are zebras endangered?",
        answer:
          "Some zebra populations are under pressure from habitat loss and fences. This page focuses on the plains zebra, which faces regional declines.",
      },
    ],
    relatedAnimals: ["gazelle", "giraffe", "lion"],
    comparisonCandidates: ["lion"],
    coreMdx: `## What is a zebra?

A zebra is a striped African mammal related to horses and donkeys. Its black-and-white coat pattern is unique to each animal, a bit like a fingerprint.

Zebras belong to the horse family Equidae. The plains zebra, *Equus quagga*, is the most familiar zebra in African grasslands.

## Where does it live?

Zebras live in **savannas**, grasslands, and open woodlands across Africa. They need places with grazing plants and routes that lead to water. Explore more [savanna animals](/habitats/savanna).

Open country also helps zebras keep watch for lions and other predators while the herd feeds.

## What does it eat?

Zebras are herbivores that mostly eat **grass**. Their strong front teeth and grinding back teeth help them crop tough plants close to the ground.

Because zebras can eat rougher grasses than some other herbivores, they often graze first and leave shorter new growth behind for other animals.

## How does it behave?

Zebras usually live in **family groups** and larger herds. Group life helps them watch for predators together and stay connected while moving across open land. Read more about [social animals](/topics/social-animals).

They communicate with sounds, ear positions, and body movements. Mutual grooming also helps strengthen bonds inside the group.

## Life cycle and babies

A baby zebra is called a **foal**. Foals can stand soon after birth and quickly learn to recognize their mother's stripe pattern, smell, and call.

Staying close to the herd is important because foals are vulnerable to predators. Adults defend them by running, biting, and kicking.

## How big and fast is it?

Zebras are strong runners that can reach about **40 mph**. Their solid body, quick reflexes, and powerful back legs make them difficult prey.

If a predator gets too close, a zebra can wheel around and kick with great force.

## Why is it at risk?

Some zebra populations are falling because of habitat loss, fences that block movement, and competition with livestock for grass and water.

Protected migration routes and healthy grasslands help zebra herds keep moving safely between feeding areas and water sources.`,
    gallery: {
      metaDescription:
        "Browse a zebra photo gallery with striped herds, foals, grassland habitat, and close-up wildlife images.",
      intro:
        "Explore zebra photos for learning and classroom observation, from striped foals and herd life to wide-open African grasslands.",
    },
    imageContent: {
      hero: {
        alt: "Striped zebra standing in golden grass",
        caption: "Every zebra has a stripe pattern that is slightly different from every other zebra.",
        location: "African savanna",
      },
      habitat: {
        alt: "Zebras grazing across open grassland habitat",
        caption: "Open grasslands give zebras room to graze, run, and spot predators.",
        location: "East African grassland",
      },
      diet: {
        alt: "Zebra lowering head to eat grass",
        caption: "Zebras are herbivores that spend many hours each day grazing.",
        location: "Savanna pasture",
      },
      baby: {
        alt: "Young zebra foal standing near adults",
        caption: "A zebra foal can stand soon after birth and quickly follows the herd.",
        location: "Family herd area",
      },
      family: {
        alt: "Several zebras standing close together in a herd",
        caption: "Living in herds helps zebras watch for danger and protect young foals.",
        location: "Open savanna plain",
      },
      range: {
        alt: "Wide grassland with zebras in the distance",
        caption: "Plains zebras live in parts of eastern and southern Africa.",
        location: "Sub-Saharan Africa",
      },
      size: {
        alt: "Side view zebra showing body shape and strong legs",
        caption: "A zebra's sturdy body and strong legs help it run and kick hard.",
        location: "Wildlife reserve",
      },
      closeup: {
        alt: "Close-up zebra face with stripes around eyes",
        caption: "Stripe patterns continue across the face, neck, and body in unique ways.",
        location: "Grassland reserve",
      },
      "fun-fact": {
        alt: "Zebras moving together in a striped herd",
        caption: "A moving herd of stripes can make it harder for a predator to focus on one zebra.",
        location: "Migrating herd route",
      },
      core: {
        habitat: {
          alt: "Zebras walking across broad open plain",
          caption: "Zebras depend on open grazing land with enough grass and water.",
          location: "Savanna migration route",
        },
        diet: {
          alt: "Zebra cropping short grass with front teeth",
          caption: "Strong grazing teeth let zebras feed on coarse grasses for long hours.",
          location: "Seasonal grassland",
        },
        family: {
          alt: "Zebra family group standing shoulder to shoulder",
          caption: "Herd bonds help zebras defend foals and stay alert together.",
          location: "African plain",
        },
        baby: {
          alt: "Young zebra foal tucked close to its mother",
          caption: "Foals learn to identify their mother's stripes very quickly after birth.",
          location: "Nursery herd",
        },
        closeup: {
          alt: "Zebra head showing ears muzzle and stripe pattern",
          caption: "Stripe patterns may help zebras recognize one another at close range.",
          location: "Open rangeland",
        },
        range: {
          alt: "Expansive grassland under open sky",
          caption: "Connected grasslands allow zebra herds to move between grazing areas and water.",
          location: "Southern African range",
        },
      },
    },
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function placeholderSrc(slug, key) {
  return `https://placehold.co/1600x1067/png?text=${slug}+${key}`;
}

function buildImageRecord(animal, kind, content, featuredOnPages, slugOverride) {
  const slug = slugOverride ?? `${animal.slug}-${kind}`;
  return {
    id: slug,
    animalSlug: animal.slug,
    slug,
    fileName: `${slug}.webp`,
    src: placeholderSrc(animal.slug, slug),
    width: 1600,
    height: 1067,
    alt: content.alt,
    caption: content.caption,
    imageType: kind,
    galleryTopics: galleryTopicsByKind[kind],
    featuredOnPages,
    location: content.location,
    acquisitionNotes:
      featuredOnPages.includes("core")
        ? "Core article placeholder image following the repo template; replace with curated source later."
        : "Gallery placeholder image following the repo template; replace with curated source later.",
    updatedAt: timestamp,
  };
}

for (const animal of animals) {
  const animalDir = path.join(animalsRoot, animal.slug);
  const galleryDir = path.join(animalDir, "gallery");
  const imagesDir = path.join(animalDir, "images");

  ensureDir(galleryDir);
  ensureDir(imagesDir);

  writeJson(path.join(animalDir, "animal.json"), {
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

  fs.writeFileSync(path.join(animalDir, "core.mdx"), `${animal.coreMdx}\n`, "utf8");

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
    writeJson(
      path.join(imagesDir, `${animal.slug}-${kind}.json`),
      buildImageRecord(
        animal,
        kind,
        animal.imageContent[kind],
        featuredOnPagesByKind[kind],
      ),
    );
  }

  for (const kind of coreKinds) {
    writeJson(
      path.join(imagesDir, `${animal.slug}-core-${kind}.json`),
      buildImageRecord(
        animal,
        kind,
        animal.imageContent.core[kind],
        ["core"],
        `${animal.slug}-core-${kind}`,
      ),
    );
  }

  console.log(`Populated ${animal.slug}`);
}
