/**
 * CodeAlpha - Fitness Tracker App
 * FitnessTrackerModel: Business logic, validation, calorie estimation, and aggregation algorithms.
 */

export const ACTIVITY_CALORIE_RATES = {
  'Running': 10.5,
  'Cycling': 8.5,
  'Walking': 4.0,
  'Swimming': 9.0,
  'Strength Training': 6.0,
  'HIIT': 11.5,
  'Yoga': 3.5,
  'Other': 5.0
};

export class FitnessTrackerModel {
  /**
   * @param {Array<Object>} initialActivities 
   * @param {Object} goals 
   */
  constructor(initialActivities = [], goals = {}) {
    this.activities = Array.isArray(initialActivities) ? [...initialActivities] : [];
    this.goals = {
      dailySteps: 10000,
      dailyCalories: 500,
      dailyMinutes: 45,
      ...goals
    };
  }

  /**
   * Automatically estimates calories burned based on workout duration and exercise type.
   * This provides a helpful estimate while explicitly distinguishing user-logged activities.
   * @param {string} type 
   * @param {number} durationMinutes 
   * @returns {number}
   */
  static estimateCalories(type, durationMinutes) {
    const rate = ACTIVITY_CALORIE_RATES[type] || ACTIVITY_CALORIE_RATES['Other'];
    return Math.round(rate * Math.max(0, durationMinutes));
  }

  /**
   * Validates activity input fields.
   * @param {Object} data 
   * @returns {{isValid: boolean, errors: Object}}
   */
  static validateActivityData(data) {
    const errors = {};

    if (!data.type || typeof data.type !== 'string' || !data.type.trim()) {
      errors.type = 'Exercise type is required.';
    }

    const duration = Number(data.duration);
    if (isNaN(duration) || duration <= 0 || duration > 1440) {
      errors.duration = 'Duration must be between 1 and 1440 minutes.';
    }

    const steps = Number(data.steps ?? 0);
    if (isNaN(steps) || steps < 0 || steps > 100000) {
      errors.steps = 'Steps must be a non-negative number up to 100,000.';
    }

    const calories = Number(data.calories ?? 0);
    if (isNaN(calories) || calories < 0 || calories > 15000) {
      errors.calories = 'Calories must be a non-negative number up to 15,000.';
    }

    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      errors.date = 'Valid date (YYYY-MM-DD) is required.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Adds a new logged activity record.
   * @param {Object} data 
   * @returns {Object} Newly created activity record
   */
  addActivity(data) {
    const validation = FitnessTrackerModel.validateActivityData(data);
    if (!validation.isValid) {
      throw new Error(Object.values(validation.errors).join(' '));
    }

    const newActivity = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: data.type.trim(),
      duration: Math.round(Number(data.duration)),
      steps: Math.round(Number(data.steps || 0)),
      calories: Math.round(Number(data.calories || 0)),
      date: data.date,
      notes: (data.notes || '').trim(),
      isManual: true,
      createdAt: new Date().toISOString()
    };

    this.activities.unshift(newActivity);
    return newActivity;
  }

  /**
   * Deletes an activity record by ID.
   * @param {string} id 
   * @returns {boolean}
   */
  deleteActivity(id) {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.activities.splice(index, 1);
    return true;
  }

  /**
   * Computes daily progress metrics for a given date string (defaulting to today).
   * @param {string} [dateStr] - YYYY-MM-DD
   * @returns {Object}
   */
  getDailyProgress(dateStr = new Date().toISOString().split('T')[0]) {
    const dayActivities = this.activities.filter(a => a.date === dateStr);

    const totalSteps = dayActivities.reduce((acc, cur) => acc + (cur.steps || 0), 0);
    const totalCalories = dayActivities.reduce((acc, cur) => acc + (cur.calories || 0), 0);
    const totalMinutes = dayActivities.reduce((acc, cur) => acc + (cur.duration || 0), 0);

    const stepsGoalPercent = Math.min(100, Math.round((totalSteps / (this.goals.dailySteps || 1)) * 100));
    const caloriesGoalPercent = Math.min(100, Math.round((totalCalories / (this.goals.dailyCalories || 1)) * 100));
    const minutesGoalPercent = Math.min(100, Math.round((totalMinutes / (this.goals.dailyMinutes || 1)) * 100));

    return {
      date: dateStr,
      activityCount: dayActivities.length,
      totalSteps,
      totalCalories,
      totalMinutes,
      stepsGoal: this.goals.dailySteps,
      caloriesGoal: this.goals.dailyCalories,
      minutesGoal: this.goals.dailyMinutes,
      stepsGoalPercent,
      caloriesGoalPercent,
      minutesGoalPercent
    };
  }

  /**
   * Aggregates total metrics for the rolling past 7 days.
   * @returns {Object}
   */
  getWeeklySummary() {
    const sevenDaysData = this.getPast7DaysData();
    const totalSteps = sevenDaysData.reduce((acc, cur) => acc + cur.steps, 0);
    const totalCalories = sevenDaysData.reduce((acc, cur) => acc + cur.calories, 0);
    const totalMinutes = sevenDaysData.reduce((acc, cur) => acc + cur.duration, 0);
    const workoutCount = sevenDaysData.reduce((acc, cur) => acc + cur.workoutCount, 0);

    return {
      totalWorkouts: workoutCount,
      totalSteps,
      totalCalories,
      totalMinutes,
      avgDailyCalories: Math.round(totalCalories / 7),
      avgDailyMinutes: Math.round(totalMinutes / 7)
    };
  }

  /**
   * Generates formatted data for each of the past 7 days (including today).
   * @returns {Array<Object>}
   */
  getPast7DaysData() {
    const results = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? 'Today' : dayNames[d.getDay()];

      const dayLogs = this.activities.filter(a => a.date === dateStr);
      const daySteps = dayLogs.reduce((acc, cur) => acc + (cur.steps || 0), 0);
      const dayCalories = dayLogs.reduce((acc, cur) => acc + (cur.calories || 0), 0);
      const dayDuration = dayLogs.reduce((acc, cur) => acc + (cur.duration || 0), 0);

      results.push({
        date: dateStr,
        dayLabel,
        steps: daySteps,
        calories: dayCalories,
        duration: dayDuration,
        workoutCount: dayLogs.length
      });
    }

    return results;
  }

  /**
   * Updates daily target goals.
   * @param {Object} newGoals 
   */
  setGoals(newGoals) {
    this.goals = {
      ...this.goals,
      ...newGoals
    };
  }
}
