import dayjs from "dayjs";
import type { CaffeineLog, UserProfile, SymptomLog } from '../hooks/useCaffeineStore';



/**
 * [타임머신] 모든 시간 계산의 기준점
 * 개발 모드에서 로컬 스토리지의 'debug-offset'을 읽어 현재 시간을 조작합니다.
 */
export const getNow = () => {
  const offset = Number(localStorage.getItem('debug-date-offset') || 0);
  return dayjs().add(offset, 'day');
};


/**
 * 1. 실시간 잔존량 계산 (지수적 감쇠 공식)
 * C_now = C_initial * (0.5)^(t / halfLife)
 */
export const calculateCurrentCaffeine = (mg: number, intakeTime: string, halfLife: number) => {
  const now = getNow();
  const diffHours = now.diff(dayjs(intakeTime), "hour", true);
  
  if (diffHours < 0) return mg;

  // 45~60분 사이 정점 (단순화를 위해 섭취 후 45분까지는 그대로 유지되다 줄어들도록 보정 가능, 현재는 즉시 감쇠 시작)
  const remaining = mg * Math.pow(0.5, diffHours / halfLife);
  return parseFloat(remaining.toFixed(2));
};


export const getTotalRemainingCaffeine = (logs: CaffeineLog[], halfLife: number) => {
  return logs.reduce((total, log) => 
    total + calculateCurrentCaffeine(log.caffeineAmount, log.intakeTime, halfLife), 0);
};


/* 마지막 섭취로부터 경과 시간 계산 (금단 현상 분석용)*/
export const getHoursSinceLastDrink = (logs: CaffeineLog[]) => {
  if (logs.length === 0) return 0;
  const lastLog = [...logs].sort((a, b) => dayjs(b.intakeTime).valueOf() - dayjs(a.intakeTime).valueOf())[0];
  return getNow().diff(dayjs(lastLog.intakeTime), 'hour', true);
};


/**
 *   스마트 맞춤형 권장량 계산 (체중 및 감량 챌린지 기반)
 */
export const getPersonalizedGoal = (user: UserProfile) => {
  // 성인 기본 최대 권장량은 체중 1kg당 400mg을 넘지 않게 설정 (통상 400mg 상한)
  let goal = Math.min(user.weight * 6, 400); 

  // [이별 트랙] 4주 점진적 감량 로직 (75-50-25-12.5 법칙)
  if (user.isTapering && user.baseIntake > 0) {
    const week = user.taperingWeek;
    if (week === 1) goal = user.baseIntake * 0.75;
    else if (week === 2) goal = user.baseIntake * 0.50;
    else if (week === 3) goal = user.baseIntake * 0.25;
    else if (week >= 4) goal = user.baseIntake * 0.125;
  }
  return Math.round(goal);
};


/**
 * 1. 개인화된 반감기 계산 (민감도 반영)
 * FAST(4시간), NORMAL(5시간), SLOW(8시간)
 */
export const getDynamicHalfLife = (user: UserProfile) => {
  let base = 5;
  if (user.sensitivity === 'FAST') base = 4;
  if (user.sensitivity === 'SLOW') base = 8;
  
  // 생리 중이면 대사가 약 1.5배 느려짐
  if (user.gender === 'F' && user.isMenstruating) {
    return base * 1.5;
  }
  return base;
}


/**
 *  '3일의 법칙' 감지기 (연속 3일 섭취 여부 파악)
 */
export const checkThreeDayRule = (logs: CaffeineLog[]) => {
  const today = getNow().startOf('day');
  const daysWithCaffeine = new Set(
    logs.map(log => dayjs(log.intakeTime).startOf('day').format('YYYY-MM-DD'))
  );

  const drankToday = daysWithCaffeine.has(today.format('YYYY-MM-DD'));
  const drankYesterday = daysWithCaffeine.has(today.subtract(1, 'day').format('YYYY-MM-DD'));
  const drankDayBefore = daysWithCaffeine.has(today.subtract(2, 'day').format('YYYY-MM-DD'));

  return {
    isDanger: drankToday && drankYesterday && drankDayBefore,
    message: drankToday && drankYesterday && drankDayBefore 
      ? "3일 연속 섭취했어요! 내일은 뇌를 쉬게 해주는 건 어떨까요?" 
      : "잘 조절하고 있어요!"
  };
};

