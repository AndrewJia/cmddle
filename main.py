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
    Provides feedback for each letter based on Wordle rules.

    :param word: The word to guess.
    :param accepted_words: A set of valid words.
    """
    print("Welcome to the word guessing game!")
    print("Guess the 5-letter word. Type 'exit' to quit.")
    
    while True:
        guess = input("Enter your guess: ").strip().upper()
        
        if guess == "EXIT":
            print("Thanks for playing!")
            break
        
        if len(guess) != 5:
            print("Please enter a 5-letter word.")
            continue
        
        if guess not in accepted_words:
            print("Invalid word. Please enter a real word.")
            continue
        
        # Provide feedback for the guess
        feedback = []
        for i, letter in enumerate(guess):
            if letter == word[i]:
                feedback.append("\033[92m" + letter + "\033[0m")  # Green box for correct position
            elif letter in word:
                feedback.append("\033[93m" + letter + "\033[0m")  # Yellow box for wrong position
            else:
                feedback.append("\033[90m" + letter + "\033[0m")  # Black box for not in word
        
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

    print(f"Random word selected: {random_word}")  # For debugging purposes
    
    if random_word and accepted_words:
        play_game(random_word, accepted_words)