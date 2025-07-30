import random

def load_accepted_words(file_path):
    """
    Loads a list of accepted words from the given file.

    :param file_path: Path to the file containing words (one word per line).
    :return: A set of accepted words.
    """
    try:
        with open(file_path, 'r') as file:
            # Strip whitespace and convert all words to uppercase
            return set(word.strip().upper() for word in file.readlines())
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return set()
    except Exception as e:
        print(f"An error occurred: {e}")
        return set()

def pick_random_word(file_path):
    """
    Picks a random word from the given file.

    :param file_path: Path to the file containing words (one word per line).
    :return: A randomly selected word from the file.
    """
    try:
        with open(file_path, 'r') as file:
            words = file.readlines()
        return random.choice(words).strip().upper()  # Ensure the word is uppercase
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

def play_game(word, accepted_words):
    """
    Starts a loop to take guesses from the user and checks if the guess matches the word.
    Provides feedback for each letter based on Wordle rules, including handling doubled letters.

    :param word: The word to guess.
    :param accepted_words: A set of valid words.
    """
    print("Welcome to the word guessing game!")
    print("Guess the 5-letter word. Type 'exit' to quit.")
    
    while True:
        guess = input("Enter your guess: ").strip().upper()
        
        if guess == "EXIT":
            print(f"Thanks for playing! The word was: {word}")
            break
        
        if len(guess) != 5:
            print("Please enter a 5-letter word.")
            continue
        
        if guess not in accepted_words:
            print("Invalid word. Please enter a real word.")
            continue
        
        # Feedback logic
        feedback = ["\033[90m" + letter + "\033[0m" for letter in guess]  # Default to black boxes
        word_letter_counts = {}

        # Count occurrences of each letter in the word
        for letter in word:
            word_letter_counts[letter] = word_letter_counts.get(letter, 0) + 1

        # First pass: Handle green boxes (correct position)
        for i, letter in enumerate(guess):
            if letter == word[i]:
                feedback[i] = "\033[92m" + letter + "\033[0m"  # Green box
                word_letter_counts[letter] -= 1  # Decrement count for matched letter

        # Second pass: Handle yellow boxes (wrong position)
        for i, letter in enumerate(guess):
            if feedback[i] == "\033[90m" + letter + "\033[0m":  # Only process letters not already green
                if letter in word_letter_counts and word_letter_counts[letter] > 0:
                    feedback[i] = "\033[93m" + letter + "\033[0m"  # Yellow box
                    word_letter_counts[letter] -= 1  # Decrement count for matched letter

        print("Feedback: " + " ".join(feedback))
        
        if guess == word:
            print("Congratulations! You guessed the word!")
            break
        else:
            print("Incorrect guess. Try again.")

# Example usage
if __name__ == "__main__":
    solutions_file = "data/likely_solutions_trimmed.txt"
    combined_file = "data/combined_sorted.txt"  # Updated to use combined_sorted.txt
    
    accepted_words = load_accepted_words(combined_file)
    random_word = pick_random_word(solutions_file)
    #random_word = 'BRASS'  # For testing purposes, you can set a fixed word

    print(f"Random word selected: {random_word}")  # For debugging purposes
    
    if random_word and accepted_words:
        play_game(random_word, accepted_words)