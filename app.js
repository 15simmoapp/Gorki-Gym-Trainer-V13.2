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
            card.onclick = () => { addExerciseToWorkout(ex.id); showWorkout(); };
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

function showHome() {
    document.getElementById('home-screen').style.display = '';
    document.getElementById('library-screen').style.display = 'none';
    document.getElementById('workout-screen').style.display = 'none';
    document.getElementById('history-screen').style.display = 'none';
    document.getElementById('detail-screen').style.display = 'none';
    renderHome();
}

function showLibrary() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('library-screen').style.display = '';
    document.getElementById('workout-screen').style.display = 'none';
    document.getElementById('history-screen').style.display = 'none';
}

function showWorkout() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('library-screen').style.display = 'none';
    document.getElementById('workout-screen').style.display = '';
    document.getElementById('history-screen').style.display = 'none';
    document.getElementById('detail-screen').style.display = 'none';
    renderWorkout();
}

function showHistory() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('library-screen').style.display = 'none';
    document.getElementById('workout-screen').style.display = 'none';
    document.getElementById('history-screen').style.display = '';
    document.getElementById('history-list').style.display = '';
    document.getElementById('detail-screen').style.display = 'none';
    renderHistory();
}

function showDetail(index) {
    document.getElementById('detail-screen').style.display = '';
    document.getElementById('history-list').style.display = 'none';
    renderDetail(index);
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
    workout.push({ id: exId, name: ex.name, image: ex.image, sets: [] });
    renderWorkout();
}

function getLastPerformance(exerciseId) {
    const data = JSON.parse(localStorage.getItem('workouts') || '[]');
    for (let i = data.length - 1; i >= 0; i--) {
        const wk = data[i];
        for (let ex of wk.exercises) {
            if (ex.id === exerciseId && ex.sets && ex.sets.length) {
                for (let si = ex.sets.length - 1; si >= 0; si--) {
                    const s = ex.sets[si];
                    if (s.weight && s.reps) {
                        return { weight: s.weight, reps: s.reps, rpe: s.rpe };
                    }
                }
            }
        }
    }
    return null;
}

function renderWorkout() {
    populateExerciseSelect();
    const container = document.getElementById('workout-exercises');
    container.innerHTML = '';
    workout.forEach((w, wi) => {
        const div = document.createElement('div');
        div.className = 'workout-exercise';
        const img = document.createElement('img');
        img.src = w.image;
        img.alt = w.name;
        div.appendChild(img);
        const title = document.createElement('h3');
        title.innerText = w.name;
        div.appendChild(title);
        const last = getLastPerformance(w.id);
        if (last) {
            const prev = document.createElement('p');
            prev.innerText = `Last: ${last.weight}kg x ${last.reps} @ ${last.rpe}`;
            div.appendChild(prev);
        }
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
    workout = [];
    renderWorkout();
}

// History and Detail logic
function renderHistory() {
    const listDiv = document.getElementById('history-list');
    listDiv.innerHTML = '';
    const data = JSON.parse(localStorage.getItem('workouts') || '[]');
    data.forEach((wk, i) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const date = new Date(wk.date).toLocaleString();
        item.innerText = date + ' - ' + wk.exercises.length + ' exercises';
        item.onclick = () => showDetail(i);
        listDiv.appendChild(item);
    });
}

function renderDetail(index) {
    const content = document.getElementById('detail-content');
    content.innerHTML = '';
    const data = JSON.parse(localStorage.getItem('workouts') || '[]');
    if (data[index]) {
        const wk = data[index];
        const date = document.createElement('h3');
        date.innerText = 'Workout on ' + new Date(wk.date).toLocaleString();
        content.appendChild(date);
        wk.exercises.forEach(ex => {
            const exDiv = document.createElement('div');
            exDiv.className = 'workout-exercise';
            const title = document.createElement('h4');
            title.innerText = ex.name;
            exDiv.appendChild(title);
            ex.sets.forEach((s, si) => {
                const p = document.createElement('p');
                p.innerText = `Set ${si+1}: ${s.weight}kg x ${s.reps} @ ${s.rpe}`;
                exDiv.appendChild(p);
            });
            const hist = getExerciseHistory(ex.id);
            if (hist && hist.length) {
                const hTitle = document.createElement('p');
                hTitle.innerText = 'Exercise history:';
                exDiv.appendChild(hTitle);
                hist.forEach(hs => {
                    const hp = document.createElement('p');
                    const dt = new Date(hs.date).toLocaleDateString();
                    hp.innerText = dt + ': ' + hs.sets.map(s => `${s.weight}kg x ${s.reps} @ ${s.rpe}`).join(', ');
                    exDiv.appendChild(hp);
                });
            }
            content.appendChild(exDiv);
        });
    }
}

function getExerciseHistory(exerciseId) {
    const data = JSON.parse(localStorage.getItem('workouts') || '[]');
    let history = [];
    data.forEach(wk => {
        const ex = wk.exercises.find(e => e.id === exerciseId);
        if (ex && ex.sets && ex.sets.length) {
            history.push({ date: wk.date, sets: JSON.parse(JSON.stringify(ex.sets)) });
        }
    });
    return history;
}

// Home Dashboard logic
function renderHome() {
    // Last session summary
    const lastDiv = document.getElementById('last-session-content');
    const data = JSON.parse(localStorage.getItem('workouts') || '[]');
    if (data.length === 0) {
        lastDiv.innerText = 'No sessions saved.';
    } else {
        const last = data[data.length-1];
        const dateStr = new Date(last.date).toLocaleString();
        lastDiv.innerHTML = `<strong>${dateStr}</strong><br/>`;
        last.exercises.forEach(ex => {
            lastDiv.innerHTML += `${ex.name}: `;
            ex.sets.forEach((s, idx) => {
                lastDiv.innerHTML += `Set ${idx+1}: ${s.weight}kg x ${s.reps} @ ${s.rpe}<br/>`;
            });
        });
    }
    // Recent workouts
    const recentDiv = document.getElementById('recent-list');
    recentDiv.innerHTML = '';
    if (data.length === 0) {
        recentDiv.innerText = 'No recent workouts.';
    } else {
        // show last 3
        const recent = data.slice(-3).reverse();
        recent.forEach(wk => {
            const item = document.createElement('div');
            const date = new Date(wk.date).toLocaleString();
            item.innerText = date + ' - ' + wk.exercises.length + ' exercises';
            recentDiv.appendChild(item);
        });
    }
    // Stats placeholder
    document.getElementById('stats-content').innerText = 'Training stats coming soon.';
    // Favourites placeholder
    document.getElementById('favourites-list').innerText = 'Favourite exercises feature TBD.';
}

// Initialise on load
showHome();
applyFilters();
populateExerciseSelect();
