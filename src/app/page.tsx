import { getEcosystem, getPosts } from "@/lib/content";
import { loadLocalizedHub } from "@/lib/hub-content";
import { familyLabels, skills } from "@/lib/skills";
import { Hub } from "@/components/hub";

// The two tools the framework calls, in order (spec §3 §10 "Built on").
const items = getEcosystem();
const builtOn = ["openclink", "clone-space"]
  .map((slug) => items.find((item) => item.slug === slug))
  .filter((item): item is NonNullable<typeof item> => item !== undefined);

export default function HomePage() {
  const hub = loadLocalizedHub();
  return (
    <Hub
      hubTh={hub.th}
      hubEn={hub.en}
      builtOn={builtOn}
      posts={getPosts()}
      skills={skills}
      familyLabels={familyLabels}
    />
  );
}
