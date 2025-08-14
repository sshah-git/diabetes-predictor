from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Add CORS middleware after app is defined
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load trained model
model = joblib.load("app/model.pkl")

# Define input schema
class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DPF: float  # Diabetes Pedigree Function
    Age: int

feature_names = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DPF', 'Age']
importances = model.feature_importances_
sorted_features = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
top_features = sorted_features[:4]

@app.post("/predict")
def predict(input_data: DiabetesInput):
    data = np.array([[input_data.Pregnancies, input_data.Glucose, input_data.BloodPressure,
                      input_data.SkinThickness, input_data.Insulin, input_data.BMI,
                      input_data.DPF, input_data.Age]])
    prediction = model.predict(data)
    result = "Likely to have diabetes" if prediction[0] == 1 else "Not likely to have diabetes"
    
    input_dict = input_data.dict()

    top_features_vals = {name: input_dict[name] for name, _ in top_features}
    resExplanation = f"Key factors: {', '.join(f'{name} ({val})' for name, val in top_features_vals.items())}"
    
    return {
        "prediction": result,
        "explanation": resExplanation
    }