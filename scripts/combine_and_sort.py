trimmed_file = "../data/likely_solutions_trimmed.txt"
possibles_file = "../data/wordle_possibles.txt"
output_file = "../data/combined_sorted.txt"

# Read both files
with open(trimmed_file, 'r') as file1, open(possibles_file, 'r') as file2:
    combined_lines = file1.readlines() + file2.readlines()

# Remove duplicates, strip whitespace, convert to uppercase, and sort alphabetically
sorted_lines = sorted(set(line.strip().upper() for line in combined_lines))

# Write the sorted content to the output file
with open(output_file, 'w') as outfile:
    outfile.write('\n'.join(sorted_lines) + '\n')