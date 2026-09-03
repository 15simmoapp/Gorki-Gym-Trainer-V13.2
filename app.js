// Basic navigation and localStorage foundations
function showScreen(screen) {
    const screens = ['home', 'quick-workout', 'workout', 'history', 'progress'];
    screens.forEach(s => {
        const el = document.getElementById(s + '-screen');
        if (el) el.classList.remove('active');
    });
    const activeEl = document.getElementById(screen + '-screen');
    if (activeEl) activeEl.classList.add('active');
}

// Initialize sample exercise library
const exerciseLibrary = [
    { name: 'Bench Press', image: 'assets/exercises/bench.png', muscles: ['Chest','Triceps'], last: '80kg x 8', best: '90kg x 5' },
    { name: 'Squat', image: 'assets/exercises/back-squat.png', muscles: ['Legs'], last: '100kg x 5', best: '110kg x 3' }
];

// Local storage functions
function saveWorkout(workout) {
    let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}
function loadWorkouts() {
    return JSON.parse(localStorage.getItem('workouts') || '[]');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-quick-btn').addEventListener('click', () => showScreen('quick-workout'));
    document.getElementById('continue-workout-btn').addEventListener('click', () => showScreen('workout'));
    document.getElementById('view-progress-btn').addEventListener('click', () => showScreen('progress'));
    // default screen
    showScreen('home');
});
