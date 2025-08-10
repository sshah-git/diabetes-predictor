import pandas as pd #used to load/manipulate data
from sklearn.model_selection import train_test_split #used to split data into training and testing sets
from sklearn.ensemble import RandomForestClassifier #ML algorithm
import joblib #used to save the model to deploy later

df=pd.read_csv("diabetes.csv") #load the dataset
x=df.drop("Outcome",axis=1) #features
y=df["Outcome"] #target variable

X_train, X_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42
)

#Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "app/model.pkl")
print("✅ Model trained and saved to app/model.pkl")
