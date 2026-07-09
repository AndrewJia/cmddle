input_file = "../data/likely_solutions"
output_file = "../data/likely_solutions_trimmed.txt"

with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
    for line in infile:
        trimmed_line = line[:5]  # Keep only the first 5 characters
        outfile.write(trimmed_line + '\n')