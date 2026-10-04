from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder


# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="Messi Club Prediction API",
    description="Machine Learning Football Prediction System",
    version="1.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# LOAD ORIGINAL DATASET
# =====================================================

df = pd.read_csv(r"D:\MESSI\data.csv")


# =====================================================
# CREATE ENCODERS FROM ORIGINAL DATA
# =====================================================

season_encoder = LabelEncoder()
competition_encoder = LabelEncoder()
position_encoder = LabelEncoder()
type_encoder = LabelEncoder()
assist_encoder = LabelEncoder()
club_encoder = LabelEncoder()


season_encoder.fit(df["Season"])
competition_encoder.fit(df["Competition"])
position_encoder.fit(df["Playing_Position"])
type_encoder.fit(df["Type"])
assist_encoder.fit(df["Goal_assist"])
club_encoder.fit(df["Club"])


# =====================================================
# LOAD MODELS
# =====================================================

lr = joblib.load(
    r"D:\MESSI\models\logistic_regression.pkl"
)

knn = joblib.load(
    r"D:\MESSI\models\knn.pkl"
)

gnb = joblib.load(
    r"D:\MESSI\models\naive_bayes.pkl"
)

dtc = joblib.load(
    r"D:\MESSI\models\decision_tree.pkl"
)

svc = joblib.load(
    r"D:\MESSI\models\svm.pkl"
)


# =====================================================
# LOAD SCALER
# =====================================================

scaler = joblib.load(
    r"D:\MESSI\scaler.pkl"
)


# =====================================================
# INPUT FORMAT
# =====================================================

class PredictionInput(BaseModel):

    Season: str

    Competition: str

    Playing_Position: str

    Type: str

    Goal_assist: str


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "Messi Club Prediction API is running!"
    }


# =====================================================
# OPTIONS
# =====================================================

@app.get("/options")
def get_options():

    return {

        # ORIGINAL VALUES FROM data.csv
        "Season": [
            str(x)
            for x in season_encoder.classes_
        ],

        "Competition": [
            str(x)
            for x in competition_encoder.classes_
        ],

        "Playing_Position": [
            str(x)
            for x in position_encoder.classes_
        ],

        "Type": [
            str(x)
            for x in type_encoder.classes_
        ],

        "Goal_assist": [
            str(x)
            for x in assist_encoder.classes_
        ]
    }


# =====================================================
# PREDICT
# =====================================================

@app.post("/predict")
def predict(data: PredictionInput):


    # =================================================
    # CONVERT ORIGINAL VALUES → ENCODED VALUES
    # =================================================

    season = season_encoder.transform(
        [data.Season]
    )[0]

    competition = competition_encoder.transform(
        [data.Competition]
    )[0]

    position = position_encoder.transform(
        [data.Playing_Position]
    )[0]

    goal_type = type_encoder.transform(
        [data.Type]
    )[0]

    assist = assist_encoder.transform(
        [data.Goal_assist]
    )[0]


    # =================================================
    # CREATE INPUT DATAFRAME
    # =================================================

    input_data = pd.DataFrame({

        "Season": [season],

        "Competition": [competition],

        "Playing_Position": [position],

        "Type": [goal_type],

        "Goal_assist": [assist]

    })


    # =================================================
    # SCALE DATA
    #
    # Your original training code used:
    #
    # LR  → scaled
    # KNN → scaled
    #
    # NB  → unscaled
    # DT  → unscaled
    # SVM → unscaled
    # =================================================

    input_scaled = scaler.transform(
        input_data
    )


    # =================================================
    # MODEL PREDICTIONS
    # =================================================

    lr_prediction = lr.predict(
        input_scaled
    )[0]

    knn_prediction = knn.predict(
        input_scaled
    )[0]

    nb_prediction = gnb.predict(
        input_data
    )[0]

    dt_prediction = dtc.predict(
        input_data
    )[0]

    svm_prediction = svc.predict(
        input_data
    )[0]


    # =================================================
    # ENCODED CLUB → ORIGINAL CLUB NAME
    # =================================================

    lr_club = club_encoder.inverse_transform(
        [int(lr_prediction)]
    )[0]

    knn_club = club_encoder.inverse_transform(
        [int(knn_prediction)]
    )[0]

    nb_club = club_encoder.inverse_transform(
        [int(nb_prediction)]
    )[0]

    dt_club = club_encoder.inverse_transform(
        [int(dt_prediction)]
    )[0]

    svm_club = club_encoder.inverse_transform(
        [int(svm_prediction)]
    )[0]


    # =================================================
    # RETURN ORIGINAL VALUES
    # =================================================

    return {

        "logistic_regression": str(lr_club),

        "knn": str(knn_club),

        "naive_bayes": str(nb_club),

        "decision_tree": str(dt_club),

        "svm": str(svm_club)

    }