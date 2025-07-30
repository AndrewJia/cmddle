let word = ""; // The hidden word will be loaded dynamically
let validWords = []; // Store all valid words from combined_sorted.txt
const feedbackContainer = document.getElementById("feedback-container");
const guessInput = document.getElementById("guess-input");
const submitGuess = document.getElementById("submit-guess");
const message = document.getElementById("message");

// Fetch the solution list and pick a random word
fetch("data/likely_solutions_trimmed.txt")
    .then((response) => response.text())
    .then((text) => {
        const solutions = text.split("\n").map((word) => word.trim().toUpperCase());
        word = solutions[Math.floor(Math.random() * solutions.length)];
        console.log(`Random solution selected: ${word}`); // For debugging purposes
    })
    .catch((error) => {
        console.error("Error loading solution list:", error);
    });

// Fetch the valid guesses list
fetch("data/combined_sorted.txt")
    .then((response) => response.text())
    .then((text) => {
        validWords = text.split("\n").map((word) => word.trim().toUpperCase());
    })
    .catch((error) => {
        console.error("Error loading valid words list:", error);
    });

function handleGuessSubmission() {
    const guess = guessInput.value.toUpperCase();
    if (guess.length !== 5) {
        message.textContent = "Please enter a 5-letter word.";
        return;
    }

    if (!validWords.includes(guess)) {
        message.textContent = "Invalid word. Please enter a real word.";
        return;
    }

    message.textContent = ""; // Clear any previous message

    const wordLetterCounts = {};
    for (const letter of word) {
        wordLetterCounts[letter] = (wordLetterCounts[letter] || 0) + 1;
    }

    const feedback = [];
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        if (letter === word[i]) {
            feedback.push({ letter, class: "green" });
            wordLetterCounts[letter]--;
        } else if (word.includes(letter) && wordLetterCounts[letter] > 0) {
            feedback.push({ letter, class: "yellow" });
            wordLetterCounts[letter]--;
        } else {
            feedback.push({ letter, class: "gray" });
        }
    }

    // Create a row for the current guess
    const feedbackRow = document.createElement("div");
    feedbackRow.classList.add("feedback-row");

    feedback.forEach(({ letter, class: colorClass }) => {
        const box = document.createElement("div");
        box.textContent = letter;
        box.classList.add("feedback-box", colorClass);
        feedbackRow.appendChild(box);
    });

    feedbackContainer.appendChild(feedbackRow); // Append the row to the feedback container

    if (guess === word) {
        message.textContent = "Congratulations! You guessed the word!";
        message.style.color = "green";
        guessInput.disabled = true;
        submitGuess.disabled = true;
    } else {
        guessInput.value = ""; // Clear the input for the next guess
    }
}

// Add event listener for the button click
submitGuess.addEventListener("click", handleGuessSubmission);

// Add event listener for pressing "Enter" in the input box
guessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleGuessSubmission();
    }
});