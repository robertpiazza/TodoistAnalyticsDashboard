import { createCompletedTasksChart } from './completed-tasks-chart.js';
import { createComparisonChart } from './comparison-chart.js';
import { createCalendarChart } from './calendar-chart.js';
import { createNonChartDataTiles } from './non-chart-data-tiles.js';
import { createMostActiveDaysChart } from './activity-by-weekdays-chart.js';
import demoDataUrl from 'url:../demo.json';

initializeTooltips();

loadDemoData();

addListenerForUserDataInput();

function addListenerForUserDataInput() {
  const fileInput = document.getElementById('data');

  fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        const data = JSON.parse(fileContent);

        createCharts(data);
      };
      reader.readAsText(selectedFile);
    }
  });
}

function initializeTooltips() {
  document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });
}

function loadDemoData() {
  fetch(demoDataUrl)
    .then(response => response.json())
    .then(data => {
      createCharts(data);
    })
    .catch(error => console.error('Error:', error));
}

function createCharts(data) {
  if (!data.completed?.items?.length) {
    showError(
      'No completed tasks found in this export. The Todoist API only returns ' +
      'completed task history for paid (Pro/Business) plans. If you are on a ' +
      'free plan, please use the demo data or upgrade your Todoist subscription.'
    );
    return;
  }
  createCompletedTasksChart(data);
  createMostActiveDaysChart(data);
  createNonChartDataTiles(data);
  createComparisonChart(data);
  createCalendarChart(data);
}

function showError(message) {
  const existing = document.getElementById('dashboard-error');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.id = 'dashboard-error';
  alert.className = 'alert alert-warning alert-dismissible mx-3 mt-3';
  alert.setAttribute('role', 'alert');
  alert.innerHTML = `<strong>Could not load data:</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

  document.querySelector('main').prepend(alert);
}

