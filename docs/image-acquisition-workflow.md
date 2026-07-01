# Image Acquisition Workflow

## Goal

Acquire and publish 10 legally usable, SEO-optimized images per animal at scale.

## Approved Sources

- Wikimedia Commons
- Unsplash
- Pexels

## Required Image Set Per Animal

1. `hero`
2. `habitat`
3. `diet`
4. `baby`
5. `family`
6. `range`
7. `size`
8. `closeup`
9. `behavior`
10. `fun-fact`

## Asset Folder Structure

```text
assets/
  images/
    animals/
      [animal-slug]/
        original/
        web/
        thumbnails/
        metadata/
```

## Public Content Metadata Structure

```text
content/
  animals/
    [animal-slug]/
      images/
        [image-slug].json
```

Use [assets/images/animals/_template/metadata/image-template.json](/Users/annguyen19/Desktop/CODE/wildlifedb/assets/images/animals/_template/metadata/image-template.json) as the source template.

## Naming Convention

Format:

```text
[animal-slug]-[image-type]-[sequence]
```

Examples:

- `lion-hero-01`
- `lion-habitat-01`
- `lion-closeup-01`

Derivative files:

- `[animal-slug]-[image-type]-[sequence]-1600.webp`
- `[animal-slug]-[image-type]-[sequence]-1200.webp`
- `[animal-slug]-[image-type]-[sequence]-800.webp`
- `[animal-slug]-[image-type]-[sequence]-400.webp`

Rules:

- lowercase only
- hyphen-separated
- no source IDs in public filenames
- stable image-type vocabulary

## Caption Strategy

Captions should:

- explain what the child should notice
- add one factual learning point
- avoid repeating the alt text word-for-word
- stay short enough for mobile

Preferred shape:

- 1 sentence
- 12 to 24 words

Example:

- `Tall grass helps lions hide while stalking prey.`

## Alt Text Strategy

Alt text should:

- describe the literal visible subject
- name the animal
- include action or setting when relevant
- avoid keyword stuffing

Preferred shape:

- 6 to 16 words

Example:

- `Male lion resting on a rock in open savanna`

## Attribution Strategy

Every acquired image must store:

- source name
- source URL
- creator name
- creator URL when available
- license name
- license URL
- attribution text
- download date
- reviewer

Store those fields in the image metadata JSON.

## Legal Review Rules

### Wikimedia Commons

- verify the exact file license
- verify whether attribution is required
- avoid files with unclear or conflicting rights notes

### Unsplash

- verify current license terms at time of download
- store photographer name and source URL

### Pexels

- verify current license terms at time of download
- store creator name and source URL

## Acquisition Workflow

1. Create the image brief for the animal
2. Search sources in order:
   - Wikimedia Commons
   - Pexels
   - Unsplash
3. Shortlist candidates for all 10 required image roles
4. Confirm license and attribution requirements
5. Download the original file to `original/`
6. Normalize naming to the internal convention
7. Generate WebP derivatives:
   - 1600
   - 1200
   - 800
   - 400 thumbnail
8. Fill out metadata JSON
9. Write final alt text and caption
10. Editorial review for biological accuracy and child readability
11. Publish the image JSON into `content/animals/[animal-slug]/images/`

## Editorial QA Checklist

- correct species
- clear subject visibility
- not misleading or over-stylized
- useful for the assigned image role
- legible on mobile
- alt text present
- caption present
- attribution complete
- source URL complete
- license URL complete

## Scalability Rules

- one 10-image checklist per animal
- one metadata JSON per image
- one controlled vocabulary for image roles
- one naming system for all assets
- no image is publishable without attribution metadata
