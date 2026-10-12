import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [reportText, setReportText] = useState("Patient WBC count is 52.1 K/uL, Platelet low at 22 K/uL, HGB 8.2 g/dL");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [imageResult, setImageResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleAnalyzeReport = async () => {
    setLoadingReport(true);
    try {
      const response = await fetch('http://localhost:5000/api/v1/analyze_blood_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_text: reportText })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAnalysisResult(data.data);
      }
    } catch (error) {
      console.error("Backend error:", error);
      alert("Make sure Flask app.py is running on port 5000!");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      alert("Please select a microscope cell image first.");
      return;
    }
    setLoadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/v1/analyze_cell_image', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.status === 'success') {
        setImageResult(data.data);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark px-4 py-3 shadow-sm border-bottom border-secondary" style={{ backgroundColor: '#1e293b' }}>
        <div className="container-fluid px-3">
          <span className="navbar-brand mb-0 h1 fw-bold fs-5">🧬 ASIO Smart Healthcare Platform</span>
          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2">
            100% AI/ML Architecture Active
          </span>
        </div>
      </nav>

      {/* Spacious Fluid Widescreen Container */}
      <div className="container-fluid px-4 px-xl-5 py-4">
        {/* Hero Banner */}
        <div className="p-4 p-lg-5 mb-4 rounded-4 shadow-lg border border-secondary text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          <h1 className="fw-bold mb-2 fs-2 text-white">AI-Enabled Secured Healthcare Service Optimization</h1>
          <p className="text-light opacity-75 mb-0" style={{ fontSize: '0.95rem' }}>
            Advanced multi-modal blood cancer intelligence: Natural Language Report Parsing, ResNet50 Cell Smear Vision, BioBERT EHR Extraction, and SHAP Explainability.
          </p>
        </div>

        {/* Main Grid */}
        <div className="row g-4">
          <div className="col-xl-6">
            <div className="card h-100 border-0 shadow-lg rounded-4 text-white" style={{ backgroundColor: '#1e293b' }}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 fw-bold text-info fs-6">
                📄 Complete Blood Count (CBC) & Clinical Notes Analyzer
              </div>
              <div className="card-body p-4">
                <textarea 
                  className="form-control bg-dark text-light border-secondary mb-3 p-3 rounded-3" 
                  rows="5" 
                  value={reportText} 
                  onChange={(e) => setReportText(e.target.value)}
                ></textarea>
                <button 
                  onClick={handleAnalyzeReport} 
                  disabled={loadingReport}
                  className="btn btn-info w-100 py-3 fw-bold text-dark shadow-sm"
                >
                  {loadingReport ? "Analyzing..." : "Run 100% AI Pipeline Analysis"}
                </button>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card h-100 border-0 shadow-lg rounded-4 text-white" style={{ backgroundColor: '#1e293b' }}>
              <div className="card-header bg-transparent border-0 pt-4 px-4 fw-bold text-warning fs-6">
                🔬 Microscope Cell Smear Image Scanner (+30% AI)
              </div>
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <input 
                    type="file" 
                    className="form-control bg-dark text-light border-secondary mb-3 p-3 rounded-3" 
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <p className="text-light opacity-75 small mb-3">Upload high-resolution microscopy to test PyTorch ResNet50 blast cell classification.</p>
                </div>
                <div>
                  <button 
                    onClick={handleAnalyzeImage} 
                    disabled={loadingImage}
                    className="btn btn-warning w-100 py-3 fw-bold text-dark shadow-sm mb-3"
                  >
                    {loadingImage ? "Scanning..." : "Scan Cell Smear Image"}
                  </button>
                  {imageResult && (
                    <div className="alert alert-dark border border-success bg-opacity-10 text-light py-2 px-3 mb-0 rounded-3 small">
                      <strong>{imageResult.cell_classification}</strong><br />
                      <span className="text-light opacity-75">Blast Prob: {imageResult.blast_cell_probability}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4 text-white" style={{ backgroundColor: '#1e293b' }}>
                <div className="card-header bg-primary bg-opacity-25 border-bottom border-primary border-opacity-25 p-4 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold text-info">📊 Multi-Modal Diagnostic Results Dashboard</h5>
                  <span className="badge bg-primary px-3 py-2">Target Accuracy: 99.8%</span>
                </div>
                <div className="card-body p-4">
                  <div className="row g-4 align-items-center">
                    <div className="col-xl-4 text-center border-end border-secondary">
                      <div className="p-4 rounded-4 bg-dark bg-opacity-50 border border-secondary">
                        <span className="text-light opacity-75 small text-uppercase fw-bold">Combined Risk Score</span>
                        <h1 className="display-4 fw-bold text-danger my-2">{analysisResult.risk_probability_pct}%</h1>
                        <span className="badge bg-danger px-3 py-1">{analysisResult.risk_tier}</span>
                      </div>
                    </div>
                    <div className="col-xl-8">
                      <h6 className="fw-bold mb-2">⚠️ Clinical Symptom Flags & BioBERT Entities</h6>
                      <ul className="list-group mb-3 bg-transparent">
                        {analysisResult.symptom_flags.map((flag, idx) => (
                          <li key={idx} className="list-group-item bg-dark bg-opacity-50 text-danger border-secondary mb-2 rounded-3 px-3 py-2 fw-semibold small">
                            ⚠️ {flag}
                          </li>
                        ))}
                      </ul>
                      <h6 className="fw-bold mb-2">📈 SHAP Visual Explanations (+10% AI Feature Attribution)</h6>
                      <pre className="bg-black text-info p-3 rounded-3 small border border-secondary mb-0" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {JSON.stringify(analysisResult.visual_explanations_shap, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;