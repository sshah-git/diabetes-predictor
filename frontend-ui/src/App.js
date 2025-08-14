import { useState } from "react";

import './App.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';


function App() {
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    age: ''
  });

  const fieldLabels = {
  pregnancies: "Number of Pregnancies",
  glucose: "Glucose Level",
  bloodPressure: "Blood Pressure",
  skinThickness: "Skin Thickness",
  insulin: "Insulin Level",
  bmi: "BMI",
  diabetesPedigreeFunction: "Diabetes Pedigree Function",
  age: "Age"
};


  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify({
          Pregnancies: parseFloat(formData.pregnancies),
          Glucose: parseFloat(formData.glucose),
          BloodPressure: parseFloat(formData.bloodPressure),
          SkinThickness: parseFloat(formData.skinThickness),
          Insulin: parseFloat(formData.insulin),
          BMI: parseFloat(formData.bmi),
          DPF: parseFloat(formData.diabetesPedigreeFunction),
          Age: parseFloat(formData.age)
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred.");
    }
  };
  const normalRanges = {
  pregnancies: [0, 8], // example range
  glucose: [0, 140], //glucose tolerance test (140-199 suggests prediabetes) >200=diabetes
  bloodPressure: [0, 85], //diastolic >90 indicates high bp, common in diabetics
  skinThickness: [0, 20], // example range
  insulin: [16, 166], //2-hour after serum insulin
  bmi: [18.5, 24.9], //bmi >25 higher risk for diabetes
  diabetesPedigreeFunction: [0.25, 0.35],  //suggest family history->probability of getting diabetes
  age: [0, 39] //adults 40-55 more prone to diabetes
};

const chartData=Object.entries(formData).map(([key,value]) => ({
  name: fieldLabels[key],
  value: Number(value)||0,
  min:normalRanges[key]?.[0] ||0,
  max:normalRanges[key]?.[0]||0,
}));


  return (
    <div className="App">
      <div className="FormContainer">
      <h1>Diabetes Risk Predictor</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label>{fieldLabels[field]}</label>
            <input
              name={field}
              type="number"
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <br></br>
        <button type="submit">Predict</button>
      </form>
     
      </div>
      <div className="ChartContainer">
      <ResponsiveContainer className="charts" width="100%" height={400}>
        <BarChart data={chartData} margin={{ right: 30, left: 55, bottom: 90 }}>
        
          <XAxis dataKey="name" angle={-30} interval={0} textAnchor="end"/><br></br>
          <YAxis />
          <Tooltip />
         <Legend verticalAlign="top" height={36} />
          <Bar dataKey="value" fill="#8884d8" name="Your Value" />
          {chartData.map((item) => (
          <ReferenceLine key={item.name} y={item.max} stroke="red" strokeDasharray="3 3"  />
          ))}

        </BarChart>
      </ResponsiveContainer>
      {result.prediction && <h2>Prediction: {result.prediction}</h2>}
      {result.explanation && <p>{result.explanation}</p>}
      </div>
    </div>
  );
  
  
}

export default App;
