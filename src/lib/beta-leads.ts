import { z } from "zod";

export const roleSegments = [
  "designer",
  "video_editor",
  "studio",
  "other",
] as const;

export const monthlyInvoiceCounts = [
  "under_5",
  "five_to_ten",
  "eleven_to_twenty",
  "over_twenty",
] as const;

export const willingnessOptions = [
  "yes_9900",
  "yes_19900",
  "not_sure",
  "no",
] as const;

export const contactChannels = ["open_chat", "instagram"] as const;

export const betaLeadStages = [
  "new",
  "qualified",
  "interview_booked",
  "interviewed",
  "paid_intent",
  "closed",
] as const;

export type RoleSegment = (typeof roleSegments)[number];
export type MonthlyInvoiceCount = (typeof monthlyInvoiceCounts)[number];
export type WillingToPay = (typeof willingnessOptions)[number];
export type ContactChannel = (typeof contactChannels)[number];
export type BetaLeadStage = (typeof betaLeadStages)[number];

export const roleSegmentLabels: Record<RoleSegment, string> = {
  designer: "프리랜서 디자이너",
  video_editor: "프리랜서 영상편집자",
  studio: "소형 스튜디오 / 촬영팀",
  other: "기타 외주형 크리에이티브",
};

export const monthlyInvoiceLabels: Record<MonthlyInvoiceCount, string> = {
  under_5: "월 1~4건",
  five_to_ten: "월 5~10건",
  eleven_to_twenty: "월 11~20건",
  over_twenty: "월 21건 이상",
};

export const willingnessLabels: Record<WillingToPay, string> = {
  yes_9900: "월 9,900원 정도면 써볼 의향이 있어요",
  yes_19900: "월 19,900원이어도 문제를 잘 풀면 가능해요",
  not_sure: "기능을 더 봐야 판단할 수 있어요",
  no: "유료로 쓸 생각은 아직 없어요",
};

export const contactChannelLabels: Record<ContactChannel, string> = {
  open_chat: "오픈채팅 링크",
  instagram: "인스타그램 아이디",
};

export type BetaLeadInput = {
  name: string;
  email: string;
  roleSegment: RoleSegment;
  monthlyInvoiceCount: MonthlyInvoiceCount;
  currentWorkflow: string;
  biggestPain: string;
  willingToPay: WillingToPay;
  wantsInterview: boolean;
  contactChannel?: ContactChannel;
  contactValue?: string;
  consent: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
};

export const betaLeadInputSchema = z
  .object({
    name: z.string().trim().min(1, "이름을 입력해 주세요.").max(80),
    email: z
      .string()
      .trim()
      .email("올바른 이메일 주소를 입력해 주세요.")
      .max(160),
    roleSegment: z.enum(roleSegments, {
      error: "직군을 선택해 주세요.",
    }),
    monthlyInvoiceCount: z.enum(monthlyInvoiceCounts, {
      error: "월 청구 건수를 선택해 주세요.",
    }),
    currentWorkflow: z
      .string()
      .trim()
      .min(2, "지금 쓰는 방식도 알려주세요.")
      .max(120),
    biggestPain: z
      .string()
      .trim()
      .min(8, "가장 큰 불편을 조금만 더 자세히 적어 주세요.")
      .max(600),
    willingToPay: z.enum(willingnessOptions, {
      error: "가격 의향을 선택해 주세요.",
    }),
    wantsInterview: z.boolean(),
    contactChannel: z.enum(contactChannels).optional(),
    contactValue: z.string().trim().max(160).optional(),
    consent: z.literal(true, {
      error: "개인정보 수집 동의가 필요합니다.",
    }),
    utmSource: z.string().trim().max(160).optional(),
    utmMedium: z.string().trim().max(160).optional(),
    utmCampaign: z.string().trim().max(160).optional(),
    referrer: z.string().trim().max(500).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.contactChannel && !value.contactValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contactValue"],
        message: "연락처 값을 입력해 주세요.",
      });
    }

    if (!value.contactChannel && value.contactValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contactChannel"],
        message: "연락 채널을 먼저 선택해 주세요.",
      });
    }
  });

export function deriveLeadStage(input: BetaLeadInput): BetaLeadStage {
  if (input.wantsInterview) {
    return "qualified";
  }

  if (
    input.willingToPay === "yes_9900" ||
    input.willingToPay === "yes_19900"
  ) {
    return "qualified";
  }

  return "new";
}
