export interface LatLng { lat: number; lng: number }

export interface LabeledPoint extends LatLng {
    id: string;
    label?: string;        // short text rendered next to the marker
    popupHtml?: string;    // optional HTML popup content
}

export interface Route {
    id: string;
    path: LatLng[];        // ordered coordinates
    popupHtml?: string;    // optional popup at the route midpoint
}
