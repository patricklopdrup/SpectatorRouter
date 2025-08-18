import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatTime } from '../utils/format';

interface TotalTimeSliderProps {
    totalTime: number; // in seconds
    maxTime: number;   // in seconds
    onChange: (time: number) => void;
}

const TotalTimeSlider: React.FC<TotalTimeSliderProps> = ({ totalTime, maxTime, onChange }) => {
    const [localTime, setLocalTime] = React.useState(totalTime);

    React.useEffect(() => {
        setLocalTime(totalTime);
    }, [totalTime]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseInt(e.target.value, 10);
        setLocalTime(newTime);
        onChange(newTime);
    };

    return (
        <div>
            <label htmlFor="timeSlider" className="form-label">
                Total Time: {formatTime(localTime)}
            </label>
            <input
                id="timeSlider"
                className="form-range"
                type="range"
                min={0}
                max={maxTime}
                step={60}
                value={localTime}
                onChange={handleChange}
            />
        </div>
    );
};

export default TotalTimeSlider;
