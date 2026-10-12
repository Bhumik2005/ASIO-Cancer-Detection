import re

class BloodReportParser:
    """[10% AI] NLP Feature Extraction & Unit Standardization Module."""
    
    @staticmethod
    def parse_report_text(text: str) -> dict:
        features = {
            'wbc_count_per_ul': 7500.0,        
            'platelet_count_per_ul': 250000.0, 
            'hemoglobin_g_dl': 14.0,           
            'hematocrit_pct': 42.0,            
            'cell_diameter_um': 10.0,          
            'nucleus_area_pct': 40.0,          
            'chromatin_density': 0.4
        }
        
        patterns = {
            'wbc_count_per_ul': r'(?:WBC|White\s*Blood\s*Cell(?:s)?)\D*(\d+\.?\d*)',
            'platelet_count_per_ul': r'(?:Platelet(?:s)?|PLT)\D*(\d+\.?\d*)',
            'hemoglobin_g_dl': r'(?:Hemoglobin|HGB|Hb)\D*(\d+\.?\d*)',
            'hematocrit_pct': r'(?:Hematocrit|HCT)\D*(\d+\.?\d*)'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                val = float(match.group(1))
                # Unit Standardization: converts x10^3 /uL to /uL
                if key == 'wbc_count_per_ul' and val < 200:
                    val *= 1000.0
                elif key == 'platelet_count_per_ul' and val < 1000:
                    val *= 1000.0
                features[key] = val

        # Morphology heuristic mapping
        if features['wbc_count_per_ul'] > 20000 or features['platelet_count_per_ul'] < 50000:
            features['nucleus_area_pct'] = 85.0
            features['cell_diameter_um'] = 15.0
            features['chromatin_density'] = 0.35

        return features