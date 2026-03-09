"use client";

import posthog from "posthog-js";
import Link from "next/link";

type ThanksViewProps = {
  wantsInterview: boolean;
  duplicate: boolean;
  calendlyUrl?: string;
  roleLabel: string;
};

function captureEvent(event: string, properties: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }

  posthog.capture(event, properties);
}

export function ThanksView({
  wantsInterview,
  duplicate,
  calendlyUrl,
  roleLabel,
}: ThanksViewProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 sm:px-10">
      <section className="w-full rounded-[36px] border border-black/8 bg-white/82 p-8 shadow-[0_30px_90px_rgba(42,24,16,0.08)] sm:p-10">
        <span className="inline-flex rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
          Beta Application Saved
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-[var(--ink)]">
          신청이 저장됐습니다.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          {roleLabel} 흐름 기준으로 우선 검토한 뒤 48시간 안에 메일로
          연락드릴게요.
        </p>

        {duplicate ? (
          <div className="mt-6 rounded-[24px] border border-black/8 bg-[var(--card)] px-5 py-4 text-sm leading-7 text-[var(--muted)]">
            이미 같은 이메일로 신청해 두신 상태라 기존 신청을 기준으로 계속
            진행합니다. 새로 남긴 의도는 참고용으로만 확인할게요.
          </div>
        ) : null}

        {wantsInterview ? (
          <div className="mt-8 rounded-[28px] bg-[var(--ink)] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              Interview Flow
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              인터뷰 희망으로 표시해 두었습니다
            </h2>
            <p className="mt-3 leading-7 text-white/72">
              15분 내외로 현재 정산 방식과 불편을 듣고 있어요. 아래 버튼이
              보이면 바로 예약하고, 보이지 않으면 개별 연락을 기다려 주세요.
            </p>

            {calendlyUrl ? (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  captureEvent("interview_request", {
                    source: "thanks_page_cta",
                    roleLabel,
                  })
                }
                className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 font-medium text-[var(--ink)] transition hover:bg-[var(--accent-strong)] hover:text-white"
              >
                인터뷰 일정 예약하기
              </a>
            ) : (
              <div className="mt-5 rounded-2xl bg-white/8 px-4 py-4 text-sm leading-7 text-white/75">
                예약 링크는 아직 열어두지 않았어요. 48시간 안에 개별 연락으로
                인터뷰 일정을 조율하겠습니다.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-black/8 bg-[var(--card)] px-5 py-5 text-sm leading-7 text-[var(--muted)]">
            인터뷰는 체크하지 않으셨지만, 가격 의향과 불편 내용은 제품 우선순위
            결정에 반영됩니다. 출시 전 소식은 메일로 먼저 드릴게요.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            onClick={() =>
              captureEvent("cta_click", {
                location: "thanks_page",
                label: "back_to_home",
              })
            }
            className="rounded-full border border-black/10 px-4 py-2 transition hover:border-black/20 hover:bg-white"
          >
            랜딩으로 돌아가기
          </Link>
          <Link
            href="/privacy"
            className="rounded-full border border-black/10 px-4 py-2 transition hover:border-black/20 hover:bg-white"
          >
            개인정보 처리 안내
          </Link>
        </div>
      </section>
    </main>
  );
}
