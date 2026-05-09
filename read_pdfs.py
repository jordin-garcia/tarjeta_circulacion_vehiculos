import PyPDF2
import sys

def read_pdfs(files):
    with open('output_utf8.txt', 'w', encoding='utf-8') as out:
        for file_path in files:
            try:
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = ''
                    for page in reader.pages:
                        text += page.extract_text() + '\n'
                    out.write(f"--- {file_path} ---\n")
                    out.write(text + "\n")
            except Exception as e:
                out.write(f"Error reading {file_path}: {e}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        read_pdfs(sys.argv[1:])
