import {useCaffeine} from '../../hooks/useCaffeine';
import { useSetAtom } from 'jotai';
import { caffeineLogsAtom } from '../../hooks/useCaffeineStore';
import { COFFEE_BRANDS } from '../../lib/caffeineData';

const Dashboard = () => { 
    const {totalCaffeine, sleepStatus, characterStatus} = useCaffeine();

const setLogs = useSetAtom(caffeineLogsAtom);
const addCoffee = (amount: number, name: string) =>{
    const newLog = {
        id: Date.now().toString(),
        caffeineAmount: amount,
        intakeTime: new Date().toISOString(),
        beverageName:name
    };
    setLogs((prev) => [...prev, newLog]);
};


return(
    <div className="container">

    <div className="Avatar-section">
        <img src={`/assets/characters/${characterStatus}.png`} alt="Character Avatar" />
    </div>
    <div className="info-section">
        <p>Total Caffeine: {totalCaffeine}mg</p>
        <p>Sleep Status: {sleepStatus}</p>

        {/*커피 추가 버튼*/}
        <button onClick={() => addCoffee(150, '아메리카노')}>
        아메리카노 추가
        </button>
    </div>
    <div className="status-section"></div>
    </div>
    );
}

export default Dashboard;