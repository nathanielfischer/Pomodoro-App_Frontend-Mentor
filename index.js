let durationSetting = [25, 5, 15]; //0 = pomodoro, 1 = short Break, 2 = long Break

let mode = 0; //0 = pomodoro, 1 = short Break, 2 = long Break
let pomState = "start"

let currentTimer;
let remainingTime;

// every 4th cycle there is a long break, instead of a short break
// the cycle will increment for every pomodoro round finished and decrement for every manual pause taken
let cycle = 1;




// ---------------------- Pomodoro App Listeners ----------------------

// Mode: Pomodoro
document.querySelectorAll("#break label")[0].addEventListener('click', (event) => {
    modeInputHelper(0);
});

// Mode: short break
document.querySelectorAll("#break label")[1].addEventListener('click', (event) => {
    modeInputHelper(1);
});

// Mode: long break
document.querySelectorAll("#break label")[2].addEventListener('click', (event) => {
    modeInputHelper(2);
});


// Pomodoro Inner Circle click
document.querySelector(".inner-circle").addEventListener('click', (event) => {
    // should start / stop / restart
    if (pomState === "start") {
        //update DOM and pomstate, start progressUpdate(), set Timer Duration
        pomState = "pause";
        updatePomState();
        //check if remaining time left and if so -> calculate new currentTimer
        if (remainingTime == undefined) {
            //if no remaining Timer -> set new currentTimer
            currentTimer = setTimer(durationSetting[mode]) - 1000; //-1000 to make it start at the right time
        } else {
            continueRemainingTimeHelper();
        }

        progressUpdateTimer();
    } else if (pomState === "pause") {
        //update DOM and pomstate
        pomState = "start";
        updatePomState();
    }
});


// ---------------------- Settings Listeners ----------------------


// Settings Button click -> open Settings
document.querySelector("#settings-icon img").addEventListener('click', (event) => {
    document.querySelector("#modal").classList.remove("hide");
});

// Settings Close Button click -> close Settings, discard changes
document.querySelector(".settings-header img").addEventListener('click', (event) => {
    document.querySelector("#modal").classList.add("hide");
});

// Settings Apply Button click -> close Settings, apply changes
document.querySelector("#modal .btn").addEventListener('click', (event) => {
    document.querySelector("#modal").classList.add("hide");
    applySettingsHandler();
});



// ---------------------- Settings INPUT Element Listeners ----------------------

// pomodoro
document.querySelectorAll(".number-input")[0].querySelectorAll("img")[0].addEventListener('click', (event) => {
    settingsInputHelper(0, 1);
});
document.querySelectorAll(".number-input")[0].querySelectorAll("img")[1].addEventListener('click', (event) => {
    settingsInputHelper(0, -1);
});

document.querySelectorAll(".number-input input")[0].addEventListener('keyup', (event) => {
    settingsInputHelper(0, 0);
});

// short break
document.querySelectorAll(".number-input")[1].querySelectorAll("img")[0].addEventListener('click', (event) => {
    settingsInputHelper(1, 1);
});
document.querySelectorAll(".number-input")[1].querySelectorAll("img")[1].addEventListener('click', (event) => {
    settingsInputHelper(1, -1);
});

document.querySelectorAll(".number-input input")[1].addEventListener('keyup', (event) => {
    settingsInputHelper(1, 0);
});

// long break
document.querySelectorAll(".number-input")[2].querySelectorAll("img")[0].addEventListener('click', (event) => {
    settingsInputHelper(2, 1);
});
document.querySelectorAll(".number-input")[2].querySelectorAll("img")[1].addEventListener('click', (event) => {
    settingsInputHelper(2, -1);
});

document.querySelectorAll(".number-input input")[2].addEventListener('keyup', (event) => {
    settingsInputHelper(2, 0);
});

/**
 * @param  {0, 1, 2} modeSetting
 * @param  {1, -1} increment
 * Allows only inputs from 0 to 60 (minutes)
 * Updates the value attribute after pressing the button of the input or keyboard input
 */
const settingsInputHelper = (modeSetting, increment) => {
    let setValue = Number(document.querySelectorAll(".number-input")[modeSetting].querySelector("input").value) + increment;
    if (setValue < 0) {
        setValue = 0;
    } else if (setValue > 60) {
        setValue = 60;
    }
    document.querySelectorAll(".number-input")[modeSetting].querySelector("input").setAttribute("value", setValue);
    document.querySelectorAll(".number-input")[modeSetting].querySelector("input").value = setValue;
}




// ---------------------- Settings Functions ----------------------


