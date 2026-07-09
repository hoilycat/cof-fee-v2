# Cof/fee v2

> "오늘 마신 커피가 내일의 두통이 되지 않게."

> This repository is frozen as a v2 snapshot. New YIE/GraphRAG work continues in [Cof/fee v3](https://github.com/hoilycat/Cof-fee-V3).

![version](https://img.shields.io/badge/version-2.0-6F4E37?style=flat-square)
![status](https://img.shields.io/badge/status-frozen-64748b?style=flat-square)
![React](https://img.shields.io/badge/React-4A2C2A?style=flat-square&logo=react&logoColor=C4956A)
![TypeScript](https://img.shields.io/badge/TypeScript-6F4E37?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-3B1F0A?style=flat-square&logo=vite&logoColor=C4956A)

## What This Version Implements

Cof/fee v2 is a React + TypeScript caffeine tracking prototype. It focuses on local-first caffeine logging, remaining-caffeine estimation, sleep guidance, withdrawal warnings, and a character-based dashboard.

Implemented in this repository:

- Caffeine intake logging with drink presets and custom amounts
- Local state persistence with Jotai storage
- Caffeine half-life calculation and remaining caffeine estimate
- Sleep traffic-light guidance based on current caffeine level
- Withdrawal/headache risk warnings based on recent intake gaps
- "Chicken index" savings motivation from skipped drinks
- Character status UI and symptom modal

The project does not contain a FastAPI backend, Neo4j, ChromaDB, Tavily, LangChain, or a live AI chatbot in this v2 repository. Those ideas were later moved into the v3/YIE direction.

## Core Logic

The main caffeine engine lives in:

```text
cof-fee/src/hooks/useCaffeine.ts
cof-fee/src/hooks/useCaffeineStore.ts
cof-fee/src/lib/utiles.ts
cof-fee/src/lib/caffeineData.ts
```

The current implementation uses deterministic local calculations rather than a remote AI service.

## Tech Stack

- React
- TypeScript
- Vite
- Jotai
- Tailwind CSS
- Framer Motion
- Recharts

## Project Structure

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
│   └── lib/
│       ├── caffeineData.ts
│       ├── constants.ts
│       └── utiles.ts
└── package.json
```

## Getting Started

```bash
cd cof-fee
npm install
npm run dev
```

## Version Note

- v1: Streamlit caffeine calculator
- v2: React local caffeine tracker, this repository
- v3: YIE-connected version with AI insight features

