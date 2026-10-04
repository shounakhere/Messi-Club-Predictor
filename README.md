# ⚽ Messi Club Prediction

## Machine Learning Football Analytics

An intelligent football prediction system that uses multiple Machine Learning algorithms to predict the football club associated with a given match/goal scenario.

The project analyzes match characteristics such as:

- Season
- Competition
- Playing Position
- Goal Type
- Goal Assist

Five different Machine Learning models are used to make predictions, and the **majority prediction** is displayed as the final predicted club.

---

## 🚀 Features

- Modern football-themed web interface
- Interactive prediction form
- Five Machine Learning models
- Real-time prediction through a FastAPI backend
- React frontend
- Multiple model comparison
- Majority voting between models
- Model accuracy displayed on the website
- Encoded categorical features handled automatically
- Pre-trained models saved using Joblib

---

## 🤖 Machine Learning Models

The project uses the following algorithms:

1. Logistic Regression
2. K-Nearest Neighbors (KNN)
3. Naive Bayes
4. Decision Tree
5. Support Vector Machine (SVM)

### Model Accuracy

| Model | Accuracy |
|---|---:|
| Logistic Regression | 95.03% |
| KNN | 96.45% |
| Naive Bayes | 96.45% |
| Decision Tree | 100% |
| SVM | 95.74% |

The models are trained using historical football data.

---

## 🧠 How Prediction Works

The user selects:

- Season
- Competition
- Playing Position
- Goal Type
- Goal Assist

These values are sent from the React frontend to the FastAPI backend.

The backend:

1. Receives the user input.
2. Converts categorical values using the saved encoders.
3. Applies the saved feature scaler where required.
4. Sends the processed data to all five models.
5. Gets a prediction from each model.
6. Compares the predictions.
7. Uses majority voting to determine the final club.
8. Sends the predictions back to the frontend.

For example:

```text
Logistic Regression → FC Barcelona
KNN                 → Paris Saint-Germain
Naive Bayes         → Paris Saint-Germain
Decision Tree       → Paris Saint-Germain
SVM                 → FC Barcelona
