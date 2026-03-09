# 보안 감사 리포트

**프로젝트:** invoice-loop-landing (청구루프 MVP 랜딩)
**점검일:** 2026-03-10
**점검 범위:** 8개 카테고리, src/ 전체 + 설정 파일 분석

## 요약

| 심각도 | 발견 수 |
|--------|---------|
| CRITICAL | 0 |
| HIGH | 1 |
| MEDIUM | 2 |
| LOW | 1 |
| **총계** | **4** |

## 발견된 취약점

---

### [HIGH-1] API 엔드포인트에 Rate Limiting 없음

- **심각도:** HIGH
- **카테고리:** Rate Limiting
- **위치:** `src/app/api/beta-leads/route.ts`
- **설명:** `POST /api/beta-leads` 엔드포인트에 rate limit이 전혀 없음. 무제한 요청이 가능하여 DB 스팸, Resend 이메일 남용(키 설정 시), Supabase 쿼리 과부하가 발생할 수 있음.
- **영향:** 공격자가 자동화 스크립트로 수천 건의 가짜 신청을 삽입하거나, Resend 무료 할당량(일 100건)을 소진시킬 수 있음.
- **수정 방법:**

  ```bash
  pnpm add @upstash/ratelimit @upstash/redis
  ```

  ```typescript
  // src/lib/rate-limit.ts
  import { Ratelimit } from "@upstash/ratelimit";
  import { Redis } from "@upstash/redis";

  export const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"), // 분당 5회
  });
  ```

  ```typescript
  // route.ts 상단에 추가
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { ok: false, error: "너무 많은 요청입니다. 잠시 후 다시 시도해 주세요." },
      { status: 429 }
    );
  }
  ```

  **대안 (외부 의존 없이):** Vercel Edge Middleware + Map 기반 간이 rate limiter 또는 Vercel WAF 설정.

---

### [MEDIUM-1] 알림 이메일 HTML Injection

- **심각도:** MEDIUM
- **카테고리:** 정보 노출 / XSS
- **위치:** `src/lib/notify.ts:42-63`
- **설명:** 사용자 입력값(`input.name`, `input.biggestPain` 등)이 HTML 이스케이프 없이 이메일 템플릿에 직접 삽입됨. `<script>` 태그나 악성 HTML을 폼에 입력하면 운영자 알림 이메일에 그대로 포함됨.
- **영향:** 대부분의 이메일 클라이언트가 script를 차단하지만, 피싱 링크나 이미지 삽입을 통한 소셜 엔지니어링 공격 가능. 이메일 subject에도 name이 직접 들어감.
- **수정 방법:**

  ```typescript
  // src/lib/notify.ts 상단에 추가
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 템플릿 내에서 사용
  // 수정 전
  <p><strong>이름</strong>: ${input.name}</p>
  // 수정 후
  <p><strong>이름</strong>: ${escapeHtml(input.name)}</p>
  ```

  모든 `${input.*}` 값에 `escapeHtml()` 적용 필요.

---

### [MEDIUM-2] 보안 헤더 미설정

- **심각도:** MEDIUM
- **카테고리:** 정보 노출
- **위치:** `next.config.ts`
- **설명:** `next.config.ts`가 비어 있어 보안 관련 HTTP 헤더가 전혀 설정되지 않음. CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy 등이 누락됨.
- **영향:** 클릭재킹(iframe 삽입), MIME 스니핑, 외부 리소스 인젝션 등에 노출 가능.
- **수정 방법:**

  ```typescript
  // next.config.ts
  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ],
        },
      ];
    },
  };

  export default nextConfig;
  ```

---

### [LOW-1] console.error로 서버 로그에 내부 에러 기록

- **심각도:** LOW
- **카테고리:** 정보 노출
- **위치:** `src/app/api/beta-leads/route.ts:77, 91`
- **설명:** Supabase 에러 객체와 Resend 에러가 `console.error`로 서버 로그에 출력됨. 클라이언트에는 노출되지 않지만, Vercel 로그에 DB 스키마 정보나 API 키 관련 에러 메시지가 남을 수 있음.
- **영향:** 로그 접근 권한이 있는 사람이 내부 구조를 파악할 수 있음. 현재 위험도는 낮음.
- **수정 방법:** 프로덕션 로깅 시 에러 세부사항을 필터링하거나 구조화된 로깅 사용 권장. 현재 수준에서는 즉시 조치 불필요.

---

## 점검 통과 항목

| 카테고리 | 상태 | 비고 |
|---------|------|------|
| 환경변수/시크릿 노출 | PASS | `.env*` gitignore 적용, 하드코딩 없음, service_role 서버 전용 |
| 인증/인가 | PASS | 공개 베타 폼이므로 인증 불필요, admin 클라이언트 서버 전용 |
| 파일 업로드 | N/A | 업로드 기능 없음 |
| 스토리지 보안 | N/A | Storage 미사용 |
| Prompt Injection | N/A | AI 기능 없음 |
| 의존성 취약점 | PASS | `pnpm audit` 0 vulnerabilities (477 packages) |
| RLS | PASS | `beta_leads` 테이블 RLS 활성화, service_role만 우회 |

## 우선순위 액션 아이템

| 순위 | 심각도 | 난이도 | 액션 | 예상 소요시간 |
|------|--------|--------|------|---------------|
| 1 | HIGH | 중간 | API 라우트에 rate limiting 추가 | 20분 |
| 2 | MEDIUM | 낮음 | 알림 이메일 HTML 이스케이프 적용 | 10분 |
| 3 | MEDIUM | 낮음 | next.config.ts에 보안 헤더 추가 | 10분 |
| 4 | LOW | - | console.error 구조화 (선택) | - |

## 권장사항

1. **Rate limiting 우선 적용** — Upstash Redis 연동이 가장 확실하나, MVP 단계에서는 Vercel의 WAF/Firewall Rules로 IP당 요청 제한을 거는 것도 방법
2. **Resend 키 설정 전에 HTML 이스케이프 먼저 적용** — 이메일 발송이 활성화되면 즉시 악용 가능
3. **보안 헤더는 빠르게 적용 가능** — next.config.ts에 복사만 하면 됨
