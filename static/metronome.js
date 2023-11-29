// Get DOM elements related to the metronome timer functionality
const playPauseButton = document.getElementById("playPauseButton");
const bpmSlider = document.getElementById("bpmSlider");
const bpmValue = document.getElementById("bpmValue");
const numberOfBeatsDisplay = document.getElementById("numberOfBeatsDisplay");
const beatSubdivisionDisplay = document.getElementById("beatSubdivisionDisplay");
const beatsContainer = document.getElementById("beatsContainer");
const numberOfBeatsSelect = document.getElementById("numberOfBeats");
const beatSubdivisionSelect = document.getElementById("beatSubdivision");
// Audio files for different click sounds
const accentedClick = new Audio('/static/assets/Accented.mp3');
const regularClick = new Audio('/static/assets/Regular.mp3');
const semiAccentedClick = new Audio('/static/assets/Semi.mp3')

//State variables for metronome
let isPlaying = false;
let intervalId;
let currentBeat = 0;
let beats = [];
//Preload audio for immediate playback
accentedClick.preload = 'auto';
regularClick.preload = 'auto';
semiAccentedClick.preload = 'auto';

// Populate options for the number of beats
function populateBeatOptions() {
    for (let i = 1; i <= 16; i++) {
        let option = document.createElement("option");
        option.value = i.toString();
        option.textContent = i.toString();
        numberOfBeatsSelect.appendChild(option);
    }
}

// Populate options for the beat subdivision
function populateBeatSubdivisionOptions() {
    const subdivisions = [1, 2, 4, 8, 16, 32];
    subdivisions.forEach(subdivision => {
        let option = document.createElement("option");
        option.value = subdivision.toString();
        option.textContent = subdivision.toString();
        beatSubdivisionSelect.appendChild(option);
    });
}

// Update the displayed time signature
function updateBeatDisplay() {
    numberOfBeatsDisplay.textContent = numberOfBeatsSelect.value;
    beatSubdivisionDisplay.textContent = beatSubdivisionSelect.value;
}

// Update the beat indicators based on the selected time signature
function updateBeats() {
    const beatCount = parseInt(numberOfBeatsSelect.value);
    beatsContainer.innerHTML = '';
    beats = [];

    for (let i = 0; i < beatCount; i++) {
        const beat = document.createElement('div');
        beat.classList.add('beat');
        beat.addEventListener('click', () => toggleAccent(i));
        beatsContainer.appendChild(beat);
        beats.push(beat);
    }
    setDefaultAccents();
}

// Set default accents based on the time signature
function setDefaultAccents() {
    const beatCount = parseInt(numberOfBeatsSelect.value);
    const subdivision = parseInt(beatSubdivisionSelect.value);

    beats.forEach(beat => beat.classList.remove('accented'));
    // Logic to apply default accents based on common time signatures
    if (subdivision === 4) {
        beats[0].classList.add('accented');
        if (beatCount === 6) {
            beats[3].classList.add('accented');
        }
    } else if (subdivision === 8 && beatCount === 6) {
        beats[0].classList.add('accented');
        beats[3].classList.add('accented');
    }
}

// Toggle accent state of a beat
function toggleAccent(beatIndex) {
    const beat = beats[beatIndex];

    if (beat.classList.contains('accented')) {
        beat.classList.remove('accented');
    } else if (beat.classList.contains('semi-accented')) {
        beat.classList.remove('semi-accented');
        beat.classList.add('accented');
    } else {
        beat.classList.add('semi-accented');
    }

    updateBeatVisual(beat, beatIndex);
}

// Update the visual appearance of a beat based on its state (accented, semi-accented, or regular)
function updateBeatVisual(beat, index) {
    if (beat.classList.contains('accented')) {
        beat.style.backgroundColor = 'blue';
    } else if (beat.classList.contains('semi-accented')) {
        beat.style.backgroundColor = 'aqua';
    } else {
        beat.style.backgroundColor = index === currentBeat ? 'red' : 'grey';
    }
}

// Function to satart metronome
function playMetronome() {
    const bpm = parseInt(bpmSlider.value);
    const delay = 60000 / bpm;

    intervalId = setInterval(() => {
        highlightBeat(currentBeat);
        playClickSound(currentBeat); 
        currentBeat = (currentBeat + 1) % beats.length;
    }, delay);

    playPauseButton.classList.remove("play");
    playPauseButton.classList.add("pause");
    isPlaying = true;
}

