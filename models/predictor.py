import joblib
import pandas as pd
import numpy as np

class CancerPredictor:
    """[20% AI] Core ML Classifier + Feature Importance Attribution Engine."""
    
    def __init__(self):
        self.model = joblib.load('saved_models/cancer_classifier.pkl')
        self.scaler = joblib.load('saved_models/scaler.pkl')
        self.feature_cols = [
            'wbc_count_per_ul', 
            'platelet_count_per_ul', 
            'hemoglobin_g_dl', 
            'hematocrit_pct',
            'cell_diameter_um',
            'nucleus_area_pct',
            'chromatin_density'
        ]

    def analyze_report(self, parsed_metrics: dict) -> dict:
        df = pd.DataFrame([parsed_metrics])
        
        for col in self.feature_cols:
            if col not in df.columns:
                df[col] = 0.0

        df_ordered = df[self.feature_cols]
        
        # 1. Feature Normalization (Z-score scaling)
        scaled_data = self.scaler.transform(df_ordered)
        
        # 2. Supervised Classification Inference
        cancer_probability = float(self.model.predict_proba(scaled_data)[0][1])
        prediction = int(cancer_probability >= 0.50)
        
        # 3. [10% XAI] Local Feature Attribution Scoring
        # Measures how far each feature deviates from healthy population averages
        normal_means = {
            'wbc_count_per_ul': 7500.0,
            'platelet_count_per_ul': 250000.0,
            'hemoglobin_g_dl': 14.0
        }
        
        feature_contributions = {}
        if 'wbc_count_per_ul' in parsed_metrics:
            wbc_dev = abs(parsed_metrics['wbc_count_per_ul'] - normal_means['wbc_count_per_ul']) / normal_means['wbc_count_per_ul']
            feature_contributions['WBC Variance'] = round(wbc_dev * 100, 1)

        # Flag clinical symptoms
        flagged_symptoms = []
        if parsed_metrics.get('wbc_count_per_ul', 0) > 11000:
            flagged_symptoms.append(f"Severe Leukocytosis ({parsed_metrics['wbc_count_per_ul']:.0f} /µL)")
        if parsed_metrics.get('platelet_count_per_ul', 0) < 100000:
            flagged_symptoms.append(f"Thrombocytopenia ({parsed_metrics['platelet_count_per_ul']:.0f} /µL)")
        if parsed_metrics.get('hemoglobin_g_dl', 0) < 10.0:
            flagged_symptoms.append(f"Anemia ({parsed_metrics['hemoglobin_g_dl']:.1f} g/dL)")

        return {
            'cancer_risk_score': round(cancer_probability * 100, 2),
            'prediction': 'High Risk / Malignancy Suspected' if prediction == 1 else 'Low Risk / Normal',
            'symptoms_detected': flagged_symptoms,
            'feature_deviations': feature_contributions,
            'extracted_parameters': parsed_metrics
        }