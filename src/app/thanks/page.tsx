import { ThanksView } from "@/components/thanks/thanks-view";
import { roleSegmentLabels, type RoleSegment } from "@/lib/beta-leads";

type ThanksPageProps = {
  searchParams: Promise<{
    segment?: string;
    wantsInterview?: string;
    duplicate?: string;
  }>;
};

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const params = await searchParams;
  const segment =
    params.segment && params.segment in roleSegmentLabels
      ? (params.segment as RoleSegment)
      : "other";

  return (
    <ThanksView
      wantsInterview={params.wantsInterview === "1"}
      duplicate={params.duplicate === "1"}
      calendlyUrl={process.env.CALENDLY_URL}
      roleLabel={roleSegmentLabels[segment]}
    />
  );
}
