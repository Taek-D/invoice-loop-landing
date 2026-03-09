"use client";

import posthog from "posthog-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  betaLeadInputSchema,
  contactChannelLabels,
  type ContactChannel,
  monthlyInvoiceLabels,
  type MonthlyInvoiceCount,
  roleSegmentLabels,
  type RoleSegment,
  willingnessLabels,
  type WillingToPay,
} from "@/lib/beta-leads";
import type { HomeSegment } from "@/lib/landing-content";

const workflowOptions = [
  "카톡 + 엑셀",
  "카톡 + 노션",
  "스프레드시트",
  "기존 회계 / ERP 툴",
  "기타",
] as const;

type BetaFormProps = {
  preferredSegment: HomeSegment;
};

type FormState = {
  name: string;
  email: string;
  roleSegment: RoleSegment;
  monthlyInvoiceCount: MonthlyInvoiceCount;
  currentWorkflow: string;
  biggestPain: string;
  willingToPay: WillingToPay;
  wantsInterview: boolean;
  contactChannel: ContactChannel | "";
  contactValue: string;
  consent: boolean;
};

function captureEvent(event: string, properties: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.capture(event, properties);
}

export function BetaForm({ preferredSegment }: BetaFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    roleSegment: preferredSegment,
    monthlyInvoiceCount: "under_5",
    currentWorkflow: workflowOptions[0],
    biggestPain: "",
    willingToPay: "not_sure",
    wantsInterview: false,
    contactChannel: "",
    contactValue: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      roleSegment:
        current.roleSegment === "studio" || current.roleSegment === "other"
          ? current.roleSegment
          : preferredSegment,
    }));
  }, [preferredSegment]);

  const utmValues = useMemo(
    () => ({
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
    }),
    [searchParams],
  );

  function markStarted() {
    if (started) {
      return;
    }

    setStarted(true);
    captureEvent("form_start", {
      location: "beta_form",
      preferredSegment,
    });
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    markStarted();
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      roleSegment: form.roleSegment,
      monthlyInvoiceCount: form.monthlyInvoiceCount,
      currentWorkflow: form.currentWorkflow,
      biggestPain: form.biggestPain.trim(),
      willingToPay: form.willingToPay,
      wantsInterview: form.wantsInterview,
      contactChannel: form.contactChannel || undefined,
      contactValue: form.contactValue.trim() || undefined,
      consent: form.consent,
      ...utmValues,
      referrer: document.referrer || undefined,
    };

    const parsed = betaLeadInputSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).flatMap(
            ([field, messages]) =>
              messages && messages[0] ? [[field, messages[0]]] : [],
          ),
        ),
      );
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/beta-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        duplicate?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "신청을 저장하는 중 문제가 생겼습니다.");
      }

      captureEvent("form_submit", {
        roleSegment: parsed.data.roleSegment,
        monthlyInvoiceCount: parsed.data.monthlyInvoiceCount,
        willingToPay: parsed.data.willingToPay,
        wantsInterview: parsed.data.wantsInterview,
        duplicate: Boolean(result.duplicate),
      });

      if (parsed.data.wantsInterview) {
        captureEvent("interview_request", {
          source: "beta_form_submit",
          roleSegment: parsed.data.roleSegment,
        });
      }

      const params = new URLSearchParams({
        segment: parsed.data.roleSegment,
        wantsInterview: parsed.data.wantsInterview ? "1" : "0",
      });

      if (result.duplicate) {
        params.set("duplicate", "1");
      }

      router.push(`/thanks?${params.toString()}`);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      id="beta-form"
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-black/8 bg-white/85 p-6 shadow-[0_24px_80px_rgba(49,27,16,0.08)] sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            Beta Application
          </p>
          <h2 className="mt-3 text-xl font-semibold text-[var(--ink)]">
            베타 신청과 인터뷰 의향을 함께 받아요
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
            단순 대기명단이 아니라, 실제로 돈 문제를 겪고 있는 분을 먼저 찾고
            있습니다. 첫 20명은 2개월 무료와 얼리버드 가격을 우선 제안합니다.
          </p>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-2 text-xs font-medium text-[var(--accent-strong)]">
          2분 내 완료
        </span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--ink)]">이름</span>
          <input
            className="rounded-2xl border border-black/10 bg-[var(--card)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            value={form.name}
            onFocus={markStarted}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="홍길동"
          />
          {errors.name ? <span className="text-sm text-[var(--danger)]">{errors.name}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--ink)]">이메일</span>
          <input
            className="rounded-2xl border border-black/10 bg-[var(--card)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            type="email"
            value={form.email}
            onFocus={markStarted}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="name@example.com"
          />
          {errors.email ? <span className="text-sm text-[var(--danger)]">{errors.email}</span> : null}
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <fieldset className="rounded-[28px] border border-black/8 bg-[var(--card)] p-5">
          <legend className="px-2 text-sm font-medium text-[var(--ink)]">현재 직군</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.entries(roleSegmentLabels) as [RoleSegment, string][]).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                  form.roleSegment === value ? "border-[var(--accent)] bg-white" : "border-black/8 bg-white/60"
                }`}
              >
                <input
                  type="radio"
                  name="roleSegment"
                  className="mt-1"
                  checked={form.roleSegment === value}
                  onFocus={markStarted}
                  onChange={() => updateField("roleSegment", value)}
                />
                <span className="text-sm text-[var(--ink)]">{label}</span>
              </label>
            ))}
          </div>
          {errors.roleSegment ? <span className="mt-3 block text-sm text-[var(--danger)]">{errors.roleSegment}</span> : null}
        </fieldset>

        <div className="grid gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--ink)]">월 청구 건수</span>
            <select
              className="rounded-2xl border border-black/10 bg-[var(--card)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              value={form.monthlyInvoiceCount}
              onFocus={markStarted}
              onChange={(event) => updateField("monthlyInvoiceCount", event.target.value as MonthlyInvoiceCount)}
            >
              {(Object.entries(monthlyInvoiceLabels) as [MonthlyInvoiceCount, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.monthlyInvoiceCount ? <span className="text-sm text-[var(--danger)]">{errors.monthlyInvoiceCount}</span> : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--ink)]">지금 주로 쓰는 방식</span>
            <select
              className="rounded-2xl border border-black/10 bg-[var(--card)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              value={form.currentWorkflow}
              onFocus={markStarted}
              onChange={(event) => updateField("currentWorkflow", event.target.value)}
            >
              {workflowOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.currentWorkflow ? <span className="text-sm text-[var(--danger)]">{errors.currentWorkflow}</span> : null}
          </label>
        </div>
      </div>

      <label className="mt-6 flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--ink)]">지금 가장 큰 불편</span>
        <textarea
          className="min-h-32 rounded-[28px] border border-black/10 bg-[var(--card)] px-4 py-4 outline-none transition focus:border-[var(--accent)]"
          value={form.biggestPain}
          onFocus={markStarted}
          onChange={(event) => updateField("biggestPain", event.target.value)}
          placeholder="예: 청구는 했는데 언제 입금되는지 계속 카톡을 다시 찾게 돼요."
        />
        {errors.biggestPain ? <span className="text-sm text-[var(--danger)]">{errors.biggestPain}</span> : null}
      </label>

      <fieldset className="mt-6 rounded-[28px] border border-black/8 bg-[var(--card)] p-5">
        <legend className="px-2 text-sm font-medium text-[var(--ink)]">가격 의향</legend>
        <div className="mt-4 grid gap-3">
          {(Object.entries(willingnessLabels) as [WillingToPay, string][]).map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                form.willingToPay === value ? "border-[var(--accent)] bg-white" : "border-black/8 bg-white/60"
              }`}
            >
              <input
                type="radio"
                name="willingToPay"
                className="mt-1"
                checked={form.willingToPay === value}
                onFocus={markStarted}
                onChange={() => updateField("willingToPay", value)}
              />
              <span className="text-sm leading-6 text-[var(--ink)]">{label}</span>
            </label>
          ))}
        </div>
        {errors.willingToPay ? <span className="mt-3 block text-sm text-[var(--danger)]">{errors.willingToPay}</span> : null}
      </fieldset>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <label className="rounded-[28px] border border-black/8 bg-[var(--ink)] p-5 text-white">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.wantsInterview}
              onFocus={markStarted}
              onChange={(event) => updateField("wantsInterview", event.target.checked)}
              className="mt-1"
            />
            <div>
              <span className="font-medium">짧은 인터뷰에 참여할 수 있어요</span>
              <p className="mt-2 text-sm leading-6 text-white/70">
                15분 내외로 현재 정산 방식과 불편을 듣고 있습니다. 인터뷰 희망자는 성공 페이지에서 바로 예약 링크를 볼 수 있습니다.
              </p>
            </div>
          </div>
        </label>

        <div className="rounded-[28px] border border-black/8 bg-[var(--card)] p-5">
          <p className="text-sm font-medium text-[var(--ink)]">추가 연락 채널</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            이메일 외에 더 편한 연락 방식이 있으면 남겨 주세요. 선택 사항입니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {(Object.entries(contactChannelLabels) as [ContactChannel, string][]).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  form.contactChannel === value ? "border-[var(--accent)] bg-white text-[var(--ink)]" : "border-black/8 bg-white/70 text-[var(--muted)]"
                }`}
              >
                <input
                  type="radio"
                  name="contactChannel"
                  checked={form.contactChannel === value}
                  onFocus={markStarted}
                  onChange={() => updateField("contactChannel", value)}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-3">
            <input
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[var(--accent)]"
              value={form.contactValue}
              onFocus={markStarted}
              onChange={(event) => updateField("contactValue", event.target.value)}
              placeholder={form.contactChannel === "instagram" ? "@yourhandle" : "https://open.kakao.com/..."}
            />
            {form.contactChannel ? (
              <button
                type="button"
                className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-[var(--muted)] transition hover:bg-white"
                onClick={() => {
                  updateField("contactChannel", "");
                  updateField("contactValue", "");
                }}
              >
                지우기
              </button>
            ) : null}
          </div>
          {errors.contactChannel ? <span className="mt-2 block text-sm text-[var(--danger)]">{errors.contactChannel}</span> : null}
          {errors.contactValue ? <span className="mt-2 block text-sm text-[var(--danger)]">{errors.contactValue}</span> : null}
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-black/8 bg-[var(--card)] p-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.consent}
            onFocus={markStarted}
            onChange={(event) => updateField("consent", event.target.checked)}
            className="mt-1"
          />
          <span className="text-sm leading-7 text-[var(--muted)]">
            베타 신청과 인터뷰 운영을 위한 개인정보 수집에 동의합니다. 자세한 내용은{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--ink)] underline decoration-[var(--accent)] underline-offset-4"
            >
              개인정보 처리 안내
            </Link>
            에서 확인할 수 있습니다.
          </span>
        </label>
        {errors.consent ? <span className="mt-3 block text-sm text-[var(--danger)]">{errors.consent}</span> : null}
      </div>

      {formError ? (
        <div className="mt-6 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {formError}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--muted)]">
          신청 후 48시간 안에 검토 결과와 인터뷰 가능 여부를 메일로 알려드릴게요.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-6 py-3 font-medium text-white transition hover:bg-[var(--ink-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "신청 저장 중..." : "베타 신청 보내기"}
        </button>
      </div>
    </form>
  );
}
