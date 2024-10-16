document.addEventListener('DOMContentLoaded', function() {
    let testDateInput = document.getElementById('testDate');
    let startDateInput = document.getElementById('startDate');
    let totalQuestionsInput = document.getElementById('totalQuestions');
    let newQuestionsInput = document.getElementById('newQuestions');
    let updateDataButton = document.getElementById('updateData');

    let countdownDisplay = document.getElementById('countdown');
    let questionsPerDayNeededDisplay = document.getElementById('questionsPerDayNeeded');
    let actualQuestionsPerDayDisplay = document.getElementById('actualQuestionsPerDay');
    let completedQuestionsDisplay = document.getElementById('completedQuestions');
    let percentCompletedDisplay = document.getElementById('percentCompleted');

    let totalQuestionsCompleted = 0;
    let chartInstance = null;

    function loadSavedData() {
        if (localStorage.getItem('testDate')) testDateInput.value = localStorage.getItem('testDate');
        if (localStorage.getItem('startDate')) startDateInput.value = localStorage.getItem('startDate');
        if (localStorage.getItem('totalQuestions')) totalQuestionsInput.value = localStorage.getItem('totalQuestions');
        if (localStorage.getItem('totalQuestionsCompleted')) totalQuestionsCompleted = parseInt(localStorage.getItem('totalQuestionsCompleted'));
    }

    function saveData() {
        localStorage.setItem('testDate', testDateInput.value);
        localStorage.setItem('startDate', startDateInput.value);
        localStorage.setItem('totalQuestions', totalQuestionsInput.value);
        localStorage.setItem('totalQuestionsCompleted', totalQuestionsCompleted);
    }

    function calculateAndDisplayData() {
        let testDate = new Date(testDateInput.value);
        let startDate = new Date(startDateInput.value);
        let totalQuestions = parseInt(totalQuestionsInput.value) || 0;
        let newQuestionsCompleted = parseInt(newQuestionsInput.value) || 0;

        if (isNaN(totalQuestions) || isNaN(newQuestionsCompleted)) {
            totalQuestions = 0;
            newQuestionsCompleted = 0;
        }

        let now = new Date();
        let daysUntilTest = Math.ceil((testDate - now) / (1000 * 60 * 60 * 24));
        let daysSinceStart = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));

        // Adding new questions completed to total questions completed
        totalQuestionsCompleted += newQuestionsCompleted;
        newQuestionsInput.value = 0; // Reset new questions input field

        let questionsPerDayNeeded = daysUntilTest > 0 ? (totalQuestions - totalQuestionsCompleted) / daysUntilTest : 0;
        let actualQuestionsPerDay = daysSinceStart > 0 ? totalQuestionsCompleted / daysSinceStart : 0;

        let percentCompleted = (totalQuestionsCompleted / totalQuestions) * 100;

        countdownDisplay.textContent = daysUntilTest;
        questionsPerDayNeededDisplay.textContent = questionsPerDayNeeded.toFixed(2);
        actualQuestionsPerDayDisplay.textContent = actualQuestionsPerDay.toFixed(2);
        completedQuestionsDisplay.textContent = totalQuestionsCompleted;
        percentCompletedDisplay.textContent = percentCompleted.toFixed(2) + '%';

        updateChart(totalQuestionsCompleted, totalQuestions);

        saveData(); // Save data after updating
    }

    function updateChart(completed, total) {
        if (chartInstance) {
            chartInstance.destroy(); // Destroy previous chart instance
        }
        let ctx = document.getElementById('progressChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [completed, total - completed],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw;
                            }
                        }
                    }
                }
            }
        });
    }

    updateDataButton.addEventListener('click', function() {
        calculateAndDisplayData();
    });

    loadSavedData();
    calculateAndDisplayData();
});
