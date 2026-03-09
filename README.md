# 청구루프 검증 MVP v2

외주형 크리에이티브 프리랜서를 위한 `견적 · 청구 · 입금 관리` 검증 랜딩 페이지입니다.

## 포함된 것

- 디자이너 / 영상편집자 전환형 카피
- 유료 의향 검증용 베타 신청 폼
- Supabase 저장 API (`POST /api/beta-leads`)
- Resend 운영자 알림
- PostHog 이벤트 추적
- `/thanks`, `/privacy` 페이지

## 시작하기

```bash
pnpm install
pnpm dev
```

개발 서버는 `http://localhost:3000` 에서 열립니다.

## 환경 변수

`.env.example` 파일을 참고해 `.env.local` 을 만드세요.

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFY_EMAIL`
- `FROM_EMAIL`
- `CALENDLY_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

## 성공 기준

- 2주 내 타깃 유입 300명 이상
- 베타 신청 25건 이상
- 인터뷰 희망 8건 이상
- 월 9,900원 이상 지불 의향 3명 이상

## 데이터베이스

실행 가능한 SQL 스키마는 `supabase/schema.sql` 에 있습니다.
