import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapView from './components/MapView';
import PaceSlider from './components/PaceSlider';
import TotalTimeSlider from './components/TotalTimeSlider';
import type { Route, LabeledPoint } from './types';
import './styles/index.css';

export default function App() {
  const [raceType, setRaceType] = React.useState<'5km' | '10km' | 'halv marathon' | 'marathon'>('5km');
  const raceDistances: Record<string, number> = { '5km': 5, '10km': 10, 'halv marathon': 21.0975, 'marathon': 42.195 };

  const [pace, setPace] = React.useState(5); // min/km
  const [totalTime, setTotalTime] = React.useState(Math.round(pace * 60 * raceDistances[raceType]));

  React.useEffect(() => {
    const distanceKm = raceDistances[raceType];
    setTotalTime(Math.round(pace * 60 * distanceKm));
  }, [pace, raceType]);

  const handleTotalTimeChange = (newTime: number) => {
    const distanceKm = raceDistances[raceType];
    const newPace = newTime / 60 / distanceKm;
    setPace(newPace);
    setTotalTime(Math.round(newTime));
  };

  const [routes, setRoutes] = React.useState<Route[]>([]);
  const [points, setPoints] = React.useState<LabeledPoint[]>([]);

  const [tempRoutes, setTempRoutes] = React.useState<Route[]>([
    {
      id: 'r1',
      path: [
        { lat: 55.6761, lng: 12.5683 },
        { lat: 55.679, lng: 12.57 },
        { lat: 55.682, lng: 12.575 }
      ],
      popupHtml: '<strong>Sample route</strong>'
    }
  ]);

  const [tempPoints, setTempPoints] = React.useState<LabeledPoint[]>([
    { id: 'p1', lat: 55.6768, lng: 12.57, label: 'Start', popupHtml: 'Spectator meets here' },
    { id: 'p2', lat: 55.6815, lng: 12.573, label: 'Cheer #2' },
    { id: 'p3', lat: 55.682, lng: 12.575, label: 'Finish', popupHtml: '<em>Congrats!</em>' }
  ]);

  const updateMap = () => {
    setRoutes(tempRoutes);
    setPoints(tempPoints);
  };

  return (
    <div className="container py-3">
      <h1 className="mb-4">SpectatorRouter — Map Demo</h1>

      <div className="mb-4">
        <label className="form-label me-2">Race Type:</label>
        <select className="form-select d-inline-block w-auto" value={raceType} onChange={(e) => setRaceType(e.target.value as any)}>
          <option value="5km">5 km</option>
          <option value="10km">10 km</option>
          <option value="halv marathon">Halv marathon</option>
          <option value="marathon">Marathon</option>
        </select>
      </div>

      <div className="mb-3">
        <div className="mb-3">
          <PaceSlider pace={pace} onChange={setPace} />
        </div>

        <div className="mb-3">
          <TotalTimeSlider totalTime={totalTime} maxTime={60*60*6} onChange={handleTotalTimeChange} />
        </div>
      </div>

      <button className="btn btn-primary mb-3" onClick={updateMap}>Update Map</button>

      <MapView 
        routes={routes} 
        points={points} 
        showPins={true} 
        showLabels={true} 
        height="70vh" 
      />
    </div>
  );
}
