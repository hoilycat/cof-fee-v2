# ☕ Cof/fee v2

> **“오늘 마신 커피가 내일의 두통이 되지 않게.”**

이 저장소는 **Cof/fee v2의 완성 상태를 보존한 스냅샷**입니다.<br>
YIE·GraphRAG를 실제로 연동한 후속 개발은 [Cof/fee v3](https://github.com/hoilycat/Cof-fee-V3)에서 이어집니다.

![version](https://img.shields.io/badge/version-2.0-6F4E37?style=flat-square)
![status](https://img.shields.io/badge/status-frozen-64748b?style=flat-square)
![React](https://img.shields.io/badge/React-4A2C2A?style=flat-square&logo=react&logoColor=C4956A)
![TypeScript](https://img.shields.io/badge/TypeScript-6F4E37?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-3B1F0A?style=flat-square&logo=vite&logoColor=C4956A)

## 🎯 프로젝트 소개

Cof/fee v2는 **React와 TypeScript로 만든 개인 맞춤형 카페인 관리 웹앱**입니다.<br>
음료를 마신 시간과 카페인 함량을 기록하면 체내 잔존량을 계산하고, 수면 가능 시간·금단성 두통 위험·캐릭터 상태를 함께 보여줍니다.

이 버전에서 구현한 기능은 다음과 같습니다.

- 브랜드 메뉴와 직접 입력을 지원하는 카페인 섭취 기록
- Jotai와 `localStorage`를 활용한 로컬 우선 데이터 보존
- 카페인 반감기 기반 실시간 잔존량 계산
- 현재 잔존량에 따른 수면 안전 안내
- 최근 섭취 간격을 활용한 금단·두통 위험 경고
- 줄인 커피 비용을 보여주는 치킨 지수
- 카페인 단계에 따라 달라지는 캐릭터와 배경
- 두통·피로 등 컨디션 기록 모달
- 4주 감량 목표와 주간 통계

> v2에는 FastAPI, Neo4j, ChromaDB, Tavily, LangChain 또는 실제 AI 챗봇이 포함되어 있지 않습니다.<br>
> 당시 기획 단계였던 AI 기능은 v3의 YIE 방향으로 이전하여 구현했습니다.

## ⚙️ 핵심 로직

카페인 계산 엔진은 다음 파일에 있습니다.

```text
cof-fee/src/hooks/useCaffeine.ts
cof-fee/src/hooks/useCaffeineStore.ts
cof-fee/src/lib/utiles.ts
cof-fee/src/lib/caffeineData.ts
```

원격 AI 서비스가 아닌 결정론적 로컬 계산을 사용하며, 기본 반감기 공식은 다음과 같습니다.

```text
현재 잔존량 = 최초 섭취량 × 0.5 ^ (경과 시간 / 개인 반감기)
```

성별·민감도·생리 여부 등의 사용자 설정을 반영해 개인 반감기를 조정합니다.

## 🛠 기술 스택

- **프론트엔드:** React, TypeScript, Vite
- **상태 관리:** Jotai
- **스타일링:** Tailwind CSS
- **애니메이션:** Framer Motion
- **차트:** Recharts
- **날짜 계산:** Day.js
- **데이터 저장:** Browser `localStorage`

## 📂 프로젝트 구조

```text
cof-fee/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Emoji3D.tsx
│   │   └── SymptomModal.tsx
│   ├── hooks/
│   │   ├── useCaffeine.ts
│   │   └── useCaffeineStore.ts
│   ├── lib/
│   │   ├── caffeineData.ts
│   │   ├── constants.ts
│   │   └── utiles.ts
│   └── pages/
│       ├── Onboarding/
│       ├── Dashboard/
│       ├── AddDrink/
│       ├── History/
│       ├── Goals/
│       ├── Stats/
│       └── Settings/
└── package.json
```

## 🚀 실행 방법

```bash
cd cof-fee
npm install
npm run dev
```

## 🧬 버전 구분

- **v1:** Python·Streamlit 기반 카페인 계산기
- **v2:** React 기반 로컬 카페인 관리 웹앱 — 현재 저장소
- **v3:** YIE와 연결한 AI 인사이트·코칭 확장 버전
