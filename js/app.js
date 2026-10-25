/**
 * CodeAlpha - Fitness Tracker App
 * Dashboard Controller: Manages state, UI updates, SVG chart coordination, and modal workflows.
 */

import { FitnessStorageService } from './storage.js';
import { FitnessTrackerModel } from './tracker-model.js';
import { ChartRenderer } from './chart-renderer.js';

class FitnessApp {
  constructor() {
    const activities = FitnessStorageService.loadActivities();
    const goals = FitnessStorageService.loadGoals();
    this.model = new FitnessTrackerModel(activities, goals);
    this.activeChartMetric = 'duration';

    this.cacheDOMElements();
    this.bindEvents();
    this.render();
  }

  cacheDOMElements() {
    // Today's Metric Values
    this.todayStepsVal = document.getElementById('todayStepsVal');
    this.todayStepsSub = document.getElementById('todayStepsSub');
    this.stepsRingCircle = document.getElementById('stepsRingCircle');
    this.stepsRingPercent = document.getElementById('stepsRingPercent');

    this.todayCaloriesVal = document.getElementById('todayCaloriesVal');
    this.todayCaloriesSub = document.getElementById('todayCaloriesSub');
    this.caloriesRingCircle = document.getElementById('caloriesRingCircle');
    this.caloriesRingPercent = document.getElementById('caloriesRingPercent');

    this.todayMinutesVal = document.getElementById('todayMinutesVal');
    this.todayMinutesSub = document.getElementById('todayMinutesSub');
    this.minutesRingCircle = document.getElementById('minutesRingCircle');
    this.minutesRingPercent = document.getElementById('minutesRingPercent');

    // Weekly Rollup Elements
    this.weeklyWorkoutsVal = document.getElementById('weeklyWorkoutsVal');
    this.weeklyMinutesVal = document.getElementById('weeklyMinutesVal');
    this.weeklyStepsVal = document.getElementById('weeklyStepsVal');
    this.weeklyCaloriesVal = document.getElementById('weeklyCaloriesVal');

    // Chart Elements
    this.chartContainer = document.getElementById('weeklyChartContainer');
    this.chartMetricButtons = document.querySelectorAll('.btn-chart-metric');

    // Table
    this.activityTableBody = document.getElementById('activityTableBody');
    this.noActivitiesNotice = document.getElementById('noActivitiesNotice');

    // Log Activity Modal
    this.btnOpenLogModal = document.getElementById('btnOpenLogModal');
    this.logModal = document.getElementById('logModal');
    this.btnCloseLogModal = document.getElementById('btnCloseLogModal');
    this.btnCancelLog = document.getElementById('btnCancelLog');
    this.logForm = document.getElementById('logForm');
    this.inputType = document.getElementById('inputType');
    this.inputDuration = document.getElementById('inputDuration');
    this.inputSteps = document.getElementById('inputSteps');
    this.inputCalories = document.getElementById('inputCalories');
    this.inputDate = document.getElementById('inputDate');
    this.inputNotes = document.getElementById('inputNotes');

    // Goals Modal
    this.btnOpenGoalsModal = document.getElementById('btnOpenGoalsModal');
    this.goalsModal = document.getElementById('goalsModal');
    this.btnCloseGoalsModal = document.getElementById('btnCloseGoalsModal');
    this.btnCancelGoals = document.getElementById('btnCancelGoals');
    this.goalsForm = document.getElementById('goalsForm');
    this.goalStepsInput = document.getElementById('goalStepsInput');
    this.goalCaloriesInput = document.getElementById('goalCaloriesInput');
    this.goalMinutesInput = document.getElementById('goalMinutesInput');

    // Toast Container
    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Log Activity Modal Open/Close
    this.btnOpenLogModal.addEventListener('click', () => this.openLogModal());
    this.btnCloseLogModal.addEventListener('click', () => this.closeLogModal());
    this.btnCancelLog.addEventListener('click', () => this.closeLogModal());
    this.logModal.addEventListener('click', (e) => {
      if (e.target === this.logModal) this.closeLogModal();
    });

    // Auto-estimate calories on duration or exercise type change
    this.inputType.addEventListener('change', () => this.updateEstimatedCalories());
    this.inputDuration.addEventListener('input', () => this.updateEstimatedCalories());

    // Submit activity log
    this.logForm.addEventListener('submit', (e) => this.handleLogSubmit(e));

    // Goals Modal Open/Close
    this.btnOpenGoalsModal.addEventListener('click', () => this.openGoalsModal());
    this.btnCloseGoalsModal.addEventListener('click', () => this.closeGoalsModal());
    this.btnCancelGoals.addEventListener('click', () => this.closeGoalsModal());
    this.goalsModal.addEventListener('click', (e) => {
      if (e.target === this.goalsModal) this.closeGoalsModal();
    });

    // Submit goals update
    this.goalsForm.addEventListener('submit', (e) => this.handleGoalsSubmit(e));

    // Chart metric switcher
    this.chartMetricButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.chartMetricButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.activeChartMetric = btn.dataset.metric;
        this.renderChart();
      });
    });

    // Global keyboard Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLogModal();
        this.closeGoalsModal();
      }
    });
  }

  openLogModal() {
    this.logForm.reset();
    this.inputDate.value = new Date().toISOString().split('T')[0];
    this.updateEstimatedCalories();
    this.logModal.classList.add('is-active');
    setTimeout(() => this.inputDuration.focus(), 100);
  }

  closeLogModal() {
    this.logModal.classList.remove('is-active');
  }

  updateEstimatedCalories() {
    const type = this.inputType.value;
    const duration = Number(this.inputDuration.value) || 0;
    if (duration > 0) {
      const estimated = FitnessTrackerModel.estimateCalories(type, duration);
      this.inputCalories.value = estimated;
    }
  }

  handleLogSubmit(e) {
    e.preventDefault();
    const data = {
      type: this.inputType.value,
      duration: this.inputDuration.value,
      steps: this.inputSteps.value || 0,
      calories: this.inputCalories.value || 0,
      date: this.inputDate.value,
      notes: this.inputNotes.value
    };

    try {
      this.model.addActivity(data);
      FitnessStorageService.saveActivities(this.model.activities);
      this.closeLogModal();
      this.render();
      this.showToast(`Logged ${data.type} (${data.duration} mins) successfully!`);
    } catch (err) {
      alert(`Validation error: ${err.message}`);
    }
  }

  openGoalsModal() {
    this.goalStepsInput.value = this.model.goals.dailySteps;
    this.goalCaloriesInput.value = this.model.goals.dailyCalories;
    this.goalMinutesInput.value = this.model.goals.dailyMinutes;
    this.goalsModal.classList.add('is-active');
  }

  closeGoalsModal() {
    this.goalsModal.classList.remove('is-active');
  }

  handleGoalsSubmit(e) {
    e.preventDefault();
    const newGoals = {
      dailySteps: Math.max(100, Number(this.goalStepsInput.value)),
      dailyCalories: Math.max(50, Number(this.goalCaloriesInput.value)),
      dailyMinutes: Math.max(5, Number(this.goalMinutesInput.value))
    };

    this.model.setGoals(newGoals);
    FitnessStorageService.saveGoals(newGoals);
    this.closeGoalsModal();
    this.render();
    this.showToast('Daily fitness goals updated!');
  }

  deleteActivity(id) {
    if (confirm('Are you sure you want to delete this activity log?')) {
      this.model.deleteActivity(id);
      FitnessStorageService.saveActivities(this.model.activities);
      this.render();
      this.showToast('Activity record removed.');
    }
  }

  render() {
    this.renderTodayProgress();
    this.renderWeeklyRollup();
    this.renderChart();
    this.renderActivityTable();
  }

  renderTodayProgress() {
    const today = this.model.getDailyProgress();

    // Steps
    this.todayStepsVal.textContent = today.totalSteps.toLocaleString();
    this.todayStepsSub.textContent = `Goal: ${today.stepsGoal.toLocaleString()} steps`;
    this.stepsRingPercent.textContent = `${today.stepsGoalPercent}%`;
    ChartRenderer.updateProgressRing(this.stepsRingCircle, today.stepsGoalPercent, 36);

    // Calories
    this.todayCaloriesVal.textContent = today.totalCalories.toLocaleString();
    this.todayCaloriesSub.textContent = `Goal: ${today.caloriesGoal.toLocaleString()} kcal`;
    this.caloriesRingPercent.textContent = `${today.caloriesGoalPercent}%`;
    ChartRenderer.updateProgressRing(this.caloriesRingCircle, today.caloriesGoalPercent, 36);

    // Active Minutes
    this.todayMinutesVal.textContent = today.totalMinutes;
    this.todayMinutesSub.textContent = `Goal: ${today.minutesGoal} mins`;
    this.minutesRingPercent.textContent = `${today.minutesGoalPercent}%`;
    ChartRenderer.updateProgressRing(this.minutesRingCircle, today.minutesGoalPercent, 36);
  }

  renderWeeklyRollup() {
    const rollup = this.model.getWeeklySummary();
    this.weeklyWorkoutsVal.textContent = rollup.totalWorkouts;
    this.weeklyMinutesVal.textContent = `${rollup.totalMinutes}m`;
    this.weeklyStepsVal.textContent = rollup.totalSteps.toLocaleString();
    this.weeklyCaloriesVal.textContent = rollup.totalCalories.toLocaleString();
  }

  renderChart() {
    const past7DaysData = this.model.getPast7DaysData();
    ChartRenderer.renderWeeklyBarChart(this.chartContainer, past7DaysData, this.activeChartMetric);
  }

  renderActivityTable() {
    const activities = this.model.activities;
    this.activityTableBody.innerHTML = '';

    if (activities.length === 0) {
      this.noActivitiesNotice.style.display = 'block';
      return;
    }

    this.noActivitiesNotice.style.display = 'none';

    activities.forEach(act => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${act.date}</strong></td>
        <td><span class="badge-type">${act.type}</span></td>
        <td>${act.duration} mins</td>
        <td>${act.calories.toLocaleString()} kcal</td>
        <td>${act.steps > 0 ? act.steps.toLocaleString() : '—'}</td>
        <td style="color: var(--text-dim); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${act.notes || '—'}
        </td>
        <td style="text-align: right;">
          <button class="btn-delete-row" title="Delete record" data-id="${act.id}">🗑️</button>
        </td>
      `;

      tr.querySelector('.btn-delete-row').addEventListener('click', () => {
        this.deleteActivity(act.id);
      });

      this.activityTableBody.appendChild(tr);
    });
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new FitnessApp();
});
