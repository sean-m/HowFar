import { type CapturedPoint, createCaptureFlow } from './capture_flow.ts';

const startButton = requiredElement<HTMLButtonElement>('#capture-start');
const endButton = requiredElement<HTMLButtonElement>('#capture-end');
const newMeasurementButton = requiredElement<HTMLButtonElement>('#new-measurement');
const startStatus = requiredElement<HTMLParagraphElement>('#start-status');
const endStatus = requiredElement<HTMLParagraphElement>('#end-status');
const status = requiredElement<HTMLParagraphElement>('#status');
const result = requiredElement<HTMLElement>('#result');
const imperialDistance = requiredElement<HTMLParagraphElement>('#imperial-distance');
const metricDistance = requiredElement<HTMLParagraphElement>('#metric-distance');
const noveltyDistance = requiredElement<HTMLParagraphElement>('#novelty-distance');

const flow = createCaptureFlow(requestLocation);

startButton.addEventListener('click', () => capture('start'));
endButton.addEventListener('click', () => capture('end'));
newMeasurementButton.addEventListener('click', () => {
  flow.reset();
  render();
});

render();

async function capture(point: 'start' | 'end'): Promise<void> {
  clearStatus();
  setCapturing(point, true);

  try {
    if (point === 'start') {
      await flow.captureStart();
    } else {
      await flow.captureEnd();
    }
  } catch (error) {
    showStatus(locationErrorMessage(error));
  } finally {
    setCapturing(point, false);
    render();
  }
}

function render(): void {
  const state = flow.getState();
  const hasStart = state.start !== undefined;
  const hasResult = state.phase === 'result' && state.measurement !== undefined;

  startButton.disabled = hasResult;
  endButton.disabled = !hasStart || hasResult;
  startStatus.textContent = hasStart
    ? `Captured ${formatPoint(state.start)}.`
    : 'Capture your starting point.';
  endStatus.textContent = state.end === undefined
    ? hasStart ? 'Capture your ending point.' : 'Capture Start before capturing End.'
    : `Captured ${formatPoint(state.end)}.`;
  result.hidden = !hasResult;

  if (state.phase === 'location-unavailable' && state.message !== undefined) {
    showStatus(state.message);
  }

  if (!hasResult) {
    return;
  }

  const meters = state.measurement.meters;
  imperialDistance.textContent = formatImperial(meters);
  metricDistance.textContent = formatMetric(meters);
  noveltyDistance.textContent = `${(meters / 0.4572).toFixed(1)} cubits`;
}

function requestLocation(): Promise<CapturedPoint> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not available on this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          capturedAt: new Date(position.timestamp),
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 },
    );
  });
}

function setCapturing(point: 'start' | 'end', isCapturing: boolean): void {
  const button = point === 'start' ? startButton : endButton;
  button.disabled = isCapturing;
  button.textContent = isCapturing
    ? `Capturing ${capitalize(point)}…`
    : `Capture ${capitalize(point)}`;
}

function formatPoint(point: CapturedPoint): string {
  return `${point.capturedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · ${
    Math.round(point.accuracyMeters)
  } m accuracy`;
}

function formatImperial(meters: number): string {
  const yards = meters / 0.9144;

  return yards < 1760
    ? `${Math.round(yards).toLocaleString()} yd`
    : `${(yards / 1760).toFixed(1)} mi`;
}

function formatMetric(meters: number): string {
  return meters < 1000
    ? `${Math.round(meters).toLocaleString()} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

function locationErrorMessage(error: unknown): string {
  if (error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED) {
    return 'Location permission is required to capture a point. Allow location access and try again.';
  }

  return 'Location is unavailable. Check your signal and try again.';
}

function showStatus(message: string): void {
  status.hidden = false;
  status.textContent = message;
}

function clearStatus(): void {
  status.hidden = true;
  status.textContent = '';
}

function capitalize(value: string): string {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (element === null) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
}
