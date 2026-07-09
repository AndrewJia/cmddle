let word = ""; // The hidden word will be loaded dynamically
let validWords = []; // Store all valid words from combined_sorted.txt
let solutions = []; // Store normal solution words
let hardWords = []; // Store hard mode solution words
let solutionsLoaded = false;
let hardWordsLoaded = false;
let previousGuesses = new Set(); // Track previously guessed words
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
const boardContainer = document.getElementById("board-container");
const giveUpButton = document.getElementById("give-up");
const playAgainButton = document.getElementById("play-again");
const hardModeCheckbox = document.getElementById("hard-mode");
const message = document.getElementById("message");

// Helper to fetch a text file and return its trimmed uppercase lines
function fetchText(url) {
    return fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
            return response.text();
        })
        .then((text) => text.split("\n").map((w) => w.trim().toUpperCase()).filter(Boolean));
}

// Load solution and valid guess data (centralized loader)
function loadData() {
    fetchText("data/likely_solutions_trimmed.txt")
        .then((lines) => {
            solutions = lines;
            solutionsLoaded = true;
            tryFetchSolution();
        })
        .catch((err) => console.error("Error loading solution list:", err));

    fetchText("data/hard_words.txt")
        .then((lines) => {
            hardWords = lines;
            hardWordsLoaded = true;
            tryFetchSolution();
        })
        .catch((err) => console.error("Error loading hard words list:", err));

    fetchText("data/combined_sorted.txt")
        .then((lines) => {
            validWords = lines;
        })
        .catch((err) => console.error("Error loading valid words list:", err));
}

function chooseSolutionList() {
    if (hardModeCheckbox.checked && hardWords.length > 0) {
        return hardWords;
    }
    return solutions;
}

function tryFetchSolution() {
    if (currentRow > 0 || currentCol > 0 || gameOver) {
        return;
    }

    if (hardModeCheckbox.checked) {
        if (!hardWordsLoaded) {
            return;
        }
    } else if (!solutionsLoaded) {
        return;
    }

    fetchSolution();
}

// Fetch the solution lists and pick a random word
function fetchSolution() {
    const source = chooseSolutionList();
    if (source.length === 0) {
        console.error("No words available for the current mode:", hardModeCheckbox.checked);
        return;
    }
    word = source[Math.floor(Math.random() * source.length)];
    console.log(`Random solution selected: ${word}`); // For debugging purposes
}

function createBoard() {
    boardContainer.innerHTML = "";
    for (let row = 0; row < 6; row++) {
        const rowEl = document.createElement("div");
        rowEl.classList.add("board-row");
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement("div");
            cell.classList.add("board-cell");
            cell.id = `cell-${row}-${col}`;
            rowEl.appendChild(cell);
        }
        boardContainer.appendChild(rowEl);
    }
}

function createKeyboard() {
    const keyboardContainer = document.getElementById("keyboard");
    keyboardContainer.innerHTML = "";
    
    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
    ];
    
    rows.forEach((rowKeys, rowIndex) => {
        const rowEl = document.createElement("div");
        rowEl.classList.add("keyboard-row");
        
        rowKeys.forEach((key) => {
            const button = document.createElement("button");
            button.classList.add("key");
            button.textContent = key;
            
            if (key === "ENTER") {
                button.classList.add("special");
                button.id = "key-enter";
            } else if (key === "BACK") {
                button.classList.add("special");
                button.id = "key-backspace";
            } else {
                button.setAttribute("data-key", key);
            }
            
            rowEl.appendChild(button);
        });
        
        keyboardContainer.appendChild(rowEl);
    });
    
    // Wire keyboard button clicks
    document.querySelectorAll(".key[data-key]").forEach((button) => {
        button.addEventListener("click", () => {
            const event = new KeyboardEvent("keydown", { key: button.dataset.key });
            handleKeyDown(event);
        });
    });
    
    document.getElementById("key-enter").addEventListener("click", () => {
        const event = new KeyboardEvent("keydown", { key: "Enter" });
        handleKeyDown(event);
    });
    
    document.getElementById("key-backspace").addEventListener("click", () => {
        const event = new KeyboardEvent("keydown", { key: "Backspace" });
        handleKeyDown(event);
    });
}

