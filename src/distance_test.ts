import { calculateDistance } from './distance.ts';

Deno.test('calculates the geodesic distance between two points', () => {
  const result = calculateDistance(
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 1 },
  );

  const expectedMeters = 111_195;
  const toleranceMeters = 100;

  if (Math.abs(result.meters - expectedMeters) > toleranceMeters) {
    throw new Error(
      `Expected ${expectedMeters}m +/- ${toleranceMeters}m, received ${result.meters}m`,
    );
  }
});
