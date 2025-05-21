from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS
import os
# Load your model (Assuming it is saved as 'svc.pkl')
with open('svc.pkl', 'rb') as file:
    svc = pickle.load(file)

# Symptoms dictionary
symptoms_dict = {'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3, 'shivering': 4, 
                 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8, 'ulcers_on_tongue': 9, 'muscle_wasting': 10, 
                 'vomiting': 11, 'burning_micturition': 12, 'spotting_urination': 13, 'fatigue': 14, 'weight_gain': 15, 
                 'anxiety': 16, 'cold_hands_and_feets': 17, 'mood_swings': 18, 'weight_loss': 19, 'restlessness': 20, 
                 'lethargy': 21, 'patches_in_throat': 22, 'irregular_sugar_level': 23, 'cough': 24, 'high_fever': 25, 
                 'sunken_eyes': 26, 'breathlessness': 27, 'sweating': 28, 'dehydration': 29, 'indigestion': 30, 'headache': 31, 
                 'yellowish_skin': 32, 'dark_urine': 33, 'nausea': 34, 'loss_of_appetite': 35, 'pain_behind_the_eyes': 36, 
                 'back_pain': 37, 'constipation': 38, 'abdominal_pain': 39, 'diarrhoea': 40, 'mild_fever': 41, 
                 'yellow_urine': 42, 'yellowing_of_eyes': 43, 'acute_liver_failure': 44, 'fluid_overload': 45, 'swelling_of_stomach': 46, 
                 'swelled_lymph_nodes': 47, 'malaise': 48, 'blurred_and_distorted_vision': 49, 'phlegm': 50, 'throat_irritation': 51, 
                 'redness_of_eyes': 52, 'sinus_pressure': 53, 'runny_nose': 54, 'congestion': 55, 'chest_pain': 56, 
                 'weakness_in_limbs': 57, 'fast_heart_rate': 58, 'pain_during_bowel_movements': 59, 'pain_in_anal_region': 60, 
                 'bloody_stool': 61, 'irritation_in_anus': 62, 'neck_pain': 63, 'dizziness': 64, 'cramps': 65, 'bruising': 66, 
                 'obesity': 67, 'swollen_legs': 68, 'swollen_blood_vessels': 69, 'puffy_face_and_eyes': 70, 'enlarged_thyroid': 71, 
                 'brittle_nails': 72, 'swollen_extremeties': 73, 'excessive_hunger': 74, 'extra_marital_contacts': 75, 
                 'drying_and_tingling_lips': 76, 'slurred_speech': 77, 'knee_pain': 78, 'hip_joint_pain': 79, 'muscle_weakness': 80, 
                 'stiff_neck': 81, 'swelling_joints': 82, 'movement_stiffness': 83, 'spinning_movements': 84, 'loss_of_balance': 85, 
                 'unsteadiness': 86, 'weakness_of_one_body_side': 87, 'loss_of_smell': 88, 'bladder_discomfort': 89, 
                 'foul_smell_of_urine': 90, 'continuous_feel_of_urine': 91, 'passage_of_gases': 92, 'internal_itching': 93, 
                 'toxic_look_(typhos)': 94, 'depression': 95, 'irritability': 96, 'muscle_pain': 97, 'altered_sensorium': 98, 
                 'red_spots_over_body': 99, 'belly_pain': 100, 'abnormal_menstruation': 101, 'dischromic _patches': 102, 
                 'watering_from_eyes': 103, 'increased_appetite': 104, 'polyuria': 105, 'family_history': 106, 
                 'mucoid_sputum': 107, 'rusty_sputum': 108, 'lack_of_concentration': 109, 'visual_disturbances': 110, 
                 'receiving_blood_transfusion': 111, 'receiving_unsterile_injections': 112, 'coma': 113, 'stomach_bleeding': 114, 
                 'distention_of_abdomen': 115, 'history_of_alcohol_consumption': 116, 'fluid_overload.1': 117, 'blood_in_sputum': 118, 
                 'prominent_veins_on_calf': 119, 'palpitations': 120, 'painful_walking': 121, 'pus_filled_pimples': 122, 
                 'blackheads': 123, 'scurring': 124, 'skin_peeling': 125, 'silver_like_dusting': 126, 'small_dents_in_nails': 127, 
                 'inflammatory_nails': 128, 'blister': 129, 'red_sore_around_nose': 130, 'yellow_crust_ooze': 131}

