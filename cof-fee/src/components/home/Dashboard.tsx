import {useCaffeine} from '../../store/hooks';


const Dashboard = () => { 
    const {totalCaffeine, sleepStatus, characterStatus} = useCaffeine();


return(
    <div className="container">

    <div className="Avatar-section">
        <img src={`/assets/characters/${characterStatus}.png`} alt="Character Avatar" />
    </div>
    <div className="info-section">
        <p>Total Caffeine: {totalCaffeine}mg</p>
        <p>Sleep Status: {sleepStatus}</p>
    </div>
    <div className="status-section"></div>
    </div>
    );
}