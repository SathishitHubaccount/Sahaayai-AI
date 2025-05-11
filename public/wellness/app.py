from flask import Flask, render_template, request, send_file
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import os
import hashlib
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Add this near the top of your file, before the PDF generation
# Register a font that supports Kannada (Noto Sans Kannada is a good choice)
pdfmetrics.registerFont(TTFont('NotoSansKannada', 'NotoSansKannada-Regular.ttf'))
app = Flask(__name__)

# Original dataset structure with unmodified symptoms
data = {
    'symptoms': [
        # General Medicine
        ['fatigue', 'fever', 'headache', 'generalized pain', 'cold', 'injuries', 'muscle pain', 
         'body ache', 'chills', 'weakness', 'loss of appetite', 'sore throat'],
        
        # Cardiology
        ['chest pain', 'shortness of breath', 'palpitations', 'dizziness', 'blood pressure', 
         'irregular heartbeat', 'excessive sweating', 'fainting', 'arm pain', 'heartpain'],
        
        # Dentist
        ['toothache', 'gum swelling', 'bleeding gums', 'dry mouth', 'difficult chewing', 'jaw pain', 
         'bad breath', 'tooth sensitivity', 'mouth sores', 'plaque buildup', 'loose teeth', 
         'jaw stiffness', 'swollen lymph nodes'],
        
        # Otolaryngology
        ['ear pain', 'sore throat', 'nasal congestion', 'hearing loss', 'running nose', 
         'ear discharge', 'sinus pressure', 'postnasal drip', 'sneezing', 'voice hoarseness', 
         'cough', 'throat irritation'],
        
        # Neurology
        ['headache', 'weakness', 'numbness', 'tingling', 'dizziness with headache', 'joint pain', 
         'back pain', 'nerve pain', 'vision problems', 'seizures', 'speech difficulty', 
         'poor coordination', 'memory loss'],
        
        # Gastroenterology
        ['abdominal pain', 'diarrhea', 'constipation', 'nausea', 'vomiting', 'fever', 'weight gain', 
         'gastric', 'bloating', 'loss of appetite', 'acid reflux', 'stomach cramps', 'indigestion'],
        
        # Pulmonology
        ['cough', 'wheezing', 'shortness of breath', 'chest tightness', 'fatigue', 'fever', 
         'weight loss', 'phlegm', 'night sweats', 'chronic cough', 'difficulty breathing', 
         'blue lips', 'chest discomfort'],
        
        # Dermatology
        ['itching', 'rashes', 'redness', 'swelling', 'dry skin', 'hair loss', 'brittle nails', 
         'eczema', 'hives', 'acne', 'peeling skin', 'blisters', 'dark spots'],
        
        # Urology
        ['painful urination', 'frequent urination', 'hematuria', 'lower abdominal pain', 'fever', 
         'burning sensation', 'cloudy urine', 'strong urine odor', 'pelvic discomfort', 
         'urinary urgency', 'back pain', 'kidney pain', 'urine retention'],
        
        # Gynecology
        ['pelvic pain', 'irregular menstruation', 'vaginal discharge', 'bloating', 'breast tenderness', 
         'pain during intercourse', 'cramps', 'mood swings', 'hot flashes', 'heavy bleeding', 
         'itching', 'burning', 'lower back pain'],
        
        # Psychiatry
        ['mood swings', 'anxiety', 'sleep disturbances', 'lack of concentration', 'agitation', 
         'memory problems', 'irritability', 'depression', 'fatigue', 'social withdrawal', 
         'hallucinations', 'low motivation', 'restlessness']
    ],
    'departments': [
        'General Medicine',
        'Cardiology',
        'Dentist',
        'Otolaryngology',
        'Neurology',
        'Gastroenterology',
        'Pulmonology',
        'Dermatology',
        'Urology',
        'Gynecology',
        'Psychiatry'
    ]
}

# Build the one-hot encoded dataset
def prepare_dataset():
    # Collect all unique symptoms
    all_symptoms = []
    for symptom_list in data['symptoms']:
        all_symptoms.extend(symptom_list)
    unique_symptoms = sorted(list(set(all_symptoms)))
    
    # Create feature matrix
    X = np.zeros((len(data['departments']), len(unique_symptoms)))
    for i, symptom_list in enumerate(data['symptoms']):
        for symptom in symptom_list:
            if symptom in unique_symptoms:
                j = unique_symptoms.index(symptom)
                X[i, j] = 1
    
    # Create target labels
    y = data['departments']
    
    return X, y, unique_symptoms

# Prepare dataset and train model
X, y, unique_symptoms = prepare_dataset()
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Train an optimized Random Forest model
model = RandomForestClassifier(
    n_estimators=250,
    max_depth=None,
    min_samples_split=2, 
    min_samples_leaf=1,
    max_features='sqrt',
    bootstrap=True,
    class_weight='balanced',
    random_state=42
)
model.fit(X, y_encoded)

# Doctor and Room Assignment Dictionary
doctors = {
    "General Medicine": [("Dr. Smith", "101"), ("Dr. Johnson", "102")],
    "Cardiology": [("Dr. Carter", "201"), ("Dr. Lee", "202")],
    "Dentist": [("Dr. Brown", "301"), ("Dr. Taylor", "302")],
    "Otolaryngology": [("Dr. Wilson", "401"), ("Dr. Davis", "402")],
    "Neurology": [("Dr. Moore", "501"), ("Dr. Thomas", "502")],
    "Gastroenterology": [("Dr. White", "601"), ("Dr. Harris", "602")],
    "Pulmonology": [("Dr. Green", "701"), ("Dr. Adams", "702")],
    "Dermatology": [("Dr. Baker", "801"), ("Dr. Clark", "802")],
    "Urology": [("Dr. Wright", "901"), ("Dr. Lopez", "902")],
    "Gynecology": [("Dr. Hill", "1001"), ("Dr. Young", "1002")],
    "Psychiatry": [("Dr. Scott", "1101"), ("Dr. King", "1102")]
}

def assign_doctor(domain):
    available_doctors = doctors.get(domain, [])
    if available_doctors:
        return available_doctors[0]
    return ("Not Available", "N/A")

# Predict department based on symptoms
def predict_department(symptoms):
    # Convert symptoms to one-hot encoded features
    input_vector = np.zeros(len(unique_symptoms))
    
    # Track matched symptoms for debugging
    matched_symptoms = []
    for symptom in symptoms:
        if symptom in unique_symptoms:
            input_vector[unique_symptoms.index(symptom)] = 1
            matched_symptoms.append(symptom)
    
    # Make prediction
    probabilities = model.predict_proba([input_vector])[0]
    department_probabilities = {dept: prob * 100 for dept, prob in zip(encoder.classes_, probabilities)}
    best_department = encoder.inverse_transform([np.argmax(probabilities)])[0]
    
    return best_department, department_probabilities

# Ensure the reports directory exists
if not os.path.exists("reports"):
    os.makedirs("reports")

@app.route('/')
def home():
    return render_template('index.html')

# Add these new form fields to the /submit route in app.py
@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['username']
    patient_id = request.form['patientID']
    sex = request.form['sex']
    age = request.form['age']
    blood_group = request.form['bloodGroup']
    
    # Add default health parameters (these would normally come from form input)
    blood_pressure = "120/80 mmHg"  # Default value
    sugar_level = "100 mg/dL"       # Default value
    insulin_level = "10 mIU/L"      # Default value
    
    # Rest of the existing code...
    original_symptoms = request.form['symptoms']
    translated_symptoms = request.form['translatedSymptoms']
    
    user_symptoms = [symptom.strip().lower() for symptom in translated_symptoms.split(',') if symptom.strip()]
    department, probabilities = predict_department(user_symptoms)
    
    # Get top 3 most probable departments
    top_departments = sorted(probabilities.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # Generate a unique hashed filename to prevent conflicts
    hashed_name = hashlib.md5(name.encode()).hexdigest()[:10]
    pdf_name = f"{hashed_name}_report.pdf"
    full_pdf_path = f"reports/{pdf_name}"

    # Generate PDF report with new health parameters
    c = canvas.Canvas(full_pdf_path, pagesize=letter)
    c.setFont("Helvetica", 14)  # Default font for English text

    # Define starting Y position
    y_pos = 750  

    c.drawString(100, y_pos, "Patient Report / ರೋಗಿಯ ವರದಿ")
    y_pos -= 30  # Move down

    # Switch to Kannada-supporting font for name
    c.setFont("NotoSansKannada", 12)
    c.drawString(100, y_pos, f"Name / ಹೆಸರು: {name}")
    y_pos -= 30  # Move down for next line

    # Switch back to default font for English details
    c.setFont("Helvetica", 14)
    c.drawString(100, y_pos, f"Patient ID / ರೋಗಿಯ ಐಡಿ: {patient_id}")
    y_pos -= 20
    c.drawString(100, y_pos, f"Sex / ಲಿಂಗ: {sex}")
    y_pos -= 20
    c.drawString(100, y_pos, f"Age / ವಯಸ್ಸು: {age}")
    y_pos -= 20
    c.drawString(100, y_pos, f"Blood Group / ರಕ್ತ ಗುಂಪು: {blood_group}")
    y_pos -= 20
    
    # Add new health parameters
    c.drawString(100, y_pos, f"Blood Pressure / ರಕ್ತದೊತ್ತಡ: {blood_pressure}")
    y_pos -= 20
    c.drawString(100, y_pos, f"Sugar Level / ಸಕ್ಕರೆ ಮಟ್ಟ: {sugar_level}")
    y_pos -= 20
    c.drawString(100, y_pos, f"Insulin Level / ಇನ್ಸುಲಿನ್ ಮಟ್ಟ: {insulin_level}")
    y_pos -= 30  # Extra spacing before symptoms

    # Switch to Kannada font for symptoms
    c.setFont("NotoSansKannada", 12)
    c.drawString(100, y_pos, f"Original Symptoms / ಮೂಲ ರೋಗಲಕ್ಷಣಗಳು (Kannada): {original_symptoms}")
    y_pos -= 30  # Move down

    # Switch back to English
    c.setFont("Helvetica", 14)
    c.drawString(100, y_pos, f"Translated Symptoms / ಅನುವಾದಿತ ರೋಗಲಕ್ಷಣಗಳು (English): {translated_symptoms}")
    y_pos -= 30

    # Assign Department
    c.drawString(100, y_pos, f"Recommended Department / ಶಿಫಾರಸು ಮಾಡಿದ ವಿಭಾಗ: {department}")
    y_pos -= 30

    # Print Other Possible Departments only if they exist
    if len(top_departments) > 1:
        c.drawString(100, y_pos, "Other Possible Departments / ಇತರ ಸಂಭಾವ್ಯ ವಿಭಾಗಗಳು:")
        y_pos -= 20  # Move down

        for dept, prob in top_departments[1:]:  # Skip first (already assigned)
            c.drawString(120, y_pos, f"{dept}: {prob:.1f}%")
            y_pos -= 20  # Ensure proper spacing

    # Save the PDF
    c.save()

    # Modified to only return domain information
    return render_template('index.html', 
                          patient_details=True, 
                          domain=department, 
                          pdf_name=pdf_name)
                          
@app.route('/download/<pdf_name>')
def download_report(pdf_name):
    return send_file(f"reports/{pdf_name}", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)