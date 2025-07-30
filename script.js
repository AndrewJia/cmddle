const word = "APPLE"; // Replace with a randomly selected word from your backend
const feedbackContainer = document.getElementById("feedback-container");
const guessInput = document.getElementById("guess-input");
const submitGuess = document.getElementById("submit-guess");
const message = document.getElementById("message");

submitGuess.addEventListener("click", () => {
    const guess = guessInput.value.toUpperCase();
    if (guess.length !== 5) {
        message.textContent = "Please enter a 5-letter word.";
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
});