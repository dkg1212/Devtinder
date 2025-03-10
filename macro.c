#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_MACROS 100
#define MAX_KEY_LEN 50
#define MAX_VAL_LEN 100
#define MAX_BUFFER 500

typedef struct {
    char key[MAX_KEY_LEN];
    char value[MAX_VAL_LEN];
} Macro;

Macro macros[MAX_MACROS];
int macro_count = 0;

void add_macro(const char *key, const char *value) {
    if (macro_count < MAX_MACROS) {
        strcpy(macros[macro_count].key, key);
        strcpy(macros[macro_count].value, value);
        macro_count++;
    } else {
        fprintf(stderr, "Error: Maximum macro limit reached!\n");
        exit(EXIT_FAILURE);
    }
}

const char* get_macro_value(const char *key) {
    for (int i = 0; i < macro_count; i++) {
        if (strcmp(macros[i].key, key) == 0) {
            return macros[i].value;
        }
    }
    return NULL;
}

void process_line(char *line, FILE *output_file) {
    if (strncmp(line, "$DEFINE", 7) == 0) {
        char key[MAX_KEY_LEN], value[MAX_VAL_LEN];
        if (sscanf(line + 8, "%s %s", key, value) == 2) {
            add_macro(key, value);
        }
    } else {
        char output[MAX_BUFFER] = "";
        char temp[MAX_KEY_LEN];
        int i = 0, j = 0;

        while (line[i] != '\0') {
            if (isalnum(line[i]) || line[i] == '_') {
                temp[j++] = line[i];
            } else {
                if (j > 0) {  
                    temp[j] = '\0';  
                    const char *replacement = get_macro_value(temp);
                    strcat(output, replacement ? replacement : temp);
                    j = 0;  
                }
                strncat(output, &line[i], 1);
            }
            i++;
        }
        if (j > 0) {  
            temp[j] = '\0';
            const char *replacement = get_macro_value(temp);
            strcat(output, replacement ? replacement : temp);
        }
        
        fprintf(output_file, "%s", output);
    }
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <input_file> <output_file>\n", argv[0]);
        return EXIT_FAILURE;
    }
    
    FILE *input_fp = fopen(argv[1], "r");
    if (!input_fp) {
        perror("Error opening input file");
        return EXIT_FAILURE;
    }
    
    FILE *output_fp = fopen(argv[2], "w");
    if (!output_fp) {
        perror("Error opening output file");
        fclose(input_fp);
        return EXIT_FAILURE;
    }
    
    char buffer[MAX_BUFFER];
    while (fgets(buffer, sizeof(buffer), input_fp)) {
        process_line(buffer, output_fp);
    }
    
    fclose(input_fp);
    fclose(output_fp);
    
    printf("Processing complete. Output saved to %s\n", argv[2]);
    return EXIT_SUCCESS;
}
