// Exercise Library Data
const exercises = [
    { id: 1, name: 'Bench Press', category: 'Chest', primary: ['Chest'], secondary: ['Triceps'], image: 'Assets/exercises/bench.png' },
    { id: 2, name: 'Back Squat', category: 'Legs', primary: ['Legs'], secondary: ['Core'], image: 'Assets/exercises/back-squat.png' },
    { id: 3, name: 'Romanian Deadlift (RDL)', category: 'Legs', primary: ['Legs'], secondary: ['Back'], image: 'Assets/exercises/rdl.png' },
    { id: 4, name: 'Incline Press', category: 'Chest', primary: ['Upper Chest'], secondary: ['Triceps'], image: 'Assets/exercises/incline-press.png' },
    { id: 5, name: 'Row', category: 'Back', primary: ['Back'], secondary: ['Biceps'], image: 'Assets/exercises/row.png' },
    { id: 6, name: 'Pulldown', category: 'Back', primary: ['Back'], secondary: ['Biceps'], image: 'Assets/exercises/pulldown.png' },
    { id: 7, name: 'Cable Fly', category: 'Chest', primary: ['Chest'], secondary: [], image: 'Assets/exercises/cable-fly.png' },
    { id: 8, name: 'Shoulder Press', category: 'Shoulders', primary: ['Shoulders'], secondary: ['Triceps'], image: 'Assets/exercises/shoulder-press.png' }
];

let currentFilter = '';
let currentSearch = '';

function renderExercises() {
    const listEl = document.getElementById('exercise-list');
    listEl.innerHTML = '';
    const filtered = exercises.filter(ex => {
        const matchCategory = currentFilter === '' || ex.category === currentFilter;
        const matchSearch = ex.name.toLowerCase().includes(currentSearch.toLowerCase());
        return matchCategory && matchSearch;
    });
    if (filtered.length === 0) {
        listEl.innerHTML = '<p>No exercises found.</p>';
        return;
    }
    filtered.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.onclick = () => showDetail(ex.id);
        const img = document.createElement('img');
        img.src = ex.image;
        img.alt = ex.name;
        const info = document.createElement('div');
        info.className = 'card-info';
        const title = document.createElement('h3'); title.innerText = ex.name;
        const muscles = document.createElement('p'); muscles.innerText = ex.primary.concat(ex.secondary.length ? [', '] : []).concat(ex.secondary).join(', ');
        info.appendChild(title);
        info.appendChild(muscles);
        card.appendChild(img);
        card.appendChild(info);
        listEl.appendChild(card);
    });
}

function setFilter(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    applyFilters();
}

function applyFilters() {
    currentSearch = document.getElementById('search-input').value;
    renderExercises();
}

function showDetail(id) {
    const ex = exercises.find(e => e.id === id);
    if (!ex) return;
    document.getElementById('detail-img').src = ex.image;
    document.getElementById('detail-img').alt = ex.name;
    document.getElementById('detail-name').innerText = ex.name;
        let muscleText = 'Primary: ' + ex.primary.join(', ');
        if (ex.secondary.length) {
            muscleText += ' | Secondary: ' + ex.secondary.join(', ');
        }
        document.getElementById('detail-muscles').innerText = muscleText;
    // Placeholder tips
    document.getElementById('detail-tips').innerHTML = '<h3>Coaching Tips</h3><p>To be added...</p>';
    showScreen('detail');
}

function showLibrary() {
    showScreen('library');
}

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (name === 'library') {
        document.getElementById('library-section').classList.add('active');
    } else if (name === 'detail') {
        document.getElementById('detail-section').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderExercises();
});