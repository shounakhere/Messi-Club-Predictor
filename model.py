import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import joblib
from sklearn.preprocessing import LabelEncoder
warnings = warnings.filterwarnings('ignore')

df = pd.read_csv('D:/MESSI/data.csv')
encoders = {}
categorical_columns = [
    'Club',
    'Competition',
    'Type',
    'Season',
    'Goal_assist',
    'Playing_Position'
]

dfupdate = df.drop(['Venue','At_score','Result','Matchday','Minute','Opponent','Date'], axis=1)
le = LabelEncoder()
dfupdate['Club'] = le.fit_transform(df['Club'])
dfupdate['Competition'] = le.fit_transform(df['Competition'])
dfupdate['Type'] = le.fit_transform(df['Type'])
dfupdate['Season'] = le.fit_transform(df['Season'])
dfupdate['Goal_assist'] = le.fit_transform(df['Goal_assist'])
dfupdate['Playing_Position'] = le.fit_transform(df['Playing_Position'])
for column in categorical_columns:

    le = LabelEncoder()

    dfupdate[column] = le.fit_transform(dfupdate[column])

    encoders[column] = le
from sklearn.model_selection import train_test_split
X = dfupdate.drop('Club',axis=1)
y = dfupdate['Club']
feature_columns = X.columns.tolist()

joblib.dump(
    feature_columns,
    r"D:\MESSI\feature_columns.pkl"
)
X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
sc = StandardScaler()
X_train_scaled = sc.fit_transform(X_train)
X_test_scaled = sc.transform(X_test)
LR = LogisticRegression()
LR.fit(X_train_scaled,y_train)
y_pred = LR.predict(X_test_scaled)
accuracy = accuracy_score(y_test,y_pred)
print("Logistic Regression : " , accuracy * 100)
from sklearn.neighbors import KNeighborsClassifier
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)
y_pred_two  = knn.predict(X_test_scaled)
accuracy1 = accuracy_score(y_test,y_pred_two)
print("KNN : ", accuracy1 * 100)
from sklearn.naive_bayes import GaussianNB
gnb = GaussianNB()
y_pred_three = gnb.fit(X_train, y_train).predict(X_test)
accuracy2 = accuracy_score(y_test, y_pred_three)
print("Naive Bayes : ", accuracy2 * 100)
from sklearn.tree import DecisionTreeClassifier
dtc = DecisionTreeClassifier(random_state=42)
dtc.fit(X_train, y_train)
y_pred_four = dtc.predict(X_test)
accuracy3 = accuracy_score(y_test, y_pred_four)
print("Decision Tree : ", accuracy3 * 100)
from sklearn.svm import SVC
svc = SVC(kernel='rbf')
svc.fit(X_train, y_train)
y_pred = svc.predict(X_test)
accuracy4 = accuracy_score(y_test, y_pred)
print("SVM : ", accuracy4 * 100)
print(dfupdate.info())

joblib.dump(sc, "scaler.pkl")

joblib.dump(LR, "models/logistic_regression.pkl")
joblib.dump(knn, "models/knn.pkl")
joblib.dump(gnb, "models/naive_bayes.pkl")
joblib.dump(dtc, "models/decision_tree.pkl")
joblib.dump(svc, "models/svm.pkl")

joblib.dump(encoders, "encoders.pkl")