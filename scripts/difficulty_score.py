import math
from collections import Counter

with open("./data/wordle_possibles.txt") as f:
    words = [
        w.strip().lower()
        for w in f
        if len(w.strip()) == 5 and w.strip().isalpha()
    ]

# Build positional letter frequency counts
position_counts = [Counter() for _ in range(5)]
overall_counts = Counter()
for word in words:
    for i, letter in enumerate(word):
        position_counts[i][letter] += 1
        overall_counts[letter] += 1

# Manual filtering conditions
EASY_LETTERS = set("etaionsrh")
DIFFICULT_LETTERS = set("zjqxkvbpgwy")
VOWELS = set("aeiou")

def passes_manual_filter(word):
    contains_a = "a" in word
    contains_e = "e" in word
    if contains_a and contains_e:
        return False

    vowel_count = sum(letter in VOWELS for letter in word)
    if contains_a or contains_e:
        if vowel_count > 2:
            return False

    # Reject words with repeated easy letters
    for letter in EASY_LETTERS:
        if word.count(letter) > 1:
            return False

    if not any(letter in DIFFICULT_LETTERS for letter in word):
        return False

    return True

# Use positional frequency relative to overall letter frequency to score words
def difficulty_score(word):
    return math.prod(
        position_counts[i][letter] / overall_counts[letter]
        for i, letter in enumerate(word)
    )

filtered_words = [word for word in words if passes_manual_filter(word)]
hard_words = [(difficulty_score(word), word) for word in filtered_words]
hard_words.sort()

output_words = [word.upper() for _, word in hard_words[:800]]
with open("./data/hard_words.txt", "w") as outfile:
    outfile.write("\n".join(output_words) + "\n")

print(f"Found {len(hard_words)} difficult words. Wrote {len(output_words)} words to ./data/hard_words.txt.\n")

for score, word in hard_words[:100]:
    print(f"{word}  score={score}")
