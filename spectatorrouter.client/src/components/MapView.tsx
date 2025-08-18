import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LabeledPoint, Route } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Vite bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

// Utility to build a text label next to the marker using a DivIcon
function textDivIcon(text?: string) {
    return L.divIcon({
        className: 'sr-label',
        html: `<div class="sr-badge">${text ?? ''}</div>`,
        iconSize: [0, 0], // no built-in marker; we place a separate default Marker for the pin if desired
        iconAnchor: [0, 0]
    });
}

function FitBounds({ routes, points }: { routes: Route[]; points: LabeledPoint[] }) {
    const map = useMap();
    React.useEffect(() => {
        const latlngs: L.LatLngExpression[] = [];
        routes.forEach(r => r.path.forEach(p => latlngs.push([p.lat, p.lng])));
        points.forEach(p => latlngs.push([p.lat, p.lng]));
        if (latlngs.length) {
            const bounds = L.latLngBounds(latlngs as [number, number][]);
            map.fitBounds(bounds.pad(0.2));
        }
    }, [routes, points, map]);
    return null;
}

export interface MapViewProps {
    routes?: Route[];
    points?: LabeledPoint[];
    showPins?: boolean;        // show default pin for points
    showLabels?: boolean;      // show text labels next to points
    tileUrl?: string;          // override tile source if needed
    height?: string;           // map height, e.g., '70vh'
}

export default function MapView({
    routes = [],
    points = [],
    showPins = true,
    showLabels = true,
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    height = '70vh',
}: MapViewProps) {
    const center: [number, number] = routes[0]?.path[0]
        ? [routes[0].path[0].lat, routes[0].path[0].lng]
        : points[0]
            ? [points[0].lat, points[0].lng]
            : [55.6761, 12.5683]; // Copenhagen fallback

    return (
        <div style={{ height }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url={tileUrl} attribution='&copy; OpenStreetMap contributors' />
                <FitBounds routes={routes} points={points} />

                {routes.map((r) => (
                    <React.Fragment key={r.id}>
                        <Polyline positions={r.path.map(p => [p.lat, p.lng]) as [number, number][]} />
                        {r.popupHtml && r.path.length > 1 && (
                            <Popup position={r.path[Math.floor(r.path.length / 2)] as any}>
                                <div dangerouslySetInnerHTML={{ __html: r.popupHtml }} />
                            </Popup>
                        )}
                    </React.Fragment>
                ))}

                {points.map((p) => (
                    <React.Fragment key={p.id}>
                        {showPins && <Marker position={[p.lat, p.lng]} />}
                        {showLabels && p.label && (
                            <Marker position={[p.lat, p.lng]} icon={textDivIcon(p.label)} interactive={false} />
                        )}
                        {p.popupHtml && (
                            <Popup position={[p.lat, p.lng]}>
                                <div dangerouslySetInnerHTML={{ __html: p.popupHtml }} />
                            </Popup>
                        )}
                    </React.Fragment>
                ))}
            </MapContainer>
        </div>
    );
}
