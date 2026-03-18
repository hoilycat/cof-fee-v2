// src/hooks/useCaffeine.ts
import { useAtomValue } from 'jotai';
import { caffeineLogsAtom, dailyGoalAtom, userProfileAtom } from './useCaffeineStore'; // dailyGoalAtom 추가
import { getTotalRemainingCaffeine, getSleepStatus, getCharacterStatus, getPersonalizedGoal  } from '../lib/utiles';

export const useCaffeine = () => {
    const logs = useAtomValue(caffeineLogsAtom);
    const user = useAtomValue(userProfileAtom); // 1. 유저 정보를 가져오기.
    const dailyGoal = useAtomValue(dailyGoalAtom); // 사용자가 설정한 일반 목표량
    
    const totalCaffeine = getTotalRemainingCaffeine(logs);
    
    // 2. '이별 트랙'이면 감량 목표를, 아니면 일반 목표를 사용하도록 계산
    const currentGoal = user.isTapering ? getPersonalizedGoal(user) : dailyGoal;
    
    const sleepStatus = getSleepStatus(totalCaffeine);
    
    // 3. characterStatus 계산 시 계산된 currentGoal을 전달
    const characterStatus = getCharacterStatus(totalCaffeine, currentGoal);

    return { 
        totalCaffeine, 
        goal: currentGoal, // UI에서 보여줄 현재 목표
        sleepStatus, 
        characterStatus, 
        isTapering: user.isTapering 
    };
};
