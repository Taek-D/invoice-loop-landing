import type { RoleSegment } from "@/lib/beta-leads";

export type HomeSegment = Extract<RoleSegment, "designer" | "video_editor">;

type SegmentContent = {
  badge: string;
  subheadline: string;
  painTitle: string;
  pains: string[];
  solution: string;
  documents: { title: string; detail: string; amount: string }[];
  metrics: { label: string; value: string; tone?: "warm" | "dark" }[];
  activity: { client: string; project: string; due: string; status: string }[];
};

export const segmentContent: Record<HomeSegment, SegmentContent> = {
  designer: {
    badge: "브랜딩 · 상세페이지 · 패키지 디자인",
    subheadline:
      "수정 범위와 잔금 일정이 자주 바뀌는 디자인 외주 흐름에 맞춘 검증 버전",
    painTitle: "디자인 외주에서 자주 생기는 정산 문제",
    pains: [
      "지난 견적서를 찾느라 조건을 다시 적고 있다",
      "수정 횟수와 잔금 일정을 카톡에서 다시 확인한다",
      "입금 전인데 파일 전달이 먼저 나가 버린 적이 있다",
    ],
    solution:
      "견적서와 청구서를 한 구조로 묶고, 수정 범위와 결제일을 함께 기록해 입금 전까지 추적합니다.",
    documents: [
      {
        title: "브랜드 가이드북 디자인",
        detail: "초안 2회 + 최종 납품본 포함",
        amount: "₩880,000",
      },
      {
        title: "상세페이지 리뉴얼",
        detail: "메인 1장 + 옵션 배너 4종",
        amount: "₩540,000",
      },
      {
        title: "패키지 라벨 디자인",
        detail: "시안 3종 + 인쇄용 파일 전달",
        amount: "₩420,000",
      },
    ],
    metrics: [
      { label: "이번 달 청구액", value: "₩2,350,000", tone: "warm" },
      { label: "입금 대기", value: "₩1,550,000" },
      { label: "연체 건수", value: "2건", tone: "dark" },
    ],
    activity: [
      {
        client: "오렌지 스튜디오",
        project: "브랜드 가이드북 디자인",
        due: "3월 12일",
        status: "입금 대기",
      },
      {
        client: "콜렉트랩",
        project: "상세페이지 리뉴얼",
        due: "3월 15일",
        status: "연체 2일",
      },
      {
        client: "모어마켓",
        project: "패키지 라벨 디자인",
        due: "3월 19일",
        status: "청구 예정",
      },
    ],
  },
  video_editor: {
    badge: "쇼츠 · 유튜브 편집 · 색보정 외주",
    subheadline:
      "건별 청구와 납품 마감이 많은 영상 편집자의 흐름에 맞춘 검증 버전",
    painTitle: "영상 편집 외주에서 자주 생기는 정산 문제",
    pains: [
      "건별 편집 단가가 달라서 이전 견적서를 계속 참고한다",
      "썸네일, 자막, 수정 컷 수를 따로 관리하느라 놓치는 항목이 생긴다",
      "납품 마감에 쫓기다 보니 입금 확인이 뒤로 밀린다",
    ],
    solution:
      "프로젝트별 견적 항목을 템플릿으로 저장하고, 청구일과 납품일 사이의 현금 흐름을 먼저 보여줍니다.",
    documents: [
      {
        title: "쇼츠 12편 편집",
        detail: "자막 + 컷편집 + 썸네일 4종",
        amount: "₩1,100,000",
      },
      {
        title: "인터뷰 영상 색보정",
        detail: "30분 원본 2편 기준",
        amount: "₩450,000",
      },
      {
        title: "브이로그 롱폼 편집",
        detail: "컷편집 + 사운드 정리",
        amount: "₩780,000",
      },
    ],
    metrics: [
      { label: "이번 달 청구액", value: "₩3,180,000", tone: "warm" },
      { label: "미수금", value: "₩1,920,000" },
      { label: "리마인더 예약", value: "4건", tone: "dark" },
    ],
    activity: [
      {
        client: "스텝업 미디어",
        project: "쇼츠 12편 편집",
        due: "3월 15일",
        status: "연체 2일",
      },
      {
        client: "무브필름",
        project: "인터뷰 영상 색보정",
        due: "3월 18일",
        status: "입금 대기",
      },
      {
        client: "스튜디오 헤이",
        project: "브이로그 롱폼 편집",
        due: "3월 20일",
        status: "청구 예정",
      },
    ],
  },
};

export const validationMetrics = [
  "2주 안에 타깃 유입 300명",
  "베타 신청 25건 이상",
  "인터뷰 희망 8건 이상",
  "월 9,900원 이상 지불 의향 3명 이상",
];

export const betaPerks = [
  "첫 20명은 2개월 무료",
  "얼리버드 가격 우선 제안",
  "직군별 템플릿 우선 반영",
  "인터뷰 참여자에게 출시 전 선공개",
];

export const faqItems = [
  {
    question: "지금 바로 쓸 수 있는 서비스인가요?",
    answer:
      "아직은 아닙니다. 지금은 디자인 외주와 영상 편집 외주의 정산 흐름을 가장 잘 푸는 방향을 검증하는 베타 단계입니다.",
  },
  {
    question: "왜 대기명단이 아니라 인터뷰 신청이라고 하나요?",
    answer:
      "관심 수집만으로는 제품 방향을 검증하기 어렵기 때문입니다. 실제로 돈 문제를 겪는 분과 짧게 대화하고, 유료 의향까지 확인하려고 합니다.",
  },
  {
    question: "요금은 얼마나 생각하고 있나요?",
    answer:
      "정식 출시 가격은 아직 확정하지 않았고, 폼에서 9,900원과 19,900원 가격 감도를 함께 테스트합니다. 베타 참여자에게는 2개월 무료와 얼리버드 가격을 제공합니다.",
  },
  {
    question: "어떤 직군까지 확장할 계획인가요?",
    answer:
      "초기 메시지는 디자이너와 영상편집자에 맞추되, 제품 구조는 크리에이티브 프리랜서 전체가 쓸 수 있게 설계합니다.",
  },
];
