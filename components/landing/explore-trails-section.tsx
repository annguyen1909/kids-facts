import Link from "next/link";
import { Leaf, Salad } from "lucide-react";
import { HubClusterCard } from "@/components/animals/hub-cluster-card";
import { LandingSection } from "@/components/ui/landing-section";
import type { HubCluster } from "@/lib/hub-clusters";
import { buildUniqueHubFeaturedMap } from "@/lib/unique-featured-animals";

type ExploreTrailsSectionProps = {
  habitatClusters: HubCluster[];
  dietClusters: HubCluster[];
};

export function ExploreTrailsSection({
  habitatClusters,
  dietClusters,
}: ExploreTrailsSectionProps) {
  const featuredByCluster = buildUniqueHubFeaturedMap([...habitatClusters, ...dietClusters]);

  return (
    <LandingSection id="explore-trails" tint="sky" pattern="sky">
      <div className="explore-trails">
        <div className="explore-trails__masthead">
          <div className="explore-trails__intro">
            <p className="eyebrow eyebrow--light">Explore by trail</p>
            <h2 className="section-title mt-3 text-[var(--forest-deep)]">
              Follow a route through habitats and diets
            </h2>
            <p className="mt-3 body-lead">
              Group animals by where they live or what they eat — useful for research, teaching, or
              casual discovery.
            </p>
          </div>

          <div className="explore-trails__waypoints" aria-hidden>
            <span className="explore-trails__waypoint explore-trails__waypoint--habitats">
              <Leaf className="explore-trails__waypoint-icon" strokeWidth={2.25} />
              <span className="explore-trails__waypoint-label">Habitats</span>
              <span className="explore-trails__waypoint-count">{habitatClusters.length}</span>
            </span>
            <span className="explore-trails__waypoint-line" />
            <span className="explore-trails__waypoint explore-trails__waypoint--diets">
              <Salad className="explore-trails__waypoint-icon" strokeWidth={2.25} />
              <span className="explore-trails__waypoint-label">Diets</span>
              <span className="explore-trails__waypoint-count">{dietClusters.length}</span>
            </span>
          </div>
        </div>

        <div className="explore-trails__subsection">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="field-label">Route 01</p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-[var(--forest-deep)]">
                Habitats
              </h3>
            </div>
            <Link href="/habitats" className="shrink-0 text-base font-semibold text-[var(--forest)]">
              See all habitats
            </Link>
          </div>
          <div className="explore-trails__grid explore-trails__grid--habitats">
            {habitatClusters.map((cluster, index) => (
              <HubClusterCard
                key={cluster.slug}
                cluster={cluster}
                type="habitats"
                featuredAnimal={featuredByCluster.get(cluster.slug)}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
        </div>

        <div className="explore-trails__subsection explore-trails__subsection--diets">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="field-label field-label--warm">Route 02</p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-[var(--forest-deep)]">
                Diets
              </h3>
            </div>
            <Link href="/diets" className="shrink-0 text-base font-semibold text-[var(--forest)]">
              See all diets
            </Link>
          </div>
          <div className="explore-trails__grid explore-trails__grid--diets">
            {dietClusters.map((cluster, index) => (
              <HubClusterCard
                key={cluster.slug}
                cluster={cluster}
                type="diets"
                featuredAnimal={featuredByCluster.get(cluster.slug)}
                variant={index === 0 ? "featured" : "default"}
              />
            ))}
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