/* 
 * update colors of the on-screen keyboard based on the feedback from the guess 
 * if a letter is already marked as green, it should not be downgraded to yellow or gray
*/
function updateKeyboardColors(guess, colors) {
    for (let col = 0; col < 5; col++) {
        const letter = guess[col];
        const button = document.querySelector(`.key[data-key="${letter}"]`);
        if (button) {
            if (!button.classList.contains("green")) {
                button.classList.remove("green", "yellow", "gray");
                button.classList.add(colors[col]);
            }
        }
    }
}

function setCell(row, col, value) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (!cell) return;
    cell.textContent = value;
    if (value) {
        cell.classList.add("filled");
    } else {
        cell.classList.remove("filled", "green", "yellow", "gray");
    }
}

function setRowColors(row, colors) {
    for (let col = 0; col < 5; col++) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (!cell) continue;
        cell.classList.remove("green", "yellow", "gray");
        cell.classList.add(colors[col]);
    }
}

function getCurrentGuess() {
    let guess = "";
    for (let col = 0; col < 5; col++) {
        const cell = document.getElementById(`cell-${currentRow}-${col}`);
        if (!cell || cell.textContent.trim() === "") {
            return null;
        }
        guess += cell.textContent;
    }
    return guess;
}

function setMessage(text, color = "#ff0000") {
    message.textContent = text;
    message.style.color = color;
}

function finishGame(text, color = "#ff0000") {
    setMessage(text, color);
    gameOver = true;
    giveUpButton.disabled = true;
    playAgainButton.style.display = "inline";
}

function computeFeedback(guess, answer) {
    const result = Array(5).fill("gray");
    const answerCounts = {};

    for (let i = 0; i < 5; i++) {
        if (answer[i] === guess[i]) {
            result[i] = "green";
        } else {
            answerCounts[answer[i]] = (answerCounts[answer[i]] || 0) + 1;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (result[i] !== "green") {
            const letter = guess[i];
            if (answerCounts[letter] > 0) {
                result[i] = "yellow";
                answerCounts[letter] -= 1;
            }
        }
    }
    return result;
}

function commitGuess() {
    const guess = getCurrentGuess();
    if (!guess || guess.length !== 5) {
        setMessage("Please complete the row before submitting.");
        return;
    }

    if (!validWords.includes(guess)) {
        setMessage("Invalid word. Please enter a real word.");
        return;
    }

    if (previousGuesses.has(guess)) {
        setMessage("You already guessed that word. Try a different one.");
        return;
    }

    previousGuesses.add(guess);
    setMessage("");

    const colors = computeFeedback(guess, word);
    setRowColors(currentRow, colors);
    updateKeyboardColors(guess, colors);

    if (guess === word) {
        finishGame("Congratulations! You guessed the word!", "#1a8917");
        return;
    }

    currentRow += 1;
    currentCol = 0;

    if (currentRow === 6) {
        finishGame(`Game over. The word was: ${word}`);
    }
}

function handleKeyDown(event) {
    if (gameOver) {
        return;
    }

    const key = event.key;
    if (key === "Backspace") {
        if (currentCol > 0) {
            currentCol -= 1;
            setCell(currentRow, currentCol, "");
        }
        return;
    }

    if (key === "Enter") {
        if (currentCol === 5) {
            commitGuess();
        }
        return;
    }

    if (/^[a-zA-Z]$/.test(key) && currentCol < 5) {
        setCell(currentRow, currentCol, key.toUpperCase());
        currentCol += 1;
        return;
    }
}

function resetGame() {
    previousGuesses.clear();
    currentRow = 0;
    currentCol = 0;
    gameOver = false;
    setMessage("");
    createBoard();
    giveUpButton.disabled = false;
    playAgainButton.style.display = "none";
    tryFetchSolution();
}

// Centralized data loader
loadData();

window.addEventListener("keydown", handleKeyDown);

giveUpButton.addEventListener("click", () => {
    if (!gameOver) {
        finishGame(`The word was: ${word}`);
    }
});

hardModeCheckbox.addEventListener("change", () => {
    if (currentRow === 0 && currentCol === 0 && !gameOver) {
        tryFetchSolution();
    }
});

playAgainButton.addEventListener("click", resetGame);

createBoard();
createKeyboard();
