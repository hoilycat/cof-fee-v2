import {useAtomValue} from 'jotai';
import {caffeineLogsAtom} from './useCaffeineStore';
import {getTotalRemainingCaffeine, getSleepStatus, getCharacterStatus} from '../lib/utiles';

export const useCaffeine = () => {
    const logs = useAtomValue(caffeineLogsAtom);
    const totalCaffeine = getTotalRemainingCaffeine(logs);
    const sleepStatus = getSleepStatus(totalCaffeine);
    const characterStatus = getCharacterStatus(totalCaffeine);

return{totalCaffeine, sleepStatus, characterStatus};

};

