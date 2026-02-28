import {useAtomValue} from 'jotai';
import {caffeineLogsAtom} from './atoms';
import {getTotalRemainingCaffeine, getSleepStatus, getCharacterStatus} from './calculator';

export const useCaffeine = () => {
    const logs = useAtomValue(caffeineLogsAtom);
    const totalCaffeine = getTotalRemainingCaffeine(logs);
    const sleepStatus = getSleepStatus(totalCaffeine);
    const characterStatus = getCharacterStatus(totalCaffeine);

return{totalCaffeine, sleepStatus, characterStatus};

};

