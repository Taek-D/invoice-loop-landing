import Link from "next/link";

const sections = [
  {
    title: "수집 항목",
    body: "이름, 이메일, 직군, 월 청구 건수, 현재 워크플로우, 가장 큰 불편, 가격 의향, 인터뷰 희망 여부, 선택적 연락 채널, 유입 경로 정보를 수집합니다.",
  },
  {
    title: "이용 목적",
    body: "베타 신청 검토, 인터뷰 안내, 출시 소식 전달, 유입 채널 분석, 제품 우선순위 결정을 위해 사용합니다.",
  },
  {
    title: "보관 기간",
    body: "검증 프로젝트 종료 후 12개월 이내 파기합니다. 삭제 요청이 오면 더 빨리 지울 수 있습니다.",
  },
  {
    title: "삭제 요청",
    body: "수집 정보 삭제를 원하시면 운영 메일로 요청해 주세요. 현재 운영 메일은 NOTIFY_EMAIL 환경변수에 설정한 주소를 기준으로 운영합니다.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 sm:px-10">
      <section className="w-full rounded-[36px] border border-black/8 bg-white/82 p-8 shadow-[0_30px_90px_rgba(42,24,16,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">
          개인정보 처리 안내
        </h1>
        <p className="mt-4 leading-8 text-[var(--muted)]">
          청구루프 베타 신청 폼은 제품 검증과 인터뷰 운영을 위한 최소 정보만
          수집합니다.
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[28px] border border-black/8 bg-[var(--card)] p-5"
            >
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            className="rounded-full border border-black/10 px-4 py-2 transition hover:border-black/20 hover:bg-white"
          >
            랜딩으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
