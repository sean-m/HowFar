import { createCaptureFlow } from './capture_flow.ts';

Deno.test('confirms an accurate Start point and enables End capture', async () => {
  const flow = createCaptureFlow(() => ({
    latitude: 47.6205,
    longitude: -122.3493,
    accuracyMeters: 3,
    capturedAt: new Date('2026-09-21T17:00:00Z'),
  }));

  await flow.captureStart();

  const state = flow.getState();

  if (state.phase !== 'ready-for-end') {
    throw new Error(`Expected ready-for-end phase, received ${state.phase}.`);
  }

  if (state.start?.accuracyMeters !== 3) {
    throw new Error('Expected the confirmed Start point to retain its accuracy.');
  }
});

Deno.test('rejects a Start point whose GPS accuracy exceeds five meters', async () => {
  const flow = createCaptureFlow(() => ({
    latitude: 47.6205,
    longitude: -122.3493,
    accuracyMeters: 6,
    capturedAt: new Date('2026-09-21T17:00:00Z'),
  }));

  await flow.captureStart();

  const state = flow.getState();

  if (state.phase !== 'location-unavailable') {
    throw new Error(`Expected location-unavailable phase, received ${state.phase}.`);
  }

  if (state.message !== 'GPS accuracy must be 5 m or better. Try again in a clearer location.') {
    throw new Error('Expected an accuracy-recovery message.');
  }
});

Deno.test('calculates a Measurement after capturing an accurate End point', async () => {
  const locations = [
    {
      latitude: 0,
      longitude: 0,
      accuracyMeters: 3,
      capturedAt: new Date('2026-09-21T17:00:00Z'),
    },
    {
      latitude: 0,
      longitude: 1,
      accuracyMeters: 4,
      capturedAt: new Date('2026-09-21T17:01:00Z'),
    },
  ];
  const flow = createCaptureFlow(() => {
    const location = locations.shift();

    if (location === undefined) {
      throw new Error('No location available.');
    }

    return location;
  });

  await flow.captureStart();
  await flow.captureEnd();

  const state = flow.getState();

  if (state.phase !== 'result') {
    throw new Error(`Expected result phase, received ${state.phase}.`);
  }

  if (state.measurement === undefined || Math.abs(state.measurement.meters - 111_195) > 100) {
    throw new Error('Expected a Measurement calculated from Start to End.');
  }
});

Deno.test('keeps Start confirmed when an inaccurate End point is rejected', async () => {
  const locations = [
    {
      latitude: 47.6205,
      longitude: -122.3493,
      accuracyMeters: 3,
      capturedAt: new Date('2026-09-21T17:00:00Z'),
    },
    {
      latitude: 47.6206,
      longitude: -122.3493,
      accuracyMeters: 8,
      capturedAt: new Date('2026-09-21T17:01:00Z'),
    },
  ];
  const flow = createCaptureFlow(() => {
    const location = locations.shift();

    if (location === undefined) {
      throw new Error('No location available.');
    }

    return location;
  });

  await flow.captureStart();
  await flow.captureEnd();

  const state = flow.getState();

  if (state.phase !== 'location-unavailable' || state.start === undefined) {
    throw new Error('Expected Start to remain confirmed after rejecting End.');
  }
});