// Play click according to beat's accentuation
function playClickSound(beatIndex) {
    const beat = beats[beatIndex];

    if (beat.classList.contains('accented')) {
        accentedClick.currentTime = 0;
        accentedClick.play();
    } else if (beat.classList.contains('semi-accented')) {
        semiAccentedClick.currentTime = 0;
        semiAccentedClick.play();
    } else {
        regularClick.currentTime = 0;
        regularClick.play();
    }
}

// Hilights the current beat
function highlightBeat(beatIndex) {
    beats.forEach((beat, index) => {
        updateBeatVisual(beat, index);
        if (beat.classList.contains('accented')) {
            // Keep the accented color
            beat.style.backgroundColor = index === beatIndex ? 'darkred' : 'blue';
        } else if (beat.classList.contains('semi-accented')) {
            // Keep the semi-accented color
            beat.style.backgroundColor = index === beatIndex ? '#008B8B' : 'aqua'; 
        } else {
            // Regular beats
            beat.style.backgroundColor = index === beatIndex ? 'red' : 'grey';
        }
    });
}

// Pause metronome
function pauseMetronome() {
    clearInterval(intervalId);
    playPauseButton.classList.remove("pause");
    playPauseButton.classList.add("play");
    isPlaying = false;
    currentBeat = 0;

    beats.forEach((beat, index) => {
        updateBeatVisual(beat, index);
    });
}

// Event listener for the play/pause buttons
playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
        pauseMetronome();
    } else {
        playMetronome();
    }
});

// Event listener for the BPM slider to update BPM
bpmSlider.addEventListener("input", () => {
    const newBpm = parseInt(bpmSlider.value);
    bpmValue.textContent = newBpm;
    if (isPlaying) {
        pauseMetronome();
        playMetronome();
    }
});

// Event listener for a click on BPM value to enable content editing
bpmValue.addEventListener("click", () => {
    bpmValue.isContentEditable = true;
    window.getSelection().selectAllChildren(bpmValue);
});

// Event listener for BPM value to be correcnt and in range
bpmValue.addEventListener("blur", () => {
    let newBpm = parseInt(bpmValue.textContent);
    newBpm = isNaN(newBpm) || newBpm < 10 ? 10 : newBpm > 700 ? 700 : newBpm;
    bpmValue.textContent = newBpm;
    bpmSlider.value = newBpm;
    if (isPlaying) {
        pauseMetronome();
        playMetronome();
    }
});

// Accepts the change by pressing enter
bpmValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        bpmValue.blur();
    }
});

// Choose all the numbers when editing
numberOfBeatsDisplay.addEventListener("click", () => {
    numberOfBeatsDisplay.contentEditable = true;
    window.getSelection().selectAllChildren(numberOfBeatsDisplay);
});

// Accepting by pressing enter
numberOfBeatsDisplay.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        numberOfBeatsDisplay.blur();
    }
});

// Event listener to validate range of time signature
numberOfBeatsDisplay.addEventListener("blur", () => {
    let selectedBeats = parseInt(numberOfBeatsDisplay.textContent);
    selectedBeats = isNaN(selectedBeats) || selectedBeats < 1 || selectedBeats > 16 ? 4 : selectedBeats;
    numberOfBeatsDisplay.textContent = selectedBeats;
    numberOfBeatsSelect.value = selectedBeats;
    updateBeats();
    numberOfBeatsDisplay.contentEditable = false;
});

// Choose all the numbers when editing
beatSubdivisionDisplay.addEventListener("click", () => {
    beatSubdivisionDisplay.contentEditable = true;
    window.getSelection().selectAllChildren(beatSubdivisionDisplay);
});

// Accepting by enter
beatSubdivisionDisplay.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        beatSubdivisionDisplay.blur();
    }
});

// Evenlt listener to validate subdivisions in time signature
beatSubdivisionDisplay.addEventListener("blur", () => {
    let selectedSubdivision = parseInt(beatSubdivisionDisplay.textContent);
    const validSubdivisions = [1, 2, 4, 8, 16, 32];
    if (!validSubdivisions.includes(selectedSubdivision)) {
        selectedSubdivision = 4; 
    }
    beatSubdivisionDisplay.textContent = selectedSubdivision;
    beatSubdivisionSelect.value = selectedSubdivision;
    updateBeats();
    beatSubdivisionDisplay.contentEditable = false;
});

