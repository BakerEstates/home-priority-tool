const state = {
    priorities: [],
    details: {},
    mustHaves: []
};

const placeholders = {
    Price: ['Monthly budget', 'Room for savings', 'Low property tax'],
    Location: ['Close to work', 'Good schools', 'Walkable neighborhood'],
    Features: ['3+ bedrooms', 'Big backyard', 'Modern kitchen']
};

function init() {
    document.querySelectorAll('.priority').forEach(btn => 
        btn.addEventListener('click', handlePriorityClick));
    document.getElementById('next1').addEventListener('click', showStep2);
    document.getElementById('next2').addEventListener('click', showStep3);
    document.getElementById('next3').addEventListener('click', showStep4);
    document.getElementById('start-over').addEventListener('click', reset);
}

function handlePriorityClick(e) {
    const value = e.target.dataset.value;
    const index = state.priorities.indexOf(value);

    if (index === -1 && state.priorities.length < 2) {
        state.priorities.push(value);
        e.target.classList.add('selected');
    } else if (index !== -1) {
        state.priorities.splice(index, 1);
        e.target.classList.remove('selected');
    }

    updatePriorityButtons();
    document.getElementById('next1').disabled = state.priorities.length !== 2;
}

function updatePriorityButtons() {
    document.querySelectorAll('.priority').forEach(btn => {
        const value = btn.dataset.value;
        btn.classList.remove('unselected');
        if (state.priorities.length === 2 && !state.priorities.includes(value)) {
            btn.classList.add('unselected');
        }
    });
}

function showStep2() {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('priority-inputs').innerHTML = '';
    state.priorities.forEach(priority => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${priority}</h3>`;
        for (let i = 0; i < 3; i++) {
            div.innerHTML += `<input type="text" data-priority="${priority}" data-index="${i}" 
                placeholder="${placeholders[priority][i]}" />`;
        }
        document.getElementById('priority-inputs').appendChild(div);
    });

    document.querySelectorAll('#priority-inputs input').forEach(input => 
        input.addEventListener('input', handleInput));
}

function handleInput() {
    state.details = {};
    document.querySelectorAll('#priority-inputs input').forEach(input => {
        const priority = input.dataset.priority;
        const index = input.dataset.index;
        if (!state.details[priority]) state.details[priority] = [];
        state.details[priority][index] = input.value || placeholders[priority][index];
    });

    const allFilled = Object.values(state.details).every(arr => 
        arr.every(val => val.trim() !== ''));
    document.getElementById('next2').disabled = !allFilled;
}

function showStep3() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    document.getElementById('must-haves').innerHTML = '';
    Object.entries(state.details).forEach(([priority, items]) => {
        items.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('grid-item');
            div.dataset.item = item;
            div.textContent = item;
            div.addEventListener('click', handleMustHaveClick);
            document.getElementById('must-haves').appendChild(div);
        });
    });
}

function handleMustHaveClick(e) {
    const item = e.target.dataset.item;
    const index = state.mustHaves.indexOf(item);

    if (index === -1 && state.mustHaves.length < 2) {
        state.mustHaves.push(item);
        e.target.classList.add('selected');
    } else if (index !== -1) {
        state.mustHaves.splice(index, 1);
        e.target.classList.remove('selected');
    }

    updateMustHaves();
    document.getElementById('next3').disabled = state.mustHaves.length !== 2;
}

function updateMustHaves() {
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('unselected');
        if (state.mustHaves.length === 2 && !state.mustHaves.includes(item.dataset.item)) {
            item.classList.add('unselected');
        }
    });
}

function showStep4() {
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step4').classList.add('active');
    const allPriorities = ['Price', 'Location', 'Features'];
    const unchosenPriority = allPriorities.find(p => !state.priorities.includes(p));
    const allItems = Object.values(state.details).flat();
    const unchosenItems = allItems.filter(item => !state.mustHaves.includes(item));

    document.getElementById('summary').innerHTML = `
        <p>You're prioritizing <strong>${state.priorities[0]}</strong> and 
        <strong>${state.priorities[1]}</strong> in this next home, with your two must-haves 
        being <strong>${state.mustHaves[0]}</strong> and <strong>${state.mustHaves[1]}</strong>.</p>
        <p>That means you're setting aside <strong class="priority">${unchosenPriority}</strong> 
        and possibly giving up things like:</p>
        ${unchosenItems.map(item => `<div class="summary-item priority">${item}</div>`).join('')}
    `;
}

function reset() {
    state.priorities = [];
    state.details = {};
    state.mustHaves = [];
    document.querySelectorAll('.priority').forEach(btn => {
        btn.classList.remove('selected', 'unselected');
    });
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    document.getElementById('next1').disabled = true;
}

init();