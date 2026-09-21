import { calculateDistance, type Distance, type Point } from './distance.ts';

const REQUIRED_ACCURACY_METERS = 5;

export interface CapturedPoint extends Point {
  accuracyMeters: number;
  capturedAt: Date;
}

export interface CaptureState {
  phase: 'ready-for-start' | 'ready-for-end' | 'location-unavailable' | 'result';
  start?: CapturedPoint;
  end?: CapturedPoint;
  measurement?: Distance;
  message?: string;
}

export type RequestLocation = () => CapturedPoint | Promise<CapturedPoint>;

export interface CaptureFlow {
  captureStart(): Promise<void>;
  captureEnd(): Promise<void>;
  reset(): void;
  getState(): CaptureState;
}

export function createCaptureFlow(requestLocation: RequestLocation): CaptureFlow {
  let state: CaptureState = { phase: 'ready-for-start' };

  return {
    async captureStart() {
      const point = await requestLocation();

      if (!isAccurate(point)) {
        state = accuracyFailure(point.accuracyMeters);
        return;
      }

      state = {
        phase: 'ready-for-end',
        start: point,
      };
    },
    async captureEnd() {
      if (state.start === undefined) {
        throw new Error('Capture Start before capturing End.');
      }

      const point = await requestLocation();

      if (!isAccurate(point)) {
        state = accuracyFailure(point.accuracyMeters, state.start);
        return;
      }

      state = {
        phase: 'result',
        start: state.start,
        end: point,
        measurement: calculateDistance(state.start, point),
      };
    },
    getState() {
      return state;
    },
    reset() {
      state = { phase: 'ready-for-start' };
    },
  };
}

function isAccurate(point: CapturedPoint): boolean {
  return point.accuracyMeters <= REQUIRED_ACCURACY_METERS;
}

function accuracyFailure(accuracyMeters: number, start?: CapturedPoint): CaptureState {
  return {
    phase: 'location-unavailable',
    start,
    message: `GPS accuracy was ${
      Math.round(accuracyMeters)
    } m; it must be 5 m or better. Try again in a clearer location.`,
  };
}