# Diseases dictionary (map from encoded labels to disease names)
diseases_list = {15: 'Fungal infection', 4: 'Allergy', 16: 'GERD', 9: 'Chronic cholestasis', 14: 'Drug Reaction', 
                 33: 'Peptic ulcer diseae', 1: 'AIDS', 12: 'Diabetes ', 17: 'Gastroenteritis', 6: 'Bronchial Asthma', 
                 23: 'Hypertension ', 30: 'Migraine', 7: 'Cervical spondylosis', 32: 'Paralysis (brain hemorrhage)', 
                 28: 'Jaundice', 29: 'Malaria', 8: 'Chicken pox', 11: 'Dengue', 37: 'Typhoid', 40: 'hepatitis A', 
                 19: 'Hepatitis B', 20: 'Hepatitis C', 21: 'Hepatitis D', 22: 'Hepatitis E', 3: 'Alcoholic hepatitis', 
                 36: 'Tuberculosis', 10: 'Common Cold', 34: 'Pneumonia', 13: 'Dimorphic hemmorhoids(piles)', 
                 18: 'Heart attack', 39: 'Varicose veins', 26: 'Hypothyroidism', 24: 'Hyperthyroidism', 25: 'Hypoglycemia', 
                 31: 'Osteoarthristis', 5: 'Arthritis', 0: '(vertigo) Paroymsal  Positional Vertigo', 2: 'Acne', 
                 38: 'Urinary tract infection', 35: 'Psoriasis', 27: 'Impetigo'}

# Helper function to predict the disease
def predict_disease(patient_symptoms):
    input_vector = np.zeros(len(symptoms_dict))
    for item in patient_symptoms:
        input_vector[symptoms_dict[item]] = 1
    predicted_label = svc.predict([input_vector])[0]
    predicted_disease = diseases_list[predicted_label]
    return predicted_disease

