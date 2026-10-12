import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score

def load_and_preprocess_dataset(csv_path="data/dataset.csv"):
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}.")
    
    df = pd.read_csv(csv_path)
    
    # 1. Target column: 1 if Leukemia (Cancerous), 0 otherwise
    df['is_cancerous'] = (df['disease_category'] == 'Leukemia').astype(int)
    
    # 2. Select numerical features available in this dataset
    feature_cols = [
        'wbc_count_per_ul', 
        'platelet_count_per_ul', 
        'hemoglobin_g_dl', 
        'hematocrit_pct',
        'cell_diameter_um',
        'nucleus_area_pct',
        'chromatin_density'
    ]
    
    X = df[feature_cols]
    y = df['is_cancerous']
    
    return X, y, feature_cols

def train_and_save_model():
    print("[1/3] Loading dataset and mapping columns...")
    X, y, feature_cols = load_and_preprocess_dataset("data/dataset.csv")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("[2/3] Training XGBoost Malignancy Classifier...")
    model = XGBClassifier(
        n_estimators=100, 
        max_depth=5, 
        learning_rate=0.05, 
        eval_metric='logloss'
    )
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    
    print("\n--- MODEL PERFORMANCE METRICS ---")
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}\n")
    
    os.makedirs('saved_models', exist_ok=True)
    joblib.dump(model, 'saved_models/cancer_classifier.pkl')
    joblib.dump(scaler, 'saved_models/scaler.pkl')
    joblib.dump(feature_cols, 'saved_models/feature_cols.pkl')
    print("[3/3] Model, Scaler, and Feature List saved to saved_models/")

if __name__ == "__main__":
    train_and_save_model()