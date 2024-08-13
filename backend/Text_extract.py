import os
import PyPDF2
from docx import Document



def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(f"Error reading PDF file: {e}")
    return text.lower()

def extract_text_from_docx(docx_path):
    text = ""
    try:
        doc = Document(docx_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX file: {e}")
    return text.lower()

def extract_text_from_file(file_path):
    extension = os.path.splitext(file_path)[1].lower()
    if extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif extension == '.docx':
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")

def convert_file_to_text(file):
    text_array = []
    if os.path.isfile(file):
        try:
            text = extract_text_from_file(file)
            text_array.append(text)
        except ValueError as e:
            print(f"Skipping {file}: {e}")
    else:
        print(f"File not found: {file}")
    return text_array

def check_for_requirements(text_array, requirements):
    result = 0
    for text in text_array:        
        for requirement in requirements:
            if requirement in text:
                result += 1
        
    return result

def start(file_path,requirements):
    text_array = convert_file_to_text(file_path)
    result = check_for_requirements(text_array, requirements)
    print(len(requirements))
    if(len(requirements))==result:
        return 'Selected'
    else:
        return 'Not Selected'
    
