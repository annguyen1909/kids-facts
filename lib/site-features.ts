/** Toggle surfaced site areas. Compare/topics routes stay in the repo for a future upgrade. */
export const siteFeatures = {
  habitats: true,
  diets: true,
  compare: false,
  topics: true,
} as const;

export const disabledFeatureRobots = {
  index: false,
  follow: false,
} as const;
