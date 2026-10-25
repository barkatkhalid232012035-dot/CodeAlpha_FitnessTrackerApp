/**
 * CodeAlpha - Fitness Tracker App
 * ChartRenderer: Pure SVG dynamic visualization engine for 7-day bar charts and circular progress rings.
 * Zero external libraries required; 100% offline and responsive.
 */

export class ChartRenderer {
  /**
   * Renders a responsive SVG 7-day bar chart inside a container element.
   * @param {HTMLElement} container 
   * @param {Array<Object>} past7DaysData - Array of { dayLabel, calories, duration, steps, date }
   * @param {'duration'|'calories'|'steps'} metric - Active metric to display
   */
  static renderWeeklyBarChart(container, past7DaysData, metric = 'duration') {
    if (!container) return;

    const values = past7DaysData.map(d => d[metric] || 0);
    const maxVal = Math.max(...values, metric === 'calories' ? 400 : 30);
    const unit = metric === 'duration' ? 'mins' : (metric === 'calories' ? 'kcal' : 'steps');
    const color = metric === 'duration' ? '#0ea5e9' : (metric === 'calories' ? '#f43f5e' : '#10b981');

    const width = 640;
    const height = 240;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const barWidth = 38;
    const stepX = chartWidth / past7DaysData.length;

    // Build grid lines and labels
    const gridLines = [0, 0.25, 0.5, 0.75, 1.0].map(fraction => {
      const y = padding.top + chartHeight * (1 - fraction);
      const labelVal = Math.round(maxVal * fraction);
      return `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3 3"/>
        <text x="${padding.left - 8}" y="${y + 4}" fill="#94a3b8" font-size="11" text-anchor="end">${labelVal}</text>
      `;
    }).join('');

    // Build bars and day labels
    const bars = past7DaysData.map((d, i) => {
      const val = d[metric] || 0;
      const barH = (val / maxVal) * chartHeight;
      const x = padding.left + i * stepX + (stepX - barWidth) / 2;
      const y = padding.top + chartHeight - barH;
      const isToday = i === past7DaysData.length - 1;

      return `
        <g class="chart-bar-group" data-val="${val}" data-label="${d.dayLabel} (${d.date})" data-unit="${unit}">
          <!-- Hover background trigger -->
          <rect x="${x - 4}" y="${padding.top}" width="${barWidth + 8}" height="${chartHeight}" fill="transparent" class="bar-hitbox"/>
          <!-- Value bar -->
          <rect x="${x}" y="${y}" width="${barWidth}" height="${Math.max(2, barH)}" rx="5" 
                fill="${isToday ? 'url(#activeBarGrad)' : color}" opacity="${isToday ? '1' : '0.85'}" 
                class="chart-bar"/>
          <!-- Top value text -->
          ${val > 0 ? `<text x="${x + barWidth / 2}" y="${y - 8}" fill="#ffffff" font-size="11" font-weight="600" text-anchor="middle">${val}</text>` : ''}
          <!-- X Axis Day label -->
          <text x="${x + barWidth / 2}" y="${height - 15}" fill="${isToday ? '#38bdf8' : '#94a3b8'}" 
                font-size="12" font-weight="${isToday ? '700' : '500'}" text-anchor="middle">${d.dayLabel}</text>
        </g>
      `;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="svg-chart" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="activeBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#4f46e5" />
          </linearGradient>
        </defs>
        ${gridLines}
        ${bars}
      </svg>
    `;
  }

  /**
   * Updates an SVG circular progress ring.
   * @param {SVGElement} circleEl - SVG <circle> element with stroke-dasharray
   * @param {number} percentage - 0 to 100+
   * @param {number} radius - Circle radius in pixels
   */
  static updateProgressRing(circleEl, percentage, radius = 40) {
    if (!circleEl) return;
    const circumference = 2 * Math.PI * radius;
    circleEl.style.strokeDasharray = `${circumference} ${circumference}`;

    const clampedPercent = Math.min(100, Math.max(0, percentage));
    const offset = circumference - (clampedPercent / 100) * circumference;
    circleEl.style.strokeDashoffset = offset;
  }
}
