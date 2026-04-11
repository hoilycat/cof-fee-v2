# cof-fee-v2
☕ Cof/fee v2"오늘 마신 커피가 내일의 두통이 되지 않게."카페인 주기 계산기 & 스마트 디톡스 매니저🎯 프로젝트 정체성 (Identity)핵심 가치: 양(Quantity) 조절 + 시간(Time) 관리 = 부작용 없는 건강한 커피 생활슬로건: 카페인, 마시는 시간까지 관리해야 진짜다.핵심 타겟: 카페인 중독으로 인한 두통(금단 현상)을 예방하고, 안전하게 커피를 즐기고 싶은 모든 사용자✨ 핵심 기능 (Core Features)기능상세 내용비유 및 로직스마트 기록기브랜드/메뉴별 카페인 자동 계산 및 마신 시간 정밀 기록📸 찰칵! 마신 시간 저장하기실시간 잔존량반감기 로직을 적용해 체내 카페인 농도 시각화⏳ 시간이 흐를수록 줄어드는 모래시계두통 예보마지막 섭취 후 12~24시간 뒤 금단 증상 위험 시간 알림☔️ 비 오기 전 우산을 챙기듯 두통 대비수면 신호등카페인 농도에 따른 수면 가능 여부 시각화 (🟢/🟡/🔴)🛌 지금 자면 꿀잠잘 수 있을까?리액션 콩카페인 수치에 따른 캐릭터의 4단계 상태 변화 및 조언🥜 콩: "지금 마시면 밤에 잠 못 잔다구!"치킨 지수커피를 참아 아낀 돈을 '치킨 마리 수'로 환산🍗 커피 10잔 참으면 치킨 한 마리 득템!📉 핵심 알고리즘 (Algorithm)본 서비스는 카페인 반감기($halfLife \approx 5$시간)를 기반으로 체내 잔존량을 계산합니다.$$C_{now} = C_{initial} \times 0.5^{\frac{t}{halfLife}}$$$C_{now}$: 현재 체내 잔존량$C_{initial}$: 초기 섭취량$t$: 섭취 후 경과 시간🛠️ 기술 스택 (Tech Stack)Frontend: React, TypeScript, ViteStyling: Tailwind CSSState Management: JotaiVisualization: RechartsDate Library: Day.js📂 프로젝트 구조 (Project Structure)가독성과 유지보수를 극대화한 미니멀리스트 구조를 채택했습니다.Plaintextsrc/
 ├ assets/             # 콩 캐릭터 상태별 이미지(0~4.png), 로고
 ├ components/         # 기능별 UI 컴포넌트
 │  ├ Home/            # 대시보드 (신호등, 캐릭터, 잔존량)
 │  ├ History/         # 섭취 기록 리스트 및 통계
 │  └ Form/            # 음료 추가 입력 폼
 ├ store/              # 전역 상태 및 비즈니스 로직
 │  ├ atoms.ts         # Jotai Atoms (logs, goal 등)
 │  └ hooks.ts         # 반감기 및 두통 예보 계산 로직
 ├ App.tsx             # 라우팅 및 레이아웃
 └ main.tsx
