import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatPace } from '../utils/format';

interface PaceSliderProps {
    pace: number; // minutes per km
    onChange: (pace: number) => void;
}

const PaceSlider: React.FC<PaceSliderProps> = ({ pace, onChange }) => {
    const [localPace, setLocalPace] = React.useState(pace);

    React.useEffect(() => {
        setLocalPace(pace);
    }, [pace]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPace = parseFloat(e.target.value);
        setLocalPace(newPace);
        onChange(newPace);
    };

    return (
        <div>
            <label htmlFor="paceSlider" className="form-label">
                Pace: {formatPace(localPace)}
            </label>
            <input
                type="range"
                className="form-range"
                min={2.2}
                max={10}
                step={0.05}
                id="paceSlider"
                value={localPace}
                onChange={handleChange}
            />
        </div>
    );
};

export default PaceSlider;
