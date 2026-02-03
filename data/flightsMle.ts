// MLE flights: arrivals into MLE and departures from MLE (flights operate daily; date field in JSON ignored)

export interface MleFlightRaw {
  route: string;
  date: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
}

// Normalized flight: one per route/airline/number; time is local HH:mm (assume same every day)
export interface MleFlightNormalized {
  route: string;
  airline: string;
  flightNumber: string;
  /** Local time "HH:mm" — for arrivals: arrival at MLE; for departures: departure from MLE */
  timeLocal: string;
}

// Load raw data (date field present in JSON but we treat flights as daily)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const flightsMleRaw: MleFlightRaw[] = require('../flightsmle.json');

const AIRLINE_NAMES: Record<string, string> = {
  EK: 'Emirates',
  FZ: 'Flydubai',
  B4: 'Breeze Airways',
  Q4: 'Starlink Aviation',
  TK: 'Turkish Airlines',
  MH: 'Malaysia Airlines',
  OD: 'Malindo Air',
  VS: 'Virgin Atlantic',
  AZ: 'ITA Airways',
  SV: 'Saudia',
  SQ: 'Singapore Airlines',
  X1: 'Emirates (operated)',
  OS: 'Austrian',
  LX: 'Swiss',
  EY: 'Etihad',
  GF: 'Gulf Air',
  A1: 'Atlas Global',
  W2: 'FlexFlight',
  UL: 'SriLankan Airlines',
  CZ: 'China Southern',
  AI: 'Air India',
  QR: 'Qatar Airways',
  LH: 'Lufthansa',
  DE: 'Condor',
};

function timeFromIso(iso: string): string {
  const d = new Date(iso);
  return d.toTimeString().slice(0, 5);
}

function dedupeByRoute(
  rawList: MleFlightRaw[],
  getTime: (r: MleFlightRaw) => string
): MleFlightNormalized[] {
  const seen = new Set<string>();
  const out: MleFlightNormalized[] = [];
  for (const raw of rawList) {
    const key = `${raw.airline}-${raw.flightNumber}-${raw.route}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      route: raw.route,
      airline: raw.airline,
      flightNumber: raw.flightNumber,
      timeLocal: getTime(raw),
    });
  }
  return out.sort((a, b) => a.timeLocal.localeCompare(b.timeLocal));
}

/** Flights that arrive at MLE (operate daily) */
export const arrivalsIntoMle = dedupeByRoute(
  flightsMleRaw.filter((f) => f.arrivalAirport === 'MLE'),
  (r) => timeFromIso(r.arrivalTime)
);

/** Flights that depart from MLE (operate daily) */
export const departuresFromMle = dedupeByRoute(
  flightsMleRaw.filter((f) => f.departureAirport === 'MLE'),
  (r) => timeFromIso(r.departureTime)
);

export function getAirlineName(code: string): string {
  return AIRLINE_NAMES[code] || code;
}

/** Airlines that appear in either arrivals or departures */
export function getAirlinesFromFlights(): { label: string; value: string }[] {
  const codes = new Set<string>();
  arrivalsIntoMle.forEach((f) => codes.add(f.airline));
  departuresFromMle.forEach((f) => codes.add(f.airline));
  return [...codes].sort().map((code) => ({
    value: code,
    label: AIRLINE_NAMES[code] || code,
  }));
}

/** Arrivals into MLE for airline → options for Select */
export function getArrivalsForAirline(airlineCode: string): { label: string; value: string; flight: MleFlightNormalized }[] {
  return arrivalsIntoMle
    .filter((f) => f.airline === airlineCode)
    .map((f) => ({
      value: f.flightNumber,
      label: `${f.flightNumber} · ${f.route} arr ${f.timeLocal}`,
      flight: f,
    }));
}

/** Departures from MLE for airline → options for Select */
export function getDeparturesForAirline(airlineCode: string): { label: string; value: string; flight: MleFlightNormalized }[] {
  return departuresFromMle
    .filter((f) => f.airline === airlineCode)
    .map((f) => ({
      value: f.flightNumber,
      label: `${f.flightNumber} · ${f.route} dep ${f.timeLocal}`,
      flight: f,
    }));
}

/** Crew layover selection (arrival + departure + date) */
export interface CrewLayover {
  arrival: MleFlightNormalized;
  departure: MleFlightNormalized;
  dateStr: string;
}

/** Time window for experiences on the layover date (MLE local). Buffer: 60 min after arrival, 90 min before departure. */
export function getCrewExperienceConstraint(layover: CrewLayover): {
  dateStr: string;
  dateLabel: string;
  earliestStartTimeLocal: string;
  latestEndTimeLocal: string;
} {
  const d = new Date(layover.dateStr + 'T12:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateLabel = `${days[d.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()}`;

  const [ah, am] = layover.arrival.timeLocal.split(':').map(Number);
  const arrivalMins = ah * 60 + am;
  const earliestMins = arrivalMins + 60;
  const earliestStartTimeLocal = `${Math.floor(earliestMins / 60)
    .toString()
    .padStart(2, '0')}:${(earliestMins % 60).toString().padStart(2, '0')}`;

  const [dh, dm] = layover.departure.timeLocal.split(':').map(Number);
  const depMins = dh * 60 + dm;
  const latestMins = Math.max(0, depMins - 90);
  const latestEndTimeLocal = `${Math.floor(latestMins / 60)
    .toString()
    .padStart(2, '0')}:${(latestMins % 60).toString().padStart(2, '0')}`;

  return {
    dateStr: layover.dateStr,
    dateLabel,
    earliestStartTimeLocal,
    latestEndTimeLocal,
  };
}

/** Generate list of dates for calendar (e.g. next 90 days) */
export function getSelectableDates(daysAhead: number = 90): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    out.push(d.toISOString().split('T')[0]);
  }
  return out;
}