/**
 *  두통 소방차 & 리바운드 예측 (10~24시간 경과 확인)
 */
export const getWithdrawalWarning = (logs: CaffeineLog[]) => {
  if (logs.length === 0) return null;
  
  // 가장 마지막에 마신 커피 시간
  const lastLog = [...logs].sort((a, b) => dayjs(b.intakeTime).valueOf() - dayjs(a.intakeTime).valueOf())[0];
  const hoursSinceLastDrink = getNow().diff(dayjs(lastLog.intakeTime), "hour", true);

  if (hoursSinceLastDrink >= 12 && hoursSinceLastDrink <= 24) {
    return {
      isWarning: true,
      message: "카페인 배출 중이에요! 콧물이나 두통이 올 수 있으니 물을 충분히 드세요 💧"
    };
  }
  return { isWarning: false, message: "" };
};

/**
 *  수면 및 캐릭터 상태
 */
export const getSleepStatus = (totalCaffeine: number) => {
  if (totalCaffeine < 50) return "GOOD";    // 꿀잠
  if (totalCaffeine < 100) return "FAIR";   // 주의
  return "BAD";                             // 수면 방해
};

//카페인 함량에 따른 상태
export const getCharacterStatus = (totalCaffeine: number, goal: number) => {
  const hour = getNow().hour();
  const percentage = (totalCaffeine / goal) * 100;

  // 밤 10시(22시) 이후인데 잔류량이 50mg(수면 방해 기준) 이상인 경우
  // 무조건 WARNING 이상으로 격상
  if ((hour >= 22 || hour < 4) && totalCaffeine >= 50) {
    return totalCaffeine >= 100 ? "DANGER" : "WARNING";
  }

  if (percentage === 0) return "IDLE";
  if (percentage <= 50) return "GOOD";
  if (percentage <= 80) return "WARNING";
  return "DANGER";
};

/**
 * 수면 세이프티 가이드 (액션 플랜)
 */
export const getSleepActionTip = (totalCaffeine: number) => {
  if (totalCaffeine <= 50) return "지금 바로 꿀잠 잘 수 있는 클린한 상태예요! ✨";
  if (totalCaffeine <= 100) return "물을 2잔 마시면 배출이 더 빨라져요! 💧";
  return "가벼운 스트레칭으로 신진대사를 높여 배출을 도와보세요! 🏃‍♀️";
};


/**
 * 카페인 각성 단계 바 로직
 */
export const getArousalStage = (totalCaffeine: number) => {
  if (totalCaffeine >= 200) return { label: "강한 각성 ⚡️", color: "#E05252", tip: "심박수가 빠를 수 있어요. 물을 드세요!" };
  if (totalCaffeine >= 100) return { label: "집중 모드 🔥", color: "#D97706", tip: "업무와 공부에 최적인 상태입니다." };
  if (totalCaffeine >= 50) return { label: "평온한 상태 ☕️", color: "#E57B3E", tip: "은은한 에너지가 남아있어요." };
  return { label: "카페인 프리 ☘️", color: "#A3978F", tip: "뇌가 휴식하고 있는 깨끗한 상태!" };
};

/**
 * 아데노신 수용체 회복률 계산 (가상 시나리오 기반)
 * 마지막으로 많이 마신 날로부터 시간이 지날수록 회복됨
 */
export const getReceptorRecovery = (logs: CaffeineLog[]) => {
  if (logs.length === 0) return 100;
  // 최근 3일간의 평균 섭취량이 적을수록 회복률이 높다고 가정
  const recentIntake = logs
    .filter(l => dayjs(l.intakeTime).isAfter(getNow().subtract(3, 'day')))
    .reduce((sum, l) => sum + l.caffeineAmount, 0) / 3;
  
  const recovery = Math.max(0, 100 - (recentIntake / 400) * 100);
  return Math.round(recovery);
};

/**
 * 특정 날짜에 카페인을 섭취했는지 확인
 */
export const checkDrankOnDate = (logs: CaffeineLog[], date: dayjs.Dayjs) => {
  return logs.some(log => dayjs(log.intakeTime).isSame(date, 'day'));
};

/**
 * 연속 무카페인 일수(Clean Streak) 계산
 * 챌린지 시작일(startDateStr)을 인자로 받아 그 날까지만 거슬러 올라감.
 */
