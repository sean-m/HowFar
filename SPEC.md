# HowFar Specification

## Product requirements

- The application is a progressive web application.
- A user can capture Point A and Point B from the device's current GPS location.
- Label Point A as Start and Point B as End throughout the user interface.
- Each point is a single GPS snapshot captured when the user tags it; it does not update as the user
  moves.
- A Point is capturable only when its reported horizontal GPS accuracy is 5 m or better. The capture
  confirmation displays its time and reported accuracy and offers a Retake action.
- The application calculates the straight-line geodesic distance between Point A and Point B.
- The calculated distance is displayed in imperial and metric measurements, automatically selecting
  an appropriate scale within each system.
- The result screen presents the imperial measurement as primary, with metric and the selected
  novelty unit as secondary values.
- The application displays the distance in one user-selected novelty unit. The curated novelty-unit
  catalog contains cubit, pede, furlong, fathom, parasang, barleycorn, and hair's breath.
- The selected novelty unit persists locally and is restored when the application reopens.
- A user can save a Measurement containing Point A, Point B, and the calculated values in every
  supported measurement system.
- A saved Measurement may have an optional name and note. If neither is supplied, it is identified
  by its capture date and time.
- A user can edit the name and note of a saved Measurement, but not its captured points or
  calculated distances.
- A user can delete a saved Measurement.
- Saved Measurements and the selected novelty unit are stored in browser local storage.
- A user can export all saved Measurements to a file on their device in either JSON or
  human-readable Markdown format.
- Export is one-way; importing exported files is out of scope.

## UX requirements

- Design the application mobile-device-first for use on a phone while moving between Points. Desktop
  layouts may adapt from the mobile flow but must not define it.
- The application opens to the Point A then Point B capture flow. Saved Measurements are available
  through persistent secondary navigation.
- Capturing Point A presents a deliberate Capture Point B action rather than automatically capturing
  the second Point.
- A calculated, unsaved Measurement presents Save Measurement and Start New Measurement actions.
  Starting a new Measurement confirms that an unsaved result will be discarded.
- The selected novelty unit is changed beside its result-screen value.
- When location access is denied, unavailable, or not accurate enough, explain the recovery action
  and disable Point capture until a usable location is available.
- Request browser location permission only after the user presses Capture Point A or Capture Point B.
- Saving opens a dialog or bottom sheet over the result with optional Name and Note fields.
- The Saved screen is a compact list that opens a Measurement detail view. Deleting a Saved
  measurement requires confirmation.
- Normal Measurement detail views show values, date/time, name, and note but not raw Point
  coordinates; coordinates remain available in exports.
- Export is initiated from one Saved-screen action, which lets the user choose JSON or Markdown and
  downloads all Saved Measurements.
- Use a high-contrast, sunlight-readable field-tool design with large numeric values, restrained
  color, generous touch targets, and a single-column phone-first layout.
- Display imperial as whole yards below one mile and one decimal mile at or above one mile; display
  metric as whole meters below one kilometer and one decimal kilometer at or above one kilometer;
  display novelty units to at most one decimal place.
- Sort Saved Measurements newest first. An empty Saved screen explains that saved Measurements
  appear there and offers a return to capture.
- When offline, keep capture, local saves, and export available and show a subtle offline status.
- Use semantic controls with keyboard navigation, visible focus, and status/error indications that
  do not rely on color alone.
- Do not show a custom PWA installation prompt in the first release; rely on browser-provided
  installation affordances.

## Technical requirements

- Implement the application in TypeScript.
- Avoid large UI frameworks.
- Use native browser APIs for geolocation, local storage, file downloads, and progressive-web-app
  behavior.
- Use Deno as the TypeScript runtime and build environment. Use its native ES-module support and
  tasks where build automation is needed; do not introduce a UI framework.
- Keep the software bill of materials small: implement simple internal logic, including conversion
  and formatting, in local modules rather than adding general-purpose dependencies.
- Add a focused third-party library only when browser APIs and small local modules cannot reasonably
  meet a requirement. A geodesic-distance library is acceptable if the project does not implement
  that calculation itself.

## Deferred requirements

- Capture elevation for both Points and display horizontal distance, elevation change, and
  three-dimensional slant distance. The current scope remains horizontal geodesic distance only.
- A golf-specific plays-like distance estimate is deferred. It must be modeled separately from
  measured distance and use an explicit adjustment model if added.
