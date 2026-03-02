import {useAtom} from 'jotai';
import { dailyGoalAtom, nicknameAtom } from '../../hooks/useCaffeineStore';

export const Settings = () => {
    const [nickname, setNickname] = useAtom(nicknameAtom);
    const [dailyGoal, setDailyGoal] = useAtom(dailyGoalAtom);

    return(
        <div className="p-4">
            <h2>설정</h2>

            {/*이름 수정 칸*/}
            <div>
            <label>닉네임: </label>
            <input 
                type="text" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
            />
            </div>
    
            {/*하루 목표 수정 칸*/}
            <div>
            <label>하루 목표 (mg): </label>
            <input 
                type="number" 
                value={dailyGoal} 
                onChange={(e) => setDailyGoal(Number(e.target.value))} 
            />
            </div>

        </div>
    );
};