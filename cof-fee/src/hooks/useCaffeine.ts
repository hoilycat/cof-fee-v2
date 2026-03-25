// src/hooks/useCaffeine.ts
import { useAtomValue } from 'jotai';
import { caffeineLogsAtom, dailyGoalAtom, userProfileAtom } from './useCaffeineStore'; // dailyGoalAtom 추가
import { getTotalRemainingCaffeine, 
         getCharacterStatus, 
         getPersonalizedGoal, 
         getDynamicHalfLife,  
} from '../lib/utiles';
import { predictSleepReadyTime, getHoursSinceLastDrink, getWithdrawalWarning } from '../lib/utiles';



export const useCaffeine = () => {
    const logs = useAtomValue(caffeineLogsAtom);
    const user = useAtomValue(userProfileAtom); // 1. 유저 정보를 가져오기.
    const dailyGoal = useAtomValue(dailyGoalAtom); // 사용자가 설정한 일반 목표량
    
    // 1. 동적 반감기 결정
    const halfLife = getDynamicHalfLife(user);
    // 2. 구한 반감기를 넣어서 잔존량 계산하기
    const totalCaffeine = getTotalRemainingCaffeine(logs, halfLife);
    

    // 2. '이별 트랙'이면 감량 목표를, 아니면 일반 목표를 사용하도록 계산
    const currentGoal = user.isTapering ? getPersonalizedGoal(user) : dailyGoal;

    // 수면 예측 시간 계산 (값이 없을 경우를 대비해 "23:00" 기본값 추가)
    const sleepReadyTime = predictSleepReadyTime(totalCaffeine, halfLife, user.preferredBedtime || "23:00");

    // 금단 증상 분석
    const withdrawalInfo = getWithdrawalWarning(logs);
    const hoursSinceLastDrink = getHoursSinceLastDrink(logs);

    // 3. characterStatus 계산 시 계산된 currentGoal을 전달
    const characterStatus = getCharacterStatus(totalCaffeine, currentGoal);

    return { 
        totalCaffeine, 
        goal: currentGoal, // UI에서 보여줄 현재 목표

        characterStatus, 
        isTapering: user.isTapering,
        isMenstruating: user.isMenstruating,
        sleepReadyTime, // 대시보드에 전달
        withdrawalInfo, // 대시보드에 전달
        hoursSinceLastDrink
    };
};