export const getCleanStreak = (logs: CaffeineLog[], startDateStr: string) => {
  
  if (!startDateStr) return 0; // 시작일 없으면 0일
  let streak = 0;
  let current = getNow().startOf('day');


  // 문자열을 날짜 객체로 변환하는 과정.
  const startDate = dayjs(startDateStr).startOf('day'); 

  // 오늘부터 과거로 거슬러 올라가며 확인
  while (true) {
    // 만약 챌린지 시작일보다 더 과거로 갔다면 멈춤 (101일 방지)
    if (current.isBefore(startDate)) break;

    const drank = logs.some(log => dayjs(log.intakeTime).isSame(current, 'day'));
    if (drank) break; // 마신 날을 만나면 멈춤
    
    streak++;
    current = current.subtract(1, 'day');
    
    if (streak > 365) break; // 안전장치를 1년으로 넉넉하게 조정
  }
  return streak;
};



export const getSmartRecommendation = (user: UserProfile, totalCaffeine: number, goal: number) => {
  const hour = getNow().hour();
  
  // 1순위: 목표 초과 혹은 임박 (80% 이상)
  if (totalCaffeine >= goal * 0.8) {
    return {
      title: "물 한 잔 어때요? 💧",
      desc: "이미 충분한 카페인을 섭취했어요. 지금은 수분 보충이 필요한 때!",
      category: "Water"
    };
  }

  // 2순위: 밤 시간대 (오후 6시 이후)
  if (hour >= 18 || hour < 4) {
    return {
      title: "디카페인이 안전해요 🌙",
      desc: "지금 커피를 마시면 수면 시간이 너무 늦어질 수 있어요.",
      category: "Decaf"
    };
  }

  // 3순위: 생리 모드 활성화 시
  if (user.gender === 'F' && user.isMenstruating) {
    return {
      title: "따뜻한 차를 추천해요 🍵",
      desc: "대사가 느려진 시기예요. 카페인보다는 몸을 따뜻하게 하는 티가 좋아요.",
      category: "Tea"
    };
  }

  // 4순위: 오전 집중 시간 (오전 7시 ~ 11시)
  if (hour >= 7 && hour <= 11) {
    return {
      title: "모닝 아메리카노 ☀️",
      desc: "하루를 활기차게 시작하기 딱 좋은 시간입니다!",
      category: "Espresso"
    };
  }

  return {
    title: "가벼운 라떼 한 잔 ☕️",
    desc: "오후의 활력을 위해 부드러운 음료는 어떨까요?",
    category: "Espresso"
  };
};

/**
 * 1. 특정 시점(targetTime)의 잔존 카페인 계산 (정밀 분석용)
 */
export const getCaffeineAtTime = (logs: CaffeineLog[], targetTime: string, halfLife = 5) => {
  return logs.reduce((total, log) => {
    const diffHours = dayjs(targetTime).diff(dayjs(log.intakeTime), "hour", true);
    if (diffHours < 0) return total; // 증상 발생 이후에 마신 커피는 제외
    const remaining = log.caffeineAmount * Math.pow(0.5, diffHours / halfLife);
    return total + remaining;
  }, 0);
};

/**
 * 2. 초정밀 증상 상관관계 분석 (Pseudo-AI)
 */
