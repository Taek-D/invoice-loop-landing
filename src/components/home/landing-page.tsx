"use client";

import posthog from "posthog-js";
import { Suspense, useMemo, useState } from "react";

import { BetaForm } from "@/components/home/beta-form";
import {
  betaPerks,
  faqItems,
  segmentContent,
  type HomeSegment,
  validationMetrics,
} from "@/lib/landing-content";

const segmentTabs: { key: HomeSegment; label: string; subtitle: string }[] = [
  {
    key: "designer",
    label: "프리랜서 디자이너",
    subtitle: "브랜딩, 상세페이지, 패키지 디자인",
  },
  {
    key: "video_editor",
    label: "프리랜서 영상편집자",
    subtitle: "쇼츠, 롱폼, 인터뷰 편집 외주",
  },
];

function captureEvent(event: string, properties: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.capture(event, properties);
}

export function LandingPage() {
  const [activeSegment, setActiveSegment] = useState<HomeSegment>("designer");
  const content = useMemo(
    () => segmentContent[activeSegment],
    [activeSegment],
  );

  function scrollToId(id: string, label: string) {
    captureEvent("cta_click", {
      label,
      location: "landing_page",
      activeSegment,
    });

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[var(--secondary-soft)] blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex flex-col gap-4 rounded-[28px] border border-black/8 bg-white/70 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              InvoiceLoop Beta
            </p>
            <h1 className="mt-2 text-xl font-semibold text-[var(--ink)]">
              청구루프
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              onClick={() => scrollToId("preview", "preview")}
              className="rounded-full border border-black/10 px-4 py-2 transition hover:border-black/20 hover:bg-white"
            >
              대시보드 미리보기
            </button>
            <button
              type="button"
              onClick={() => scrollToId("beta-form", "hero_primary")}
              className="rounded-full bg-[var(--ink)] px-4 py-2 font-medium text-white transition hover:bg-[var(--ink-strong)]"
            >
              베타 신청하기
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.03fr_0.97fr]">
          <div className="rounded-[38px] border border-black/8 bg-[var(--panel)] p-8 shadow-[0_30px_100px_rgba(48,28,18,0.08)] sm:p-10">
            <span className="inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
              유료 의향 검증용 베타
            </span>
            <h2 className="mt-5 text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-3xl">
              외주 크리에이티브 프리랜서를 위한
              <br />
              견적 · 청구 · 입금 관리
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              카톡으로 받은 일을, 돈이 들어올 때까지 추적하세요. 청구루프는
              견적부터 청구, 입금 확인, 연체 리마인더까지 한 흐름으로 묶어
              보여주는 초경량 정산 도구를 검증하고 있습니다.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-[auto_auto] sm:items-center">
              <button
                type="button"
                onClick={() => scrollToId("beta-form", "hero_primary")}
                className="rounded-full bg-[var(--accent)] px-6 py-3 font-medium text-[var(--ink)] transition hover:bg-[var(--accent-strong)] hover:text-white"
              >
                베타 신청하고 인터뷰 의사 남기기
              </button>
              <button
                type="button"
                onClick={() => scrollToId("preview", "hero_secondary")}
                className="rounded-full border border-black/10 px-6 py-3 font-medium text-[var(--ink)] transition hover:border-black/20 hover:bg-white"
              >
                직군별 미리보기 보기
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {validationMetrics.map((metric) => (
                <div
                  key={metric}
                  className="rounded-[24px] border border-black/8 bg-white/80 p-4"
                >
                  <p className="text-sm leading-6 text-[var(--muted)]">{metric}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[38px] border border-black/8 bg-[var(--ink)] p-6 text-white shadow-[0_30px_100px_rgba(21,15,10,0.16)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              Beta Perks
            </p>
            <h3 className="mt-3 text-xl font-semibold">
              첫 20명에게 먼저 줄 혜택
            </h3>
            <div className="mt-6 space-y-3">
              {betaPerks.map((perk) => (
                <div
                  key={perk}
                  className="rounded-[24px] bg-white/8 px-4 py-4 text-sm leading-6 text-white/80"
                >
                  {perk}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] border border-white/8 bg-white/8 p-5">
              <p className="text-sm text-white/60">지금 검증하려는 것</p>
              <p className="mt-3 text-lg font-semibold">
                신청 전환율 5% 이상, 인터뷰 의사율 30% 이상
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                단순 관심이 아니라, 실제로 돈 문제를 해결하기 위해 이 도구에
                비용을 낼 의향이 있는지 확인하고 있습니다.
              </p>
            </div>
          </aside>
        </section>

        <section className="rounded-[36px] border border-black/8 bg-white/72 p-8 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            Segment Toggle
          </p>
          <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
            가장 먼저 깊게 풀 타깃을 전환해서 볼 수 있어요
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
            제품 구조는 넓게 가되, 메시지는 직군별로 더 선명해야 전환율이
            나옵니다. 아래 전환 UI는 실제로 검증하려는 방향 그대로입니다.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {segmentTabs.map((segment) => (
              <button
                key={segment.key}
                type="button"
                aria-pressed={activeSegment === segment.key}
                onClick={() => {
                  setActiveSegment(segment.key);
                  captureEvent("role_toggle", {
                    selectedSegment: segment.key,
                  });
                }}
                className={`rounded-[28px] border px-5 py-5 text-left transition ${
                  activeSegment === segment.key
                    ? "border-[var(--accent)] bg-white shadow-[0_18px_50px_rgba(46,28,18,0.08)]"
                    : "border-black/8 bg-[var(--card)]"
                }`}
              >
                <p className="text-lg font-semibold text-[var(--ink)]">
                  {segment.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {segment.subtitle}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
          <article className="rounded-[34px] border border-black/8 bg-white/72 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Selected Flow
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
              {content.badge}
            </h3>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              {content.subheadline}
            </p>
            <div className="mt-6 rounded-[28px] bg-[var(--ink)] p-6 text-white">
              <p className="text-sm font-medium text-white/60">
                {content.painTitle}
              </p>
              <div className="mt-4 space-y-3">
                {content.pains.map((pain) => (
                  <div
                    key={pain}
                    className="rounded-[20px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/80"
                  >
                    {pain}
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[34px] border border-black/8 bg-[var(--secondary-soft)]/55 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Proposed Solution
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
              견적부터 입금까지 하나의 흐름으로 묶습니다
            </h3>
            <p className="mt-4 leading-7 text-[var(--muted)]">
              {content.solution}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {content.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-[24px] p-4 ${
                    metric.tone === "dark"
                      ? "bg-[var(--ink)] text-white"
                      : metric.tone === "warm"
                        ? "bg-[var(--accent-soft)] text-[var(--ink)]"
                        : "bg-white text-[var(--ink)]"
                  }`}
                >
                  <p className="text-sm opacity-75">{metric.label}</p>
                  <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section
          id="preview"
          className="grid gap-6 rounded-[36px] border border-black/8 bg-white/75 p-8 lg:grid-cols-[0.92fr_1.08fr]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Document Examples
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
              직군별 예시 문서와 청구 금액
            </h3>
            <div className="mt-6 space-y-4">
              {content.documents.map((document) => (
                <div
                  key={document.title}
                  className="rounded-[28px] border border-black/8 bg-[var(--card)] px-5 py-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-[var(--ink)]">
                        {document.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {document.detail}
                      </p>
                    </div>
                    <p className="font-mono text-lg text-[var(--accent-strong)]">
                      {document.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[var(--ink)] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                  Dashboard Preview
                </p>
                <h3 className="mt-3 text-xl font-semibold">
                  지금 추적할 돈이 보이는 화면
                </h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/70">
                {segmentTabs.find((segment) => segment.key === activeSegment)?.label}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {content.metrics.map((metric) => (
                <div key={metric.label} className="rounded-[22px] bg-white/8 p-4">
                  <p className="text-sm text-white/60">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {content.activity.map((item) => (
                <div
                  key={`${item.client}-${item.project}`}
                  className="rounded-[24px] bg-white/8 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-white/55">{item.client}</p>
                      <p className="mt-1 font-medium">{item.project}</p>
                    </div>
                    <div className="text-sm text-white/70 sm:text-right">
                      <p>{item.due}</p>
                      <p className="mt-1">{item.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[34px] border border-black/8 bg-[var(--secondary-soft)]/45 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              FAQ
            </p>
            <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
              베타 신청 전에 많이 물을 질문
            </h3>
            <div className="mt-6 space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[24px] border border-black/8 bg-white/75 px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-medium text-[var(--ink)]">
                    {item.question}
                  </summary>
                  <p className="mt-3 leading-7 text-[var(--muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <Suspense
            fallback={
              <div className="rounded-[32px] border border-black/8 bg-white/85 p-8 shadow-[0_24px_80px_rgba(49,27,16,0.08)]">
                <p className="text-sm text-[var(--muted)]">
                  신청 폼을 불러오는 중입니다...
                </p>
              </div>
            }
          >
            <BetaForm preferredSegment={activeSegment} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
