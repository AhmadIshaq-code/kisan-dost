import React, { useState } from 'react';
import { Bug, Upload, AlertTriangle, ShieldCheck, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';

export const PestDoctorView: React.FC = () => {
  const [symptoms, setSymptoms] = useState('Mere chickpea ke plants par insects hain aur leaves damage ho rahi hain.');
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const handleAnalyze = () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 600);
  };

  const handleMockUpload = () => {
    setImageUploaded(true);
    setSymptoms('Chickpea plant showing leaf perforation and caterpillar presence on pods.');
  };

  return (
    <div id="pest-doctor-container" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#EAF2EA] border border-[#D8E4D8] flex items-center justify-center text-xl">
            🐛
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B4332]">
              Pest & Disease Doctor
            </h1>
            <p className="text-xs sm:text-sm text-[#5C715C]">
              Identify plant health issues through symptom description or photo
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs space-y-5">
        {/* Upload Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1B4332] mb-2">
            Upload Crop Image
          </label>
          <div
            id="crop-image-upload-box"
            onClick={handleMockUpload}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              imageUploaded 
                ? 'border-[#2D6A4F] bg-[#EAF2EA]/40' 
                : 'border-[#D8E4D8] hover:border-[#2D6A4F] hover:bg-[#EAF2EA]/20'
            }`}
          >
            {imageUploaded ? (
              <div className="flex items-center justify-center gap-2 text-[#1B4332] text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
                <span>chickpea_field_sample.jpg uploaded</span>
                <span className="text-xs text-[#5C715C] font-normal">(Click to re-upload)</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#EAF2EA] flex items-center justify-center text-[#2D6A4F]">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-[#1B4332]">
                  Click or drag and drop crop photo here
                </p>
                <p className="text-xs text-[#5C715C]">
                  Supports JPG, PNG up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#D8E4D8]"></div>
          <span className="shrink-0 mx-4 text-xs font-bold uppercase text-[#8DA08D]">
            OR
          </span>
          <div className="flex-grow border-t border-[#D8E4D8]"></div>
        </div>

        {/* Text Symptoms */}
        <div>
          <label htmlFor="symptoms-input" className="block text-xs font-bold uppercase tracking-wider text-[#1B4332] mb-2">
            Describe your crop symptoms
          </label>
          <textarea
            id="symptoms-input"
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: Mere chickpea ke plants par insects hain aur leaves damage ho rahi hain."
            className="w-full px-4 py-3 rounded-xl border border-[#D8E4D8] text-[#1B4332] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
          />
        </div>

        {/* Action Button */}
        <button
          id="analyze-symptoms-btn"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 bg-[#2D6A4F] hover:bg-[#245840] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Symptoms via Pathology Agent...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Symptoms</span>
            </>
          )}
        </button>
      </div>

      {/* Demo Result Section */}
      {hasAnalyzed && (
        <div id="pest-doctor-result" className="bg-white rounded-2xl p-6 border border-[#D8E4D8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8E4D8] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
              Diagnostic Evaluation
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF2EA] text-[#2D6A4F] border border-[#D8E4D8]">
              Demo Result
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#5C715C] block uppercase">
                Possible Issue
              </span>
              <h3 className="text-xl font-bold text-[#1B4332] mt-0.5">
                Pod Borer (Helicoverpa armigera)
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-[#F0F4F0] border border-[#D8E4D8] space-y-1.5">
              <span className="text-xs font-bold text-[#1B4332] block">
                Treatment Guidance:
              </span>
              <p className="text-xs sm:text-sm text-[#4A5D4A] leading-relaxed">
                Use an officially registered treatment according to the current product label and local agricultural guidance.
              </p>
            </div>

            {/* Safety Notice */}
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#E8DFC8] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#996F2F] shrink-0 mt-0.5" />
              <div className="text-xs text-[#7A5826] leading-relaxed">
                <span className="font-bold block mb-0.5">Agricultural Safety Reminder:</span>
                Do not use an unverified pesticide dosage. Follow the registered product label and consult your nearest extension officer for verified application schedules.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
