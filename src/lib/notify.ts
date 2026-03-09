import { Resend } from "resend";

import {
  contactChannelLabels,
  monthlyInvoiceLabels,
  roleSegmentLabels,
  willingnessLabels,
} from "@/lib/beta-leads";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type LeadNotificationInput = {
  name: string;
  email: string;
  roleSegment: keyof typeof roleSegmentLabels;
  monthlyInvoiceCount: keyof typeof monthlyInvoiceLabels;
  currentWorkflow: string;
  biggestPain: string;
  willingToPay: keyof typeof willingnessLabels;
  wantsInterview: boolean;
  contactChannel?: keyof typeof contactChannelLabels;
  contactValue?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
};

export async function sendLeadNotification(input: LeadNotificationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return;
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to,
    subject: `[청구루프] 새 베타 신청 - ${escapeHtml(input.name)}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 16px;">새 베타 신청이 들어왔습니다.</h2>
        <p><strong>이름</strong>: ${escapeHtml(input.name)}</p>
        <p><strong>이메일</strong>: ${escapeHtml(input.email)}</p>
        <p><strong>직군</strong>: ${roleSegmentLabels[input.roleSegment]}</p>
        <p><strong>월 청구 건수</strong>: ${monthlyInvoiceLabels[input.monthlyInvoiceCount]}</p>
        <p><strong>현재 워크플로우</strong>: ${escapeHtml(input.currentWorkflow)}</p>
        <p><strong>가장 큰 불편</strong>: ${escapeHtml(input.biggestPain)}</p>
        <p><strong>지불 의향</strong>: ${willingnessLabels[input.willingToPay]}</p>
        <p><strong>인터뷰 희망</strong>: ${input.wantsInterview ? "예" : "아니오"}</p>
        <p><strong>추가 연락 채널</strong>: ${
          input.contactChannel
            ? `${contactChannelLabels[input.contactChannel]} / ${
                escapeHtml(input.contactValue ?? "-")
              }`
            : "없음"
        }</p>
        <p><strong>UTM Source</strong>: ${escapeHtml(input.utmSource ?? "-")}</p>
        <p><strong>UTM Medium</strong>: ${escapeHtml(input.utmMedium ?? "-")}</p>
        <p><strong>UTM Campaign</strong>: ${escapeHtml(input.utmCampaign ?? "-")}</p>
        <p><strong>Referrer</strong>: ${escapeHtml(input.referrer ?? "-")}</p>
      </div>
    `,
  });
}
