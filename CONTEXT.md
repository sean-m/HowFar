# HowFar

PWA for capturing two GPS points and comparing the distance between them in multiple length systems.

## Language

**Point**:
A GPS coordinate captured from the device's current location for use as one end of a distance comparison.
_Avoid_: location, marker

**Measurement**:
A comparison between Point A and Point B that stores the calculated distance in all supported unit systems.
_Avoid_: result, reading

**Saved measurement**:
A Measurement with an optional name and note, persisted for later viewing or export. If no name is supplied, it is identified by its capture date and time.
_Avoid_: record, entry

**Novelty unit**:
A playful historical or unusual length unit used alongside imperial and metric values, such as cubit, pede, furlong, fathom, parasang, barleycorn, or hair's breath.
_Avoid_: iso, custom unit