// Load the audio file for timer end
const timerEndSound = new Audio('/static/assets/timer-end-sound.mp3');

let timerInterval = null;
let isTimerPaused = true;
let totalTime = 0;

// Start Timer
document.getElementById('startTimerButton').addEventListener('click', function() {
    if (isTimerPaused) {
        clearInterval(timerInterval);

        let minutes = Math.min(parseInt(document.getElementById('minutes').textContent) || 0, 120);
        let seconds = Math.min(parseInt(document.getElementById('seconds').textContent) || 0, 59);
        
        totalTime = minutes * 60 + seconds;
        isTimerPaused = false;
    }

    timerInterval = setInterval(() => {
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            timerEndSound.play(); 
            alert('Time is up!');
            return;
        }

        totalTime -= 1;

        let displayMinutes = Math.floor(totalTime / 60);
        let displaySeconds = totalTime % 60;

        document.getElementById('minutes').textContent = displayMinutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = displaySeconds.toString().padStart(2, '0');
    }, 1000);
});

// Pause Timer
document.getElementById('pauseTimerButton').addEventListener('click', function() {
    clearInterval(timerInterval);
    isTimerPaused = true;
});

// Stop Timer
document.getElementById('stopTimerButton').addEventListener('click', function() {
    clearInterval(timerInterval);
    isTimerPaused = true;
    totalTime = 0;
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';

    timerEndSound.pause();
    timerEndSound.currentTime = 0;
});

// Select All Text in Timer on Click
['minutes', 'seconds'].forEach(function(id) {
    const element = document.getElementById(id);
    document.getElementById(id).addEventListener('click', function() {
        this.focus();
        document.execCommand('selectAll', false, null);
    });
    element.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            element.blur();
        }
    });
});


// Add a new subject
document.getElementById("addSubjectForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const subjectNameInput = document.getElementById("subjectName"); // Get the input element
    const subjectName = subjectNameInput.value;

    fetch('/add_subject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `subject_name=${encodeURIComponent(subjectName)}`
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadSubjects();
        subjectNameInput.value = ''; // Clear the input field after adding the subject
    })
    .catch(error => console.error('Error:', error));
});


// Function to edit/delete subjects
function editSubject(subjectId, newName) {
    fetch(`/edit_subject/${subjectId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadSubjects();
    })
    .catch(error => console.error('Error:', error));
}

function deleteSubject(subjectId) {
    fetch(`/delete_subject/${subjectId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        loadSubjects();
    })
    .catch(error => console.error('Error:', error));
}

// Function to load and display the list of subjects
function loadSubjects() {
    fetch('/get_subjects')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(subjects => {
        const subjectList = document.getElementById("subjectList");
        subjectList.innerHTML = '';

        subjects.forEach(subject => {
            const subjectDiv = document.createElement('div');
            subjectDiv.classList.add('subject');

            const subjectNameSpan = document.createElement('span');
            subjectNameSpan.contentEditable = true;
            subjectNameSpan.textContent = subject.name;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button'); // Add class for styling

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.classList.add('save-button');
            saveButton.style.display = 'none'; // Initially hide the button
            saveButton.onclick = function(event) {
                event.stopPropagation(); // Prevent event from bubbling up
                editSubject(subject.id, subjectNameSpan.textContent);
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.style.display = 'none'; // Initially hide the button
            deleteButton.onclick = function(event) {
                event.stopPropagation(); // Prevent event from bubbling up
                deleteSubject(subject.id);
            };

            editButton.onclick = function() {
                saveButton.style.display = saveButton.style.display === 'none' ? 'inline-block' : 'none';
                deleteButton.style.display = deleteButton.style.display === 'none' ? 'inline-block' : 'none';
            };

            subjectDiv.append(subjectNameSpan, editButton, saveButton, deleteButton);

            subjectDiv.onclick = function() {
                document.querySelectorAll('.subject').forEach(el => el.classList.remove('highlight'));
                this.classList.add('highlight');
            };

            subjectList.appendChild(subjectDiv);
        });
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}




loadSubjects();
populateBeatOptions();
populateBeatSubdivisionOptions();
numberOfBeatsSelect.value = "4"; 
beatSubdivisionSelect.value = "4"; 
updateBeats();
updateBeatDisplay();
