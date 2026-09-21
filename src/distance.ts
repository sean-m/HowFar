const EARTH_RADIUS_METERS = 6_371_000;

export interface Point {
  latitude: number;
  longitude: number;
}

export interface Distance {
  meters: number;
}

export function calculateDistance(pointA: Point, pointB: Point): Distance {
  const latitudeDelta = toRadians(pointB.latitude - pointA.latitude);
  const longitudeDelta = toRadians(pointB.longitude - pointA.longitude);
  const latitudeA = toRadians(pointA.latitude);
  const latitudeB = toRadians(pointB.latitude);

  const haversine = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) *
      Math.sin(longitudeDelta / 2) ** 2;
  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return { meters: EARTH_RADIUS_METERS * centralAngle };
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