export const analyzeSymptomCorrelation = (logs: CaffeineLog[], symptoms: SymptomLog[]) => {
  if (symptoms.length === 0) return "아직 데이터가 부족합니다. 컨디션이 변할 때 기록해 주시면 분석을 시작할게요.";

  const lastSymptom = [...symptoms].sort((a, b) => dayjs(b.recordTime).valueOf() - dayjs(a.recordTime).valueOf())[0];
  
  // 증상 발생 전 12시간 이내의 기록 확인
  const recentLogs = logs.filter(l => {
    const hoursDiff = dayjs(lastSymptom.recordTime).diff(dayjs(l.intakeTime), 'hour', true);
    return hoursDiff >= 0 && hoursDiff <= 12;
  });

  const hiddenKeywords = ['콜라', '초콜릿', '녹차', '홍차', '에너지', '박카스', '밀크티'];
  const drankHidden = recentLogs.filter(l => 
    hiddenKeywords.some(k => l.beverageName.includes(k))
  );

  if (lastSymptom.type === 'HEADACHE' && drankHidden.length > 0) {
    const names = drankHidden.map(l => l.beverageName.split(' ')[0]).join(', ');
    return `🕵️‍♂️ 범인을 찾은 것 같아요! 커피는 조심하셨지만, 최근 드신 [${names}]의 숨은 카페인이 두통을 유발했을 수 있습니다.`;
  }

  // 모든 증상 기록 시점의 카페인 농도를 추적
  const symptomData = symptoms.map(s => ({
    type: s.type,
    levelAtTime: getCaffeineAtTime(logs, s.recordTime)
  }));

  // 1단계: 과다 섭취 분석 (농도가 높을 때 증상이 나타남)
  const highLevelSymptoms = symptomData.filter(d => d.levelAtTime > 120);
  // 2단계: 금단 현상 분석 (농도가 낮을 때 증상이 나타남)
  const withdrawalSymptoms = symptomData.filter(d => d.levelAtTime < 30);

  if (highLevelSymptoms.length >= 2) {
    const avg = Math.round(highLevelSymptoms.reduce((a, b) => a + b.levelAtTime, 0) / highLevelSymptoms.length);
    return `분석 결과, 회원님은 혈중 카페인이 ${avg}mg 이상일 때 주로 불편함을 느끼십니다. 현재 수치에 맞춰 섭취량을 조절해 보세요.`;
  }

  if (withdrawalSymptoms.length >= 2) {
    return "특징적인 패턴이 발견되었습니다! 주로 카페인 농도가 낮아질 때 두통/피로를 느끼시네요. 이는 전형적인 '금단 리바운드' 현상입니다.";
  }

  return "데이터를 정밀 분석 중입니다. 증상이 나타날 때 정확한 시간을 기록할수록 분석 정확도가 올라갑니다.";
};




/**
 *  정직한 누적 아낀 돈 계산 (버그 해결 버전)
 */
export const getTotalSavedMoney = (logs: CaffeineLog[], startDateStr: string) => {
  if (!startDateStr) return 0;
  
  const startDate = dayjs(startDateStr).startOf('day');
  const today = getNow().startOf('day');
  const totalDays = today.diff(startDate, 'day') + 1;

  // 중복 날짜를 제거한 '커피 마신 날' 목록
  const drankDates = new Set(logs.map(log => dayjs(log.intakeTime).format('YYYY-MM-DD')));
  
  // 챌린지 범위 내의 마신 날만 카운트
  const actualDrankDaysInChallenge = Array.from(drankDates).filter(date => {
    const d = dayjs(date);
    return (d.isSame(startDate) || d.isAfter(startDate)) && (d.isSame(today) || d.isBefore(today));
  }).length;

  const cleanDays = totalDays - actualDrankDaysInChallenge;
  return Math.max(0, cleanDays * 4500);
};


/**
 *  수면 예측 디테일 (남은 시간 포함)
 */
export const predictSleepReadyTime = (totalCaffeine: number, halfLife: number, preferredBedtime: string = "23:00") => {
  if (totalCaffeine <= 50) return { time: "지금 바로", left: "0분", isLate: false };

  const hoursToWait = halfLife * (Math.log(totalCaffeine / 50) / Math.log(2));
  const readyTime = getNow().add(hoursToWait, 'hour');
  
  // preferredBedtime이 혹시라도 빈 문자열이거나 undefined일 때를 위한 방어 코드
  const timeStr = preferredBedtime || "23:00";
  
  // 사용자의 목표 취침 시간과 비교
  const [bedH, bedM] = timeStr.split(':').map(Number);
  const bedtimeToday = getNow().hour(bedH).minute(bedM);
  const isLate = readyTime.isAfter(bedtimeToday);

  return {
    
    time: readyTime.format('A h시 m분'),
    left: `${Math.floor(hoursToWait)}시간 ${Math.round((hoursToWait % 1) * 60)}분`,
    isLate
  };
};

/**
 * 3. 공복 섭취 통계 분석
 */
export const getFastingReport = (logs: CaffeineLog[]) => {
  const last7Days = logs.filter(l => dayjs(l.intakeTime).isAfter(getNow().subtract(7, 'day')));
  const fastingCount = last7Days.filter(l => l.isFasting).length;
  
  if (fastingCount >= 3) {
    return {
      isWarning: true,
      message: `지난주 공복 섭취가 ${fastingCount}회 있어요. 위 점막 보호를 위해 식후 1시간 뒤를 추천해요! 🤢`
    };
  }
  return { isWarning: false, message: "공복 섭취를 잘 조절하고 계시네요!" };
};