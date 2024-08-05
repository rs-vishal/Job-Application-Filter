import os
import PyPDF2
from docx import Document

def extract_text_from_pdf(pdf_path):    #extract the text from pdf
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)  
        number_of_pages = len(reader.pages) 
        text = ""
        for page_number in range(number_of_pages):
            page = reader.pages[page_number]
            text += page.extract_text()            
    return text.lower()

def extract_text_from_docx(docx_path):    #extract the text from pdf
    doc = Document(docx_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text.lower()

def extract_text_from_file(file_path): #check the extension
    extension = os.path.splitext(file_path)[1].lower()
    if extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif extension == '.docx':
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")

def check_requirements(text, requirements):   #check for requirements
    results = {}
    for value in requirements:
        results[value] = value in text
    return results

def convert_folder_to_text(folder_path):
    text_array = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            try:
                text = extract_text_from_file(file_path)
                text_array.append(text)
            except ValueError as e:
                print(f"Skipping {filename}: {e}")
    return text_array
    # check_for_requirements(text_array,requirements)


def check_for_requirements(text_array, requirements):
    result = []
    for text in text_array:
        no_requirements_satisfied = 0
        for requirement in requirements:
            if requirement in text:
                no_requirements_satisfied += 1
        result.append(no_requirements_satisfied)
    return result

    





 