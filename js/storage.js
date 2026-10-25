/**
 * CodeAlpha - Fitness Tracker App
 * Storage Module: Manages LocalStorage persistence for user activities and goal settings.
 * Seeds realistic week-to-date data for immediate visual dashboard demonstration.
 */

const ACTIVITIES_STORAGE_KEY = 'codealpha_fitness_activities_v1';
const GOALS_STORAGE_KEY = 'codealpha_fitness_goals_v1';

export const DEFAULT_GOALS = {
  dailySteps: 10000,
  dailyCalories: 500,
  dailyMinutes: 45
};

/**
 * Generates initial demo records across the past 7 days so new users immediately
 * see an informative, functioning dashboard and 7-day progress chart.
 */
export function generateStarterActivities() {
  const activities = [];
  const now = new Date();
  
  const presets = [
    { type: 'Running', duration: 30, steps: 4200, calories: 310, daysAgo: 0 },
    { type: 'Walking', duration: 40, steps: 4500, calories: 160, daysAgo: 1 },
    { type: 'Cycling', duration: 45, steps: 0, calories: 380, daysAgo: 2 },
    { type: 'Strength Training', duration: 50, steps: 1200, calories: 290, daysAgo: 3 },
    { type: 'Running', duration: 35, steps: 4800, calories: 360, daysAgo: 4 },
    { type: 'HIIT', duration: 25, steps: 2100, calories: 280, daysAgo: 5 },
    { type: 'Walking', duration: 50, steps: 5600, calories: 200, daysAgo: 6 }
  ];

  presets.forEach((p, idx) => {
    const d = new Date(now);
    d.setDate(d.getDate() - p.daysAgo);
    const dateStr = d.toISOString().split('T')[0];

    activities.push({
      id: `act-seed-${idx + 1}`,
      type: p.type,
      duration: p.duration,
      steps: p.steps,
      calories: p.calories,
      date: dateStr,
      notes: 'Logged activity',
      isManual: true
    });
  });

  return activities;
}

export class FitnessStorageService {
  /**
   * Loads user activity logs from LocalStorage.
   * @returns {Array<Object>}
   */
  static loadActivities() {
    try {
      const data = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
      if (!data) {
        const starterData = generateStarterActivities();
        this.saveActivities(starterData);
        return starterData;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('LocalStorage error while reading activities. Using in-memory starter data.', e);
      return generateStarterActivities();
    }
  }

  /**
   * Saves activity logs to LocalStorage.
   * @param {Array<Object>} activities 
   */
  static saveActivities(activities) {
    try {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
      return true;
    } catch (e) {
      console.error('Failed to save activities to LocalStorage:', e);
      return false;
    }
  }

  /**
   * Loads daily fitness goals.
   * @returns {Object}
   */
  static loadGoals() {
    try {
      const data = localStorage.getItem(GOALS_STORAGE_KEY);
      if (!data) return { ...DEFAULT_GOALS };
      return { ...DEFAULT_GOALS, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_GOALS };
    }
  }

  /**
   * Saves daily fitness goals.
   * @param {Object} goals 
   */
  static saveGoals(goals) {
    try {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Clears all recorded activities.
   */
  static clearAllActivities() {
    try {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify([]));
      return true;
    } catch (e) {
      return false;
    }
  }
}
