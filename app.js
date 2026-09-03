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
    // ... extend as needed
];

let currentFilter = 'All';
let currentSearch = '';

function setFilter(category) {
    currentFilter = category;
    applyFilters();
}

function applyFilters() {
    currentSearch = document.getElementById('search-input').value.toLowerCase();
    renderExercises();
}

function renderExercises() {
    const list = document.getElementById('exercise-list');
    list.innerHTML = '';
    exercises.forEach(ex => {
        if ((currentFilter === 'All' || ex.category === currentFilter) &&
            ex.name.toLowerCase().includes(currentSearch)) {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.onclick = () => addExerciseToWorkout(ex.id);
            const img = document.createElement('img');
            img.src = ex.image;
            img.alt = ex.name;
            card.appendChild(img);
            const info = document.createElement('div');
            info.className = 'exercise-info';
            const title = document.createElement('h3');
            title.innerText = ex.name;
            info.appendChild(title);
            const details = document.createElement('p');
            details.innerText = ex.category;
            info.appendChild(details);
            card.appendChild(info);
            list.appendChild(card);
        }
    });
}

function showLibrary() {
    document.getElementById('library-screen').style.display = '';
    document.getElementById('workout-screen').style.display = 'none';
}

function showWorkout() {
    document.getElementById('library-screen').style.display = 'none';
    document.getElementById('workout-screen').style.display = '';
    renderWorkout();
}

// Workout logic
let workout = [];

function populateExerciseSelect() {
    const sel = document.getElementById('select-exercise');
    sel.innerHTML = '<option value="">Choose...</option>';
    exercises.forEach(ex => {
        const o = document.createElement('option');
        o.value = ex.id;
        o.innerText = ex.name;
        sel.appendChild(o);
    });
}

function addExerciseToWorkout(id) {
    let exId = id;
    if (!exId) {
        const sel = document.getElementById('select-exercise');
        exId = parseInt(sel.value);
        if (!exId) return;
    }
    if (workout.find(w => w.id === exId)) return;
    const ex = exercises.find(e => e.id === exId);
    if (!ex) return;
    workout.push({ id: exId, name: ex.name, sets: [] });
    renderWorkout();
}

function renderWorkout() {
    populateExerciseSelect();
    const container = document.getElementById('workout-exercises');
    container.innerHTML = '';
    workout.forEach((w, wi) => {
        const div = document.createElement('div');
        div.className = 'workout-exercise';
        const title = document.createElement('h3');
        title.innerText = w.name;
        div.appendChild(title);
        // Sets
        w.sets.forEach((s, si) => {
            const row = document.createElement('div');
            row.className = 'set-row';
            const weight = document.createElement('input');
            weight.type = 'number';
            weight.value = s.weight;
            weight.placeholder = 'Weight';
            weight.onchange = (e) => { w.sets[si].weight = e.target.value; };
            const reps = document.createElement('input');
            reps.type = 'number';
            reps.value = s.reps;
            reps.placeholder = 'Reps';
            reps.onchange = (e) => { w.sets[si].reps = e.target.value; };
            const rpe = document.createElement('input');
            rpe.type = 'number';
            rpe.value = s.rpe;
            rpe.placeholder = 'RPE';
            rpe.onchange = (e) => { w.sets[si].rpe = e.target.value; };
            const remove = document.createElement('button');
            remove.innerText = 'Remove Set';
            remove.onclick = () => { w.sets.splice(si,1); renderWorkout(); };
            row.appendChild(weight);
            row.appendChild(reps);
            row.appendChild(rpe);
            row.appendChild(remove);
            div.appendChild(row);
        });
        const addSetBtn = document.createElement('button');
        addSetBtn.innerText = 'Add Set';
        addSetBtn.onclick = () => { w.sets.push({ weight:'', reps:'', rpe:'' }); renderWorkout(); };
        div.appendChild(addSetBtn);
        // Remove exercise
        const removeExBtn = document.createElement('button');
        removeExBtn.innerText = 'Remove Exercise';
        removeExBtn.onclick = () => { workout.splice(wi,1); renderWorkout(); };
        div.appendChild(removeExBtn);
        container.appendChild(div);
    });
}

function saveWorkout() {
    const summaryDiv = document.getElementById('workout-summary');
    const saved = JSON.parse(localStorage.getItem('workouts') || '[]');
    saved.push({ date: new Date().toISOString(), exercises: JSON.parse(JSON.stringify(workout)) });
    localStorage.setItem('workouts', JSON.stringify(saved));
    summaryDiv.innerText = 'Workout saved (' + saved.length + ').';
    // reset
    workout = [];
    renderWorkout();
}

// Initialize
applyFilters();
populateExerciseSelect();
