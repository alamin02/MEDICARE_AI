import React, { useState } from 'react';
import {
  UploadCloud,
  FileImage,
  AlertTriangle,
  CheckCircle2,
  X,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge';
import { InjuryAnalysis } from '../../types';

interface InjuryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete?: (analysis: InjuryAnalysis) => void;
  onBookSpecialist?: (specialty: string) => void;
}

export const InjuryUploadModal: React.FC<InjuryUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  onBookSpecialist
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<InjuryAnalysis | null>(null);
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setAnalysisResult(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME types: JPEG, JPG, PNG, WebP
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Invalid file format. Please upload JPEG, PNG, or WebP images only.');
      return;
    }

    // Validate file size: maximum 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const startAnalysis = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Synthetic demo result clearly labelled
      const syntheticResult: InjuryAnalysis = {
        id: `inj-${Date.now()}`,
        patient_id: 'patient-demo-1',
        image_url: previewUrl || '',
        image_name: selectedFile.name,
        findings: [
          'Visible superficial dermis laceration / cut with localized marginal erythema',
          'Intact surrounding capillary bed without evidence of deep arterial bleeding',
          'Soft tissue edema consistent with mild mechanical friction trauma'
        ],
        danger_signs: [
          'Monitor closely for expanding redness, elevated heat, throbbing, or purulent drainage',
          'Seek emergency clinical care if bleeding does not halt after 10 minutes of direct pressure'
        ],
        first_aid_steps: [
          '1. Thoroughly cleanse hands with soap and warm water prior to wound contact',
          '2. Apply continuous, gentle direct pressure using sterile non-stick gauze for 5-10 minutes',
          '3. Rinse wound gently with cool running tap water; avoid harsh scrubbing or alcohol swabs',
          '4. Apply a thin layer of petroleum jelly or antibiotic ointment and cover with sterile dressing'
        ],
        recommended_specialty: 'General Medicine / Urgent Care',
        severity_level: 'LOW',
        confidence_note: 'DEMO / SYNTHETIC ANALYSIS: Visual triage algorithm output. Photographic inspection alone cannot confirm deep tissue pathology, fractures, or replace certified clinical diagnosis.',
        created_at: new Date().toISOString(),
        is_demo: true
      };

      setAnalysisResult(syntheticResult);
      setIsAnalyzing(false);
      if (onAnalysisComplete) {
        onAnalysisComplete(syntheticResult);
      }
    }, 1500);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setUploadProgress(0);
    setValidationError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#0D1B2A] text-white px-6 py-4 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Multimodal AI Injury Analysis</h3>
                <DemoBadge label="DEMO VISION" />
              </div>
              <p className="text-xs text-slate-400">
                Visual symptom assessment & immediate safe first-aid triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!analysisResult ? (
            <>
              {/* Uploader Box */}
              {!previewUrl ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-105 transition">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-navy mb-1">
                    Upload injury photograph
                  </h4>
                  <p className="text-xs text-slate-500 text-center max-w-md mb-4">
                    Supports <strong>JPEG, PNG, WebP</strong> up to 10MB. Ensure good lighting and a clear, focused view of the affected area.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm group-hover:bg-blue-700 transition">
                    Select Photograph
                  </span>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Injury Preview"
                      className="max-h-64 object-contain w-auto mx-auto"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-xs transition"
                    >
                      Change Photo
                    </button>
                  </div>

                  {/* Upload Progress Bar */}
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Analyzing injury features with vision model...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Consent checkbox */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed">
                      I consent to temporary analysis of this synthetic demo photograph. I acknowledge this is an assistive AI tool and does not provide an autonomous medical diagnosis or replace clinician evaluation.
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      disabled={isAnalyzing}
                      className="px-4 py-2 text-sm text-slate-600 hover:text-navy"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startAnalysis}
                      disabled={isAnalyzing || !consentGiven}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAnalyzing ? 'Analyzing...' : 'Run Injury Assessment'}</span>
                    </button>
                  </div>
                </div>
              )}

              {validationError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </>
          ) : (
            /* Analysis Results Card */
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Synthetic Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">{analysisResult.confidence_note}</strong>
                </div>
              </div>

              {/* Visible Findings */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Possible Visible Injury Findings
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-800 pl-4 list-disc">
                  {analysisResult.findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Danger Signs */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Danger Signs to Watch For
                </h4>
                <ul className="space-y-1.5 text-xs text-red-900 pl-4 list-disc">
                  {analysisResult.danger_signs.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* Safe First-Aid Steps */}
              <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-teal-600" />
                  Recommended Immediate First-Aid Guidance
                </h4>
                <div className="space-y-1.5 text-xs text-slate-800">
                  {analysisResult.first_aid_steps.map((s, i) => (
                    <p key={i} className="leading-relaxed">{s}</p>
                  ))}
                </div>
              </div>

              {/* Recommended Specialty & Action CTA */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">
                    Recommended Clinical Specialty:
                  </span>
                  <div className="text-sm font-bold text-navy">
                    {analysisResult.recommended_specialty}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-navy border border-slate-300 rounded-lg bg-white"
                  >
                    Scan Another
                  </button>
                  {onBookSpecialist && (
                    <button
                      onClick={() => onBookSpecialist(analysisResult.recommended_specialty)}
                      className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-sm"
                    >
                      <span>Find Specialist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
