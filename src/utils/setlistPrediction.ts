import type { Concert } from '@prisma/client';

// Miku Expo 2025 Asia setlist pattern
const MIKU_EXPO_2025_SETLIST_A = 26;
const MIKU_EXPO_2025_SETLIST_B = 27;

// Prediction mapping based on venue and date
const PREDICTION_MAP: Record<string, number> = {
  // Singapore - Setlist A
  '2025-11-19': MIKU_EXPO_2025_SETLIST_A,

  // Kuala Lumpur - Setlist B
  '2025-11-22': MIKU_EXPO_2025_SETLIST_B,

  // Taipei - Setlist A
  '2025-11-26': MIKU_EXPO_2025_SETLIST_A,

  // Seoul - Alternating B, A
  '2025-11-29': MIKU_EXPO_2025_SETLIST_B, // Saturday
  '2025-11-30': MIKU_EXPO_2025_SETLIST_A, // Sunday
};

export interface PredictedSetlist {
  setlistId: number;
  isPredicted: boolean;
}

/**
 * Determines the predicted setlist for a concert based on date and venue pattern
 * Returns null if no prediction can be made
 */
export function getPredictedSetlist(concert: Concert): PredictedSetlist | null {
  // If concert already has a confirmed setlist, return it as not predicted
  if (concert.setlistId) {
    return {
      setlistId: concert.setlistId,
      isPredicted: false,
    };
  }

  // Format concert date as YYYY-MM-DD for lookup
  const concertDate = concert.date instanceof Date
    ? concert.date.toISOString().slice(0, 10)
    : typeof concert.date === 'string'
    ? new Date(concert.date).toISOString().slice(0, 10)
    : null;

  if (!concertDate) {
    return null;
  }

  // Check if we have a prediction for this date
  const predictedSetlistId = PREDICTION_MAP[concertDate];

  if (predictedSetlistId) {
    return {
      setlistId: predictedSetlistId,
      isPredicted: true,
    };
  }

  return null;
}

/**
 * Checks if a concert's setlist is predicted (not confirmed)
 */
export function isSetlistPredicted(concert: Concert): boolean {
  const prediction = getPredictedSetlist(concert);
  return prediction?.isPredicted ?? false;
}

/**
 * Gets the setlist ID for a concert, whether predicted or confirmed
 */
export function getSetlistId(concert: Concert): number | null {
  const prediction = getPredictedSetlist(concert);
  return prediction?.setlistId ?? null;
}