# Example helper function to get details for a disease
def get_disease_details(disease):
    # Comprehensive disease details with specific medication information
    disease_details = {
        'Fungal infection': {
            'description': 'A fungal infection is a skin disease caused by a fungus.',
            'precautions': [
                'Keep affected areas clean and dry',
                'Avoid sharing personal items',
                'Wear breathable clothing',
                'Use antifungal powder in shoes'
            ],
            'medications': [
                {
                    'name': 'Clotrimazole',
                    'dosage': '1% cream',
                    'frequency': 'Apply twice daily',
                    'duration': '2-4 weeks',
                    'instructions': 'Apply to affected area and surrounding skin'
                },
                {
                    'name': 'Terbinafine',
                    'dosage': '250mg tablet',
                    'frequency': 'Once daily',
                    'duration': '2-4 weeks',
                    'instructions': 'Take with food'
                }
            ],
            'diet': [
                'Avoid sugary foods',
                'Include probiotics in diet',
                'Stay hydrated'
            ],
            'workout': [
                'Light exercise recommended',
                'Avoid excessive sweating'
            ]
        },
        'Hypertension': {
            'description': 'High blood pressure is a common condition that affects the body\'s arteries.',
            'precautions': [
                'Monitor blood pressure regularly',
                'Reduce sodium intake',
                'Maintain healthy weight',
                'Limit alcohol consumption'
            ],
            'medications': [
                {
                    'name': 'Lisinopril',
                    'dosage': '10mg',
                    'frequency': 'Once daily',
                    'duration': '30 days',
                    'instructions': 'Take in the morning with or without food'
                },
                {
                    'name': 'Amlodipine',
                    'dosage': '5mg',
                    'frequency': 'Once daily',
                    'duration': '30 days',
                    'instructions': 'Take at the same time each day'
                }
            ],
            'diet': [
                'DASH diet recommended',
                'Low sodium diet',
                'Rich in fruits and vegetables'
            ],
            'workout': [
                'Regular aerobic exercise',
                '30 minutes daily walking',
                'Avoid heavy lifting'
            ]
        },
        'Diabetes': {
            'description': 'Diabetes is a chronic condition that affects how your body metabolizes sugar.',
            'precautions': [
                'Monitor blood sugar regularly',
                'Maintain healthy diet',
                'Regular exercise',
                'Foot care'
            ],
            'medications': [
                {
                    'name': 'Metformin',
                    'dosage': '500mg',
                    'frequency': 'Twice daily',
                    'duration': '30 days',
                    'instructions': 'Take with meals'
                },
                {
                    'name': 'Glipizide',
                    'dosage': '5mg',
                    'frequency': 'Once daily',
                    'duration': '30 days',
                    'instructions': 'Take 30 minutes before breakfast'
                }
            ],
            'diet': [
                'Low glycemic index foods',
                'Regular meal timing',
                'Carbohydrate counting'
            ],
            'workout': [
                'Regular physical activity',
                'Blood sugar monitoring during exercise',
                'Stay hydrated'
            ]
        }
    }
    
    # Return default values if disease not found
    if disease not in disease_details:
        return {
            'description': 'Detailed information not available.',
            'precautions': ['Consult your healthcare provider'],
            'medications': [{
                'name': 'Consult doctor',
                'dosage': 'As prescribed',
                'frequency': 'As prescribed',
                'duration': 'As prescribed',
                'instructions': 'Follow doctor\'s instructions'
            }],
            'diet': ['Consult nutritionist'],
            'workout': ['Consult healthcare provider']
        }
    
    return disease_details[disease]

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        symptoms = data.get('symptoms')
        if not symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400

        if isinstance(symptoms, str):
            # Convert to list if it's a comma-separated string
            symptoms = [s.strip() for s in symptoms.split(",")]

        if not isinstance(symptoms, list):
            return jsonify({'error': 'Invalid symptoms format. Expected a list of symptoms.'}), 400

        # Validate symptoms against the symptoms dictionary
        invalid_symptoms = []
        valid_symptoms = []
        for symptom in symptoms:
            symptom = symptom.lower().replace(' ', '_')
            if symptom in symptoms_dict:
                valid_symptoms.append(symptom)
            else:
                invalid_symptoms.append(symptom)

        if not valid_symptoms:
            return jsonify({
                'error': 'No valid symptoms provided',
                'invalid_symptoms': invalid_symptoms,
                'valid_symptoms': list(symptoms_dict.keys())[:10]  # Return first 10 valid symptoms as examples
            }), 400

        if invalid_symptoms:
            print(f"Warning: Invalid symptoms detected: {invalid_symptoms}")

        try:
            disease = predict_disease(valid_symptoms)
            disease_details = get_disease_details(disease)
            
            response_data = {
                'disease': disease,
                'description': disease_details.get('description', ''),
                'precautions': disease_details.get('precautions', []),
                'medications': disease_details.get('medications', []),
                'diet': disease_details.get('diet', []),
                'workout': disease_details.get('workout', []),
                'processed_symptoms': valid_symptoms
            }

            if invalid_symptoms:
                response_data['warning'] = f"Some symptoms were ignored: {', '.join(invalid_symptoms)}"

            return jsonify(response_data)

        except KeyError as e:
            return jsonify({
                'error': f'Unknown symptom: {str(e)}',
                'valid_symptoms': list(symptoms_dict.keys())[:10]
            }), 400
        except Exception as e:
            return jsonify({
                'error': f'Prediction error: {str(e)}',
                'details': 'An error occurred while processing the symptoms'
            }), 500

    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}',
            'details': 'An unexpected error occurred'
        }), 500

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'available_symptoms': list(symptoms_dict.keys())[:10]  # Return first 10 symptoms as examples
    }), 200

# Add a symptoms list endpoint
@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    return jsonify({
        'symptoms': list(symptoms_dict.keys())
    }), 200

if __name__ == '__main__':
    PORT = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=PORT)
