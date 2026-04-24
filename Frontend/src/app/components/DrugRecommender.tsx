import { useState, useRef, useEffect } from 'react';
import { ArrowRight, TrendingDown, Activity, Search, X } from 'lucide-react';
import { Patient } from '../../utils/csvParser';
import { fetchSwapRecommendations, SwapRecommendation } from '../../utils/api';

// YOU MUST PASTE YOUR 550 DRUGS HERE TOO!
const ALL_DRUGS = [
  "ZANTAC", "HUMIRA", "PREDNISONE", "INFLECTRA", "REVLIMID", "METHOTREXATE", "RANITIDINE", "DUPIXENT", "ENBREL", "ASPIRIN", "DEXAMETHASONE", "OMEPRAZOLE", "XARELTO", "RITUXIMAB", "ACETAMINOPHEN", "GABAPENTIN", "COSENTYX", "METFORMIN", "FOLIC ACID", "XOLAIR", "VEDOLIZUMAB", "ACTEMRA", "MOUNJARO", "AMLODIPINE", "FUROSEMIDE", "LYRICA", "ATORVASTATIN", "LISINOPRIL", "PREDNISOLONE", "PANTOPRAZOLE", "AVONEX", "LEVOTHYROXINE", "REMICADE", "ELIQUIS", "NEXIUM", "XYREM", "XELJANZ", "ORENCIA", "IBUPROFEN", "REPATHA", "METOPROLOL", "SULFASALAZINE", "VITAMIN D3", "CYCLOPHOSPHAMIDE", "VITAMIN D", "SIMVASTATIN", "TYLENOL", "OTEZLA", "TECFIDERA", "OXYCONTIN", "TEDUGLUTIDE", "ADAPALENE 0.1 G IN 100 G TOPICAL GEL _PROACTIV MD ADAPALENE ACNE TREATMENT_", "TACROLIMUS", "SYNTHROID", "IBRANCE", "ALLOPURINOL", "RISPERDAL", "METHYLPREDNISOLONE", "HYDROCHLOROTHIAZIDE", "TYSABRI", "CIMZIA", "PROLIA", "ENTRESTO", "RANITIDINE HYDROCHLORIDE", "CALCIUM", "STELARA", "INFLIXIMAB", "HYDROXYCHLOROQUINE", "TRAMADOL", "ZEPBOUND", "POMALYST", "ALBUTEROL", "LORAZEPAM", "LIPITOR", "CARBOPLATIN", "ONDANSETRON", "PRILOSEC", "ACYCLOVIR", "PREVACID", "TOFACITINIB EXTENDED RELEASE ORAL TABLET _XELJANZ_", "RAMIPRIL", "LOSARTAN", "LEFLUNOMIDE", "VITAMIN B12", "HUMALOG", "SIMPONI", "OXYCODONE", "CYMBALTA", "JAKAFI", "CLONAZEPAM", "BISOPROLOL", "LASIX", "NEULASTA", "ALBUTEROL SULFATE", "ELIGARD", "OXYCODONE HYDROCHLORIDE", "MYCOPHENOLATE MOFETIL", "SERTRALINE", "NUPLAZID", "SPIRIVA", "SPIRONOLACTONE", "TRULICITY", "LANSOPRAZOLE", "SYMBICORT", "PROTONIX", "ADVAIR", "ALPRAZOLAM", "SODIUM CHLORIDE", "POTASSIUM CHLORIDE", "ACETAMINOPHEN / HYDROCODONE BITARTRATE PILL", "GILENYA", "LANTUS", "DIPHENHYDRAMINE", "FENTANYL", "CETIRIZINE HYDROCHLORIDE", "IMBRUVICA", "DOCETAXEL", "HYDROCORTISONE", "CARVEDILOL", "MIRENA", "HYDROXYCHLOROQUINE SULFATE", "PACLITAXEL", "SKYRIZI", "PREGABALIN", "QUETIAPINE", "NAPROXEN", "DIANEAL LOW CALCIUM PERITONEAL DIALYSIS SOLUTION WITH DEXTROSE", "BACLOFEN", "ZYRTEC", "ATENOLOL", "WARFARIN", "OCREVUS", "TRAZODONE", "SINGULAIR", "RISPERIDONE", "LEVETIRACETAM", "FORTEO", "CITALOPRAM", "ROSUVASTATIN", "CLOPIDOGREL", "CELEBREX", "MAGNESIUM", "AMPYRA", "PERCOCET", "REMODULIN", "KEYTRUDA", "MORPHINE SULFATE", "FLUOROURACIL", "CLOZAPINE", "DIAZEPAM", "CARBIDOPA / LEVODOPA", "PANTOPRAZOLE SODIUM", "RINVOQ", "CHOLECALCIFEROL", "ARAVA", "AZATHIOPRINE", "AMOXICILLIN", "LENALIDOMIDE", "OXALIPLATIN", "VINCRISTINE", "NIVOLUMAB", "PLAVIX", "ETOPOSIDE", "LETAIRIS", "FISH OILS", "DILAUDID", "TRUVADA", "OLANZAPINE", "PLAQUENIL", "LEVOTHYROXINE SODIUM", "ABILIFY", "AMITRIPTYLINE", "CIPROFLOXACIN", "ZOFRAN", "DOXORUBICIN", "BENADRYL", "SOLIRIS", "CLOZARIL", "DESOXIMETASONE", "MIRALAX", "CISPLATIN", "XANAX", "MIRTAZAPINE", "MORPHINE", "LAMOTRIGINE", "METFORMIN HYDROCHLORIDE", "FAMOTIDINE", "OPSUMIT", "RANITIDINE ORAL CAPSULE", "GENOTROPIN", "CYTARABINE", "OPDIVO", "LEVOFLOXACIN", "TAMSULOSIN", "RITUXAN", "ADALIMUMAB", "VENTOLIN", "HYDROMORPHONE", "METHOTREXATE SODIUM", "DICLOFENAC", "AVANDIA", "APIXABAN", "AMLODIPINE BESYLATE", "BEVACIZUMAB", "AVASTIN", "OZEMPIC", "IMMUNOGLOBULIN G, HUMAN", "TRAMADOL HYDROCHLORIDE", "IRON", "PRADAXA", "CERTOLIZUMAB PEGOL", "AMBRISENTAN", "CETIRIZINE", "VENLAFAXINE", "FLUOXETINE", "ATORVASTATIN CALCIUM", "KISQALI", "FOSAMAX", "VANCOMYCIN", "MONTELUKAST", "INSULIN", "UPTRAVI", "VENCLEXTA", "ESCITALOPRAM", "ORENITRAM", "DULOXETINE", "VALSARTAN", "ZOLOFT", "AIMOVIG", "LETROZOLE", "FLUCONAZOLE", "MELOXICAM", "BUTRANS", "LIDOCAINE", "TOCILIZUMAB", "CYCLOSPORINE", "XTANDI", "KESIMPTA", "TRASTUZUMAB", "MESALAMINE", "NORCO", "COUMADIN", "EPINEPHRINE", "RIBAVIRIN", "TOPIRAMATE", "TYVASO", "METRONIDAZOLE", "PRAVASTATIN", "MELATONIN", "ZOPICLONE", "CAPECITABINE", "DICLOFENAC SODIUM", "VENETOCLAX", "CABOMETYX", "TAXOTERE", "BUDESONIDE", "POTASSIUM", "DEXILANT", "KEPPRA", "BOTOX COSMETIC", "ZEJULA", "CLARITIN", "METOPROLOL SUCCINATE", "SEROQUEL", "FERROUS SULFATE", "MS CONTIN", "NORVASC", "CYCLOBENZAPRINE", "VELCADE", "ARIPIPRAZOLE", "LORATADINE", "JARDIANCE", "METOPROLOL TARTRATE", "RANITIDINE ORAL TABLET", "JANUVIA", "DOXYCYCLINE", "OMALIZUMAB", "AUBAGIO", "SULFAMETHOXAZOLE / TRIMETHOPRIM", "BACTRIM", "DILTIAZEM", "NEURONTIN", "LOSARTAN POTASSIUM", "CALCIUM CARBONATE", "ESBRIET", "LEXAPRO", "OXYGEN", "VITAMIN B COMPLEX", "LAMICTAL", "METOCLOPRAMIDE", "VOLTARENE", "ZOLPIDEM", "NEXPLANON", "PROPRANOLOL", "CELECOXIB", "BUPROPION", "ALEVE", "ADCIRCA", "AMIODARONE", "NITROGLYCERIN", "PHTHALYLSULFATHIAZOLE", "ADEMPAS", "CODEINE", "CLONIDINE", "WELLBUTRIN", "VIREAD", "HYDROCODONE", "DIANEAL LOW CALCIUM 1.5", "MAGNESIUM OXIDE", "OXYMORPHONE EXTENDED RELEASE ORAL TABLET _OPANA_", "CANDESARTAN", "ENTYVIO", "NOVOLOG", "ARANESP", "HEPARIN", "TREMFYA", "DIGOXIN", "ATIVAN", "FINASTERIDE", "AZITHROMYCIN", "FLONASE", "BOTOX", "LENVIMA", "AZITHROMYCIN ANHYDROUS", "MYRBETRIQ", "ALENDRONATE SODIUM", "ESTRADIOL", "NUCALA", "CARBAMAZEPINE", "COPAXONE", "CAVIAR, UNSPECIFIED", "HIZENTRA", "EYLEA", "MEPOLIZUMAB", "BREO ELLIPTA INSTITUTIONAL PACK", "PFIZER-BIONTECH COVID-19 VACCINE", "ADVIL", "HERCEPTIN", "ATRIPLA", "DIPHENHYDRAMINE HYDROCHLORIDE", "FLUTICASONE", "XGEVA", "OFEV", "NIFEDIPINE", "1 ML INVEGA SUSTENNA 156 MG/ML PREFILLED SYRINGE", "PREMARIN", "MEROPENEM", "AFINITOR", "PROZAC", "TRELEGY", "GLIPIZIDE", "QUETIAPINE FUMARATE", "BORTEZOMIB", "AMBIEN", "ENALAPRIL", "EMGALITY", "LOPERAMIDE", "CORTISONE", "ORGOVYX", "TALTZ", "LACTULOSE", "CLARITHROMYCIN", "METHADONE", "PEGASYS", "SENSIPAR", "ACETAMINOPHEN / OXYCODONE HYDROCHLORIDE PILL", "ATEZOLIZUMAB", "ADVATE", "ESOMEPRAZOLE", "SUTENT", "ROSUVASTATIN CALCIUM", "SOLU-MEDROL", "SILDENAFIL", "ACETAMINOPHEN / HYDROCODONE", "PAROXETINE", "HYDROXYZINE", "SERTRALINE HYDROCHLORIDE", "GLIMEPIRIDE", "TOPAMAX", "NORTHERA", "EZETIMIBE", "AMOXICILLIN / CLAVULANATE", "ERGOCALCIFEROL", "COPPER 313.4 MG INTRAUTERINE INTRAUTERINE DEVICE _PARAGARD T 380A_", "DIOVAN", "BASAGLAR", "FLUDARABINE", "CYANOCOBALAMIN", "ABATACEPT", "CELLCEPT", "CREON", "ZOMETA", "SALBUTAMOL", "BIOTIN", "PROACTIV MD KIT KIT", "VENLAFAXINE HYDROCHLORIDE", "MODERNA COVID-19 VACCINE", "ORIDONIN", "FLUTICASONE PROPIONATE", "ALLEGRA", "CORTISONE ACETATE", "DOXORUBICIN HYDROCHLORIDE", "KLONOPIN", "CEFTRIAXONE", "DURAGESIC", "PROGRAF", "REVATIO", "EFFEXOR", "VALPROIC ACID", "BISOPROLOL FUMARATE", "PROPOFOL", "LEVEMIR", "TORSEMIDE", "DAPAGLIFLOZIN", "BENLYSTA", "TASIGNA", "FENOFIBRATE", "IRBESARTAN", "PEMBROLIZUMAB", "LATANOPROST", "XELODA", "FLOMAX", "INGREZZA", "ILARIS", "VICTOZA", "IRINOTECAN", "LEVAQUIN", "PROBIOTIC", "YERVOY", "SPRAVATO", "EPIDIOLEX", "VITAMIN D NOS", "RIVAROXABAN", "FARXIGA", "CLOTRIMAZOLE", "PERINDOPRIL", "HYDROMORPHONE HYDROCHLORIDE", "LOVENOX", "ALENDRONIC ACID", "REBIF", "FILGRASTIM", "TRACLEER", "AZACITIDINE", "PROMETHAZINE", "TOPROL", "VYVANSE", "TOUJEO", "TADALAFIL", "INVOKANA", "VINCRISTINE SULFATE", "ENOXAPARIN", "HYDRALAZINE", "VITAMIN E", "MONTELUKAST SODIUM", "DEPAKOTE", "DARZALEX", "NIRAPARIB", "PROCHLORPERAZINE", "INVEGA", "MIDAZOLAM", "KEVZARA", "VIAGRA", "OPANA", "GLICLAZIDE", "TRIAMCINOLONE", "LEUCOVORIN", "OXBRYTA", "VORICONAZOLE", "IMURAN", "CLINDAMYCIN", "AMITRIPTYLINE HYDROCHLORIDE", "IMODIUM", "CHANTIX", "BUPRENORPHINE", "SPRYCEL", "PEPCID", "ZYTIGA", "PRALUENT", "DULOXETINE HYDROCHLORIDE", "VIVITROL", "MINOXIDIL", "TAMSULOSIN HYDROCHLORIDE", "VALIUM", "IPILIMUMAB", "METHYLPREDNISOLONE SODIUM SUCCINATE", "TRIAMCINOLONE ACETONIDE", "PERTUZUMAB", "COLACE", "ZOLEDRONIC ACID", "VOTRIENT", "TEMAZEPAM", "BENICAR", "TAGRISSO", "ETANERCEPT", "TIZANIDINE", "XYWAV", "RUXIENCE", "OXYMORPHONE HYDROCHLORIDE", "HALOPERIDOL", "LINZESS", "LITHIUM", "NYSTATIN", "SODIUM BICARBONATE", "WARFARIN SODIUM", "LUCENTIS", "NUCYNTA", "SODIUM VALPROATE", "COLCHICINE", "CLOBETASOL", "LINEZOLID", "CARFILZOMIB", "VALACYCLOVIR", "OXAZEPAM", "TYMLOS", "COVID-19 VACCINE", "DECADRON", "ATROVENT", "ALDACTONE", "POMALIDOMIDE", "TARCEVA", "VERAPAMIL", "COREG", "AUGMENTIN", "ZINC", "TRAZODONE HYDROCHLORIDE", "LAMIVUDINE", "SUBOXONE", "ANASTROZOLE", "VICODIN", "RYTARY", "PLAN B ONE-STEP", "EXTRANEAL", "ONDANSETRON HYDROCHLORIDE", "LATUDA", "TRESIBA", "CICLOSPORIN", "INLYTA", "PEMETREXED", "ZOCOR", "PROGESTERONE", "ZYPREXA", "INSULIN GLARGINE", "BRILINTA", "CEPHALEXIN", "VALTREX", "DARATUMUMAB", "MELPHALAN", "OXYBUTYNIN", "POLYETHYLENE GLYCOLS", "IFOSFAMIDE"
];