const applySettingsHandler = () => {
    //todo: range 1-60 minutes
    // if (setValue < 1) {
    //     setValue = 1;
    // } else if (setValue > 60) {
    //     setValue = 60;
    // }

    // Pomodoro duration
    durationSetting[0] = document.querySelectorAll(".number-input")[0].querySelector("input").value;
    // short break duration
    durationSetting[1] = document.querySelectorAll(".number-input")[1].querySelector("input").value;
    // long break duration
    durationSetting[2] = document.querySelectorAll(".number-input")[2].querySelector("input").value;

    let font;
    //check which font is selected
    for (let index = 0; index < 3; index++) {
        if (document.querySelector(".font-selector").querySelectorAll("input")[index].checked) {
            font = document.querySelector(".font-selector").querySelectorAll("input")[index].getAttribute("id");
        }
    }

    let color;
    //check which color is selected
    for (let index = 0; index < 3; index++) {
        if (document.querySelector(".color-selector").querySelectorAll("input")[index].checked) {
            color = document.querySelector(".color-selector").querySelectorAll("input")[index].getAttribute("id");
        }
    }

    updateTheme(font, color);
    resetPomodoro();
}

/**
 * @param  {} color //red, turquoise, purple
 */
const updateTheme = (font, color) => {
    const root = document.documentElement;
    //Update Font
    root.style.setProperty('--selected-theme-font', "var(--" + font + "-font)");
    //Update Color
    root.style.setProperty('--selected-theme-color', "var(--" + color + "-theme-color)");
}


const updateTimer = () => {
    // update timer in condition of the mode
    document.querySelector(".inner-circle h1").innerHTML = durationSetting[mode] + ":00"; //set timer in DOM
    // reset progress circle to 100%
    document.querySelector(":root").style.setProperty("--deg", "360deg");
}

const updatePomState = () => {
    document.querySelector(".inner-circle span").innerHTML = pomState;
}



// ---------------------- Helper Functions ----------------------

const setTimer = (minutes) => {
    const date = new Date();
    return new Date(date.getTime() + minutes * 60000);
}


const dateDiffMinutes = () => {
    let now = new Date();
    let diffMs = (currentTimer - now); // milliseconds
    let diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
    let diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds
    if (diffSecs === 60) {
        diffSecs = 0;
    } else if (diffSecs < 10) {
        diffSecs = "0" + diffSecs;
    }
    if (diffMins < 10) {
        diffMins = "0" + diffMins;
    }
    remainingTime = diffMins + ":" + diffSecs;
}

/**
 * sets the new finish Date for the current Timer according to the remaining time left, after a pause of the timer
 */
const continueRemainingTimeHelper = () => {
    const now = new Date();
    const mins = Number(remainingTime.substring(0, 2)) * 60000;
    const secs = Number(remainingTime.substring(3, 5)) * 1000;
    currentTimer = new Date(now.getTime() + mins + secs);
}

/**
 * @param  {0-2} modeInput
 * Manual Mode Change Handler
 */
const modeInputHelper = (modeInput) => {
    if (modeInput != mode) {
        //Update cycles
        if (mode === 0) {
            cycle -= 1; //if mode changes from pomodoro to any break, reduce cycle by 1
        } else if (modeInput === 0) {
            cycle += 1; //if mode changes from any break to pomodoro, increment cycle by 1
        }

        remainingTime = undefined;
        mode = modeInput;
        pomState = "start";
        updateTimer();
    }
}


const resetPomodoro = () => {
    remainingTime = undefined;
    mode = 0;
    pomState = "start";
    cycle = 1;

    updateTimer();
    updatePomState();
    document.querySelectorAll("#break input")[mode].checked = true;
}



// ---------------------- Progress Update Functions ----------------------

/**
 * Updates the Timer every Second
 */
const progressUpdateTimer = () => {
    const second = 1000; // 60000
    if (pomState === "pause") {
        //do stuff here
        dateDiffMinutes();
        progressUpdate();
        //if timer = 0 -> break & modeUpdate
        if (remainingTime === "00:00" || remainingTime === "0-1:00" || remainingTime === "0-1:0-1") {
            modeUpdate();
            return;
        }
        //do stuff here
        setTimeout(progressUpdateTimer, second);
    }
}

/**
 * Updates the Progress Bar
 * Steps: every full minute
 */
const progressUpdate = () => {
    //Update Timer
    document.querySelector(".inner-circle h1").innerHTML = remainingTime;
    //Update Progress Circle
    const remainingMinutes = Math.floor(Number(remainingTime.substring(0, 2))) + 1; //round up minutes
    const progress = remainingMinutes / durationSetting[mode] * 3.6 * 100; //100% * 3.6 = 360deg
    document.querySelector(":root").style.setProperty("--deg", progress + "deg");
}



// ---------------------- Mode Functions ----------------------

/**
 * automatic mode updates: check which mode and take account of current cycle
 */
const modeUpdate = () => {
    if (mode === 0) {    // if current mode === pomodoro
        //check if next break is long or short
        if ((cycle % 4) === 0) {
            mode = 2; //long break
        } else {
            mode = 1; //short break
        }
    } else {    //if current mode === break (short or long)
        // change mode to pomodoro and increment the cycle
        mode = 0;
        cycle++;
    }

    remainingTime = undefined;
    pomState = "start";
    updateTimer();
    updatePomState();
    //update Selected Mode in DOM:
    document.querySelectorAll("#break input")[mode].checked = true;
}



// ---------------------- Init Functions ----------------------

updateTimer(); //set timer to predefined duration in DOM