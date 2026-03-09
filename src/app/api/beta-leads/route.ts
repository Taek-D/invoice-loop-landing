import { NextResponse } from "next/server";

import { betaLeadInputSchema, deriveLeadStage } from "@/lib/beta-leads";
import { sendLeadNotification } from "@/lib/notify";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "JSON 형식의 요청이 필요합니다.",
      },
      { status: 400 },
    );
  }

  const parsed = betaLeadInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "입력값을 확인해 주세요.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase 환경변수가 설정되지 않았습니다.",
      },
      { status: 503 },
    );
  }

  const lead = parsed.data;
  const payload = {
    name: lead.name,
    email: lead.email,
    role_segment: lead.roleSegment,
    monthly_invoice_count: lead.monthlyInvoiceCount,
    current_workflow: lead.currentWorkflow,
    biggest_pain: lead.biggestPain,
    willing_to_pay: lead.willingToPay,
    wants_interview: lead.wantsInterview,
    contact_channel: lead.contactChannel ?? null,
    contact_value: lead.contactValue ?? null,
    consent: lead.consent,
    utm_source: lead.utmSource ?? null,
    utm_medium: lead.utmMedium ?? null,
    utm_campaign: lead.utmCampaign ?? null,
    referrer: lead.referrer ?? null,
    stage: deriveLeadStage(lead),
  };

  const { error } = await supabase.from("beta_leads").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({
        ok: true,
        duplicate: true,
      });
    }

    console.error("[beta-leads] failed to insert lead", error);

    return NextResponse.json(
      {
        ok: false,
        error: "신청 저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 500 },
    );
  }

  try {
    await sendLeadNotification(lead);
  } catch (notificationError) {
    console.error("[beta-leads] failed to send notification", notificationError);
  }

  return NextResponse.json({
    ok: true,
    duplicate: false,
  });
}