interface DrugRecommenderProps {
  patient: Patient;
}

export function DrugRecommender({ patient }: DrugRecommenderProps) {
  const [selectedDrugToRemove, setSelectedDrugToRemove] = useState<string>('');
  
  // Clinician's Sandbox State
  const [targetAlternatives, setTargetAlternatives] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SwapRecommendation[]>([]);

  const activeDrugs = patient.mainPrescriptions || [];

  // Handle clicking outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter available drugs (excluding what they currently take, and what is already in the sandbox)
  const filteredDrugs = ALL_DRUGS.filter(drug => 
    drug.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !activeDrugs.includes(drug) &&
    !targetAlternatives.includes(drug)
  );

  const handleAddTarget = (drug: string) => {
    setTargetAlternatives([...targetAlternatives, drug]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleRemoveTarget = (drug: string) => {
    setTargetAlternatives(targetAlternatives.filter(d => d !== drug));
  };

  const handleFindSwaps = async () => {
    if (!selectedDrugToRemove || targetAlternatives.length === 0) return;
    
    setIsLoading(true);
    try {
      // Pass the specific target array to the backend!
      const result = await fetchSwapRecommendations(patient, activeDrugs, selectedDrugToRemove, targetAlternatives);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (activeDrugs.length === 0) return null;

  return (
    <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6 h-fit mt-6 flex flex-col gap-6">
      <div>
        <h3 className="text-indigo-900 mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5" /> Targeted Risk Assessor
        </h3>
        <p className="text-sm text-indigo-700">
          Select a medication to replace, build a sandbox of clinical alternatives, and let the model rank their risk reductions.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Step 1: Drug to Remove */}
        <div>
          <label className="block text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-2">1. Drug to Replace</label>
          <select 
            className="w-full p-2 border border-indigo-200 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedDrugToRemove}
            onChange={(e) => setSelectedDrugToRemove(e.target.value)}
          >
            <option value="">Select active medication...</option>
            {activeDrugs.map(drug => (
              <option key={drug} value={drug}>{drug}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Build Alternative Sandbox */}
        <div>
          <label className="block text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-2">2. Clinician Alternatives</label>
          <div className="relative mb-3" ref={dropdownRef}>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-indigo-300" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 border border-indigo-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search to add safe clinical options..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onClick={() => setIsDropdownOpen(true)}
              />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredDrugs.length > 0 ? (
                  filteredDrugs.map(drug => (
                    <button
                      key={drug}
                      onClick={() => handleAddTarget(drug)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 transition-colors"
                    >
                      {drug}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">No medications found.</div>
                )}
              </div>
            )}
          </div>

          {/* Sandbox Pills */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {targetAlternatives.map(drug => (
              <span key={drug} className="flex items-center gap-1 bg-white text-indigo-700 px-3 py-1 rounded-full text-xs border border-indigo-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors group cursor-pointer shadow-sm" onClick={() => handleRemoveTarget(drug)}>
                {drug}
                <X className="w-3 h-3 text-indigo-300 group-hover:text-red-500" />
              </span>
            ))}
            {targetAlternatives.length === 0 && (
              <span className="text-xs text-indigo-400 italic">No alternatives selected yet.</span>
            )}
          </div>
        </div>
        
        {/* Step 3: Run Model */}
        <button 
          onClick={handleFindSwaps}
          disabled={!selectedDrugToRemove || targetAlternatives.length === 0 || isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Running Assessor...' : 'Rank Alternatives'}
        </button>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="mt-4 bg-white rounded-lg border border-indigo-200 overflow-hidden shadow-sm">
          <div className="bg-indigo-100/50 px-4 py-3 text-xs font-semibold text-indigo-800 border-b border-indigo-100 flex justify-between">
            <span>Ranked Clinical Options</span>
            <span>Predicted Risk</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recommendations.map((rec, index) => (
              <div key={rec.drug} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs font-mono w-4">#{index + 1}</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="line-through text-slate-400">{selectedDrugToRemove}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <span className="text-indigo-700">{rec.drug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-sm font-bold border border-emerald-100">
                  <TrendingDown className="w-4 h-4" />
                  {(rec.new_risk * 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
