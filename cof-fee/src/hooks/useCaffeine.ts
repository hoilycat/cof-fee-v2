// src/hooks/useCaffeine.ts
import { useAtomValue } from 'jotai';
import { caffeineLogsAtom, dailyGoalAtom } from './useCaffeineStore'; // dailyGoalAtom 추가
import { getTotalRemainingCaffeine, getSleepStatus, getCharacterStatus } from '../lib/utiles';

export const useCaffeine = () => {
    const logs = useAtomValue(caffeineLogsAtom);
    const dailyGoal = useAtomValue(dailyGoalAtom); // 목표량 가져오기
    const totalCaffeine = getTotalRemainingCaffeine(logs);
    const sleepStatus = getSleepStatus(totalCaffeine);
    
    // goal을 정확히 전달
    const characterStatus = getCharacterStatus(totalCaffeine, dailyGoal);

    return { totalCaffeine, sleepStatus, characterStatus };
};
