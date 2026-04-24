import { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, X, Search } from 'lucide-react';
import { Patient } from '../../utils/csvParser';
import { fetchDynamicCounterfactual, APIResponse } from '../../utils/api';

// Paste your 550 drugs from the notebook here!
const ALL_DRUGS = [
  "ZANTAC", "HUMIRA", "PREDNISONE", "INFLECTRA", "REVLIMID", "METHOTREXATE", "RANITIDINE", "DUPIXENT", "ENBREL", "ASPIRIN", "DEXAMETHASONE", "OMEPRAZOLE", "XARELTO", "RITUXIMAB", "ACETAMINOPHEN", "GABAPENTIN", "COSENTYX", "METFORMIN", "FOLIC ACID", "XOLAIR", "VEDOLIZUMAB", "ACTEMRA", "MOUNJARO", "AMLODIPINE", "FUROSEMIDE", "LYRICA", "ATORVASTATIN", "LISINOPRIL", "PREDNISOLONE", "PANTOPRAZOLE", "AVONEX", "LEVOTHYROXINE", "REMICADE", "ELIQUIS", "NEXIUM", "XYREM", "XELJANZ", "ORENCIA", "IBUPROFEN", "REPATHA", "METOPROLOL", "SULFASALAZINE", "VITAMIN D3", "CYCLOPHOSPHAMIDE", "VITAMIN D", "SIMVASTATIN", "TYLENOL", "OTEZLA", "TECFIDERA", "OXYCONTIN", "TEDUGLUTIDE", "ADAPALENE 0.1 G IN 100 G TOPICAL GEL _PROACTIV MD ADAPALENE ACNE TREATMENT_", "TACROLIMUS", "SYNTHROID", "IBRANCE", "ALLOPURINOL", "RISPERDAL", "METHYLPREDNISOLONE", "HYDROCHLOROTHIAZIDE", "TYSABRI", "CIMZIA", "PROLIA", "ENTRESTO", "RANITIDINE HYDROCHLORIDE", "CALCIUM", "STELARA", "INFLIXIMAB", "HYDROXYCHLOROQUINE", "TRAMADOL", "ZEPBOUND", "POMALYST", "ALBUTEROL", "LORAZEPAM", "LIPITOR", "CARBOPLATIN", "ONDANSETRON", "PRILOSEC", "ACYCLOVIR", "PREVACID", "TOFACITINIB EXTENDED RELEASE ORAL TABLET _XELJANZ_", "RAMIPRIL", "LOSARTAN", "LEFLUNOMIDE", "VITAMIN B12", "HUMALOG", "SIMPONI", "OXYCODONE", "CYMBALTA", "JAKAFI", "CLONAZEPAM", "BISOPROLOL", "LASIX", "NEULASTA", "ALBUTEROL SULFATE", "ELIGARD", "OXYCODONE HYDROCHLORIDE", "MYCOPHENOLATE MOFETIL", "SERTRALINE", "NUPLAZID", "SPIRIVA", "SPIRONOLACTONE", "TRULICITY", "LANSOPRAZOLE", "SYMBICORT", "PROTONIX", "ADVAIR", "ALPRAZOLAM", "SODIUM CHLORIDE", "POTASSIUM CHLORIDE", "ACETAMINOPHEN / HYDROCODONE BITARTRATE PILL", "GILENYA", "LANTUS", "DIPHENHYDRAMINE", "FENTANYL", "CETIRIZINE HYDROCHLORIDE", "IMBRUVICA", "DOCETAXEL", "HYDROCORTISONE", "CARVEDILOL", "MIRENA", "HYDROXYCHLOROQUINE SULFATE", "PACLITAXEL", "SKYRIZI", "PREGABALIN", "QUETIAPINE", "NAPROXEN", "DIANEAL LOW CALCIUM PERITONEAL DIALYSIS SOLUTION WITH DEXTROSE", "BACLOFEN", "ZYRTEC", "ATENOLOL", "WARFARIN", "OCREVUS", "TRAZODONE", "SINGULAIR", "RISPERIDONE", "LEVETIRACETAM", "FORTEO", "CITALOPRAM", "ROSUVASTATIN", "CLOPIDOGREL", "CELEBREX", "MAGNESIUM", "AMPYRA", "PERCOCET", "REMODULIN", "KEYTRUDA", "MORPHINE SULFATE", "FLUOROURACIL", "CLOZAPINE", "DIAZEPAM", "CARBIDOPA / LEVODOPA", "PANTOPRAZOLE SODIUM", "RINVOQ", "CHOLECALCIFEROL", "ARAVA", "AZATHIOPRINE", "AMOXICILLIN", "LENALIDOMIDE", "OXALIPLATIN", "VINCRISTINE", "NIVOLUMAB", "PLAVIX", "ETOPOSIDE", "LETAIRIS", "FISH OILS", "DILAUDID", "TRUVADA", "OLANZAPINE", "PLAQUENIL", "LEVOTHYROXINE SODIUM", "ABILIFY", "AMITRIPTYLINE", "CIPROFLOXACIN", "ZOFRAN", "DOXORUBICIN", "BENADRYL", "SOLIRIS", "CLOZARIL", "DESOXIMETASONE", "MIRALAX", "CISPLATIN", "XANAX", "MIRTAZAPINE", "MORPHINE", "LAMOTRIGINE", "METFORMIN HYDROCHLORIDE", "FAMOTIDINE", "OPSUMIT", "RANITIDINE ORAL CAPSULE", "GENOTROPIN", "CYTARABINE", "OPDIVO", "LEVOFLOXACIN", "TAMSULOSIN", "RITUXAN", "ADALIMUMAB", "VENTOLIN", "HYDROMORPHONE", "METHOTREXATE SODIUM", "DICLOFENAC", "AVANDIA", "APIXABAN", "AMLODIPINE BESYLATE", "BEVACIZUMAB", "AVASTIN", "OZEMPIC", "IMMUNOGLOBULIN G, HUMAN", "TRAMADOL HYDROCHLORIDE", "IRON", "PRADAXA", "CERTOLIZUMAB PEGOL", "AMBRISENTAN", "CETIRIZINE", "VENLAFAXINE", "FLUOXETINE", "ATORVASTATIN CALCIUM", "KISQALI", "FOSAMAX", "VANCOMYCIN", "MONTELUKAST", "INSULIN", "UPTRAVI", "VENCLEXTA", "ESCITALOPRAM", "ORENITRAM", "DULOXETINE", "VALSARTAN", "ZOLOFT", "AIMOVIG", "LETROZOLE", "FLUCONAZOLE", "MELOXICAM", "BUTRANS", "LIDOCAINE", "TOCILIZUMAB", "CYCLOSPORINE", "XTANDI", "KESIMPTA", "TRASTUZUMAB", "MESALAMINE", "NORCO", "COUMADIN", "EPINEPHRINE", "RIBAVIRIN", "TOPIRAMATE", "TYVASO", "METRONIDAZOLE", "PRAVASTATIN", "MELATONIN", "ZOPICLONE", "CAPECITABINE", "DICLOFENAC SODIUM", "VENETOCLAX", "CABOMETYX", "TAXOTERE", "BUDESONIDE", "POTASSIUM", "DEXILANT", "KEPPRA", "BOTOX COSMETIC", "ZEJULA", "CLARITIN", "METOPROLOL SUCCINATE", "SEROQUEL", "FERROUS SULFATE", "MS CONTIN", "NORVASC", "CYCLOBENZAPRINE", "VELCADE", "ARIPIPRAZOLE", "LORATADINE", "JARDIANCE", "METOPROLOL TARTRATE", "RANITIDINE ORAL TABLET", "JANUVIA", "DOXYCYCLINE", "OMALIZUMAB", "AUBAGIO", "SULFAMETHOXAZOLE / TRIMETHOPRIM", "BACTRIM", "DILTIAZEM", "NEURONTIN", "LOSARTAN POTASSIUM", "CALCIUM CARBONATE", "ESBRIET", "LEXAPRO", "OXYGEN", "VITAMIN B COMPLEX", "LAMICTAL", "METOCLOPRAMIDE", "VOLTARENE", "ZOLPIDEM", "NEXPLANON", "PROPRANOLOL", "CELECOXIB", "BUPROPION", "ALEVE", "ADCIRCA", "AMIODARONE", "NITROGLYCERIN", "PHTHALYLSULFATHIAZOLE", "ADEMPAS", "CODEINE", "CLONIDINE", "WELLBUTRIN", "VIREAD", "HYDROCODONE", "DIANEAL LOW CALCIUM 1.5", "MAGNESIUM OXIDE", "OXYMORPHONE EXTENDED RELEASE ORAL TABLET _OPANA_", "CANDESARTAN", "ENTYVIO", "NOVOLOG", "ARANESP", "HEPARIN", "TREMFYA", "DIGOXIN", "ATIVAN", "FINASTERIDE", "AZITHROMYCIN", "FLONASE", "BOTOX", "LENVIMA", "AZITHROMYCIN ANHYDROUS", "MYRBETRIQ", "ALENDRONATE SODIUM", "ESTRADIOL", "NUCALA", "CARBAMAZEPINE", "COPAXONE", "CAVIAR, UNSPECIFIED", "HIZENTRA", "EYLEA", "MEPOLIZUMAB", "BREO ELLIPTA INSTITUTIONAL PACK", "PFIZER-BIONTECH COVID-19 VACCINE", "ADVIL", "HERCEPTIN", "ATRIPLA", "DIPHENHYDRAMINE HYDROCHLORIDE", "FLUTICASONE", "XGEVA", "OFEV", "NIFEDIPINE", "1 ML INVEGA SUSTENNA 156 MG/ML PREFILLED SYRINGE", "PREMARIN", "MEROPENEM", "AFINITOR", "PROZAC", "TRELEGY", "GLIPIZIDE", "QUETIAPINE FUMARATE", "BORTEZOMIB", "AMBIEN", "ENALAPRIL", "EMGALITY", "LOPERAMIDE", "CORTISONE", "ORGOVYX", "TALTZ", "LACTULOSE", "CLARITHROMYCIN", "METHADONE", "PEGASYS", "SENSIPAR", "ACETAMINOPHEN / OXYCODONE HYDROCHLORIDE PILL", "ATEZOLIZUMAB", "ADVATE", "ESOMEPRAZOLE", "SUTENT", "ROSUVASTATIN CALCIUM", "SOLU-MEDROL", "SILDENAFIL", "ACETAMINOPHEN / HYDROCODONE", "PAROXETINE", "HYDROXYZINE", "SERTRALINE HYDROCHLORIDE", "GLIMEPIRIDE", "TOPAMAX", "NORTHERA", "EZETIMIBE", "AMOXICILLIN / CLAVULANATE", "ERGOCALCIFEROL", "COPPER 313.4 MG INTRAUTERINE INTRAUTERINE DEVICE _PARAGARD T 380A_", "DIOVAN", "BASAGLAR", "FLUDARABINE", "CYANOCOBALAMIN", "ABATACEPT", "CELLCEPT", "CREON", "ZOMETA", "SALBUTAMOL", "BIOTIN", "PROACTIV MD KIT KIT", "VENLAFAXINE HYDROCHLORIDE", "MODERNA COVID-19 VACCINE", "ORIDONIN", "FLUTICASONE PROPIONATE", "ALLEGRA", "CORTISONE ACETATE", "DOXORUBICIN HYDROCHLORIDE", "KLONOPIN", "CEFTRIAXONE", "DURAGESIC", "PROGRAF", "REVATIO", "EFFEXOR", "VALPROIC ACID", "BISOPROLOL FUMARATE", "PROPOFOL", "LEVEMIR", "TORSEMIDE", "DAPAGLIFLOZIN", "BENLYSTA", "TASIGNA", "FENOFIBRATE", "IRBESARTAN", "PEMBROLIZUMAB", "LATANOPROST", "XELODA", "FLOMAX", "INGREZZA", "ILARIS", "VICTOZA", "IRINOTECAN", "LEVAQUIN", "PROBIOTIC", "YERVOY", "SPRAVATO", "EPIDIOLEX", "VITAMIN D NOS", "RIVAROXABAN", "FARXIGA", "CLOTRIMAZOLE", "PERINDOPRIL", "HYDROMORPHONE HYDROCHLORIDE", "LOVENOX", "ALENDRONIC ACID", "REBIF", "FILGRASTIM", "TRACLEER", "AZACITIDINE", "PROMETHAZINE", "TOPROL", "VYVANSE", "TOUJEO", "TADALAFIL", "INVOKANA", "VINCRISTINE SULFATE", "ENOXAPARIN", "HYDRALAZINE", "VITAMIN E", "MONTELUKAST SODIUM", "DEPAKOTE", "DARZALEX", "NIRAPARIB", "PROCHLORPERAZINE", "INVEGA", "MIDAZOLAM", "KEVZARA", "VIAGRA", "OPANA", "GLICLAZIDE", "TRIAMCINOLONE", "LEUCOVORIN", "OXBRYTA", "VORICONAZOLE", "IMURAN", "CLINDAMYCIN", "AMITRIPTYLINE HYDROCHLORIDE", "IMODIUM", "CHANTIX", "BUPRENORPHINE", "SPRYCEL", "PEPCID", "ZYTIGA", "PRALUENT", "DULOXETINE HYDROCHLORIDE", "VIVITROL", "MINOXIDIL", "TAMSULOSIN HYDROCHLORIDE", "VALIUM", "IPILIMUMAB", "METHYLPREDNISOLONE SODIUM SUCCINATE", "TRIAMCINOLONE ACETONIDE", "PERTUZUMAB", "COLACE", "ZOLEDRONIC ACID", "VOTRIENT", "TEMAZEPAM", "BENICAR", "TAGRISSO", "ETANERCEPT", "TIZANIDINE", "XYWAV", "RUXIENCE", "OXYMORPHONE HYDROCHLORIDE", "HALOPERIDOL", "LINZESS", "LITHIUM", "NYSTATIN", "SODIUM BICARBONATE", "WARFARIN SODIUM", "LUCENTIS", "NUCYNTA", "SODIUM VALPROATE", "COLCHICINE", "CLOBETASOL", "LINEZOLID", "CARFILZOMIB", "VALACYCLOVIR", "OXAZEPAM", "TYMLOS", "COVID-19 VACCINE", "DECADRON", "ATROVENT", "ALDACTONE", "POMALIDOMIDE", "TARCEVA", "VERAPAMIL", "COREG", "AUGMENTIN", "ZINC", "TRAZODONE HYDROCHLORIDE", "LAMIVUDINE", "SUBOXONE", "ANASTROZOLE", "VICODIN", "RYTARY", "PLAN B ONE-STEP", "EXTRANEAL", "ONDANSETRON HYDROCHLORIDE", "LATUDA", "TRESIBA", "CICLOSPORIN", "INLYTA", "PEMETREXED", "ZOCOR", "PROGESTERONE", "ZYPREXA", "INSULIN GLARGINE", "BRILINTA", "CEPHALEXIN", "VALTREX", "DARATUMUMAB", "MELPHALAN", "OXYBUTYNIN", "POLYETHYLENE GLYCOLS", "IFOSFAMIDE"
];

interface DrugSwapPanelProps {
  patient: Patient;
}

export function DrugSwapPanel({ patient }: DrugSwapPanelProps) {
  // Active state
  const [activeDrugs, setActiveDrugs] = useState<string[]>([]);
  
  // NEW: Searchable Dropdown State
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // API state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<APIResponse | null>(null);

  // Reset panel on new patient
  useEffect(() => {
    setActiveDrugs(patient.mainPrescriptions || []);
    setSimulationResult(null);
    setSearchTerm('');
  }, [patient]);

  // NEW: Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // NEW: Filter drugs based on search (and remove ones already active)
  const filteredDrugs = ALL_DRUGS.filter(drug => 
    drug.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !activeDrugs.includes(drug)
  );

  // Handle adding a drug directly from the search list
  const handleAddDrug = (drugToAdd: string) => {
    if (!activeDrugs.includes(drugToAdd)) {
      setActiveDrugs([...activeDrugs, drugToAdd]);
      setSearchTerm(''); // Clear search bar
      setIsDropdownOpen(false); // Close dropdown
    }
  };

  const handleRemoveDrug = (drugToRemove: string) => {
    setActiveDrugs(activeDrugs.filter(d => d !== drugToRemove));
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const result = await fetchDynamicCounterfactual(patient, activeDrugs);
      setSimulationResult(result);
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Failed to run simulation. Check console.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-teal-50 rounded-lg border border-teal-200 p-6 h-fit flex flex-col gap-6">
      <div>
        <h3 className="text-teal-900 mb-2">Dynamic Simulator</h3>
        <p className="text-sm text-teal-700">
          Modify the patient's prescription list and run a counterfactual simulation.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200">
        
        {/* NEW: Searchable Dropdown UI */}
        <div className="relative mb-4" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search to add medication..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onClick={() => setIsDropdownOpen(true)}
            />
          </div>

          {/* The Popup List */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.map(drug => (
                  <button
                    key={drug}
                    onClick={() => handleAddDrug(drug)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                  >
                    {drug}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  No matching medications found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Drug Badges */}
        <div className="flex flex-wrap gap-2">
          {activeDrugs.map(drug => (
            <span key={drug} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors group cursor-pointer" onClick={() => handleRemoveDrug(drug)}>
              {drug}
              <X className="w-3 h-3 text-slate-400 group-hover:text-red-500" />
            </span>
          ))}
          {activeDrugs.length === 0 && (
            <span className="text-sm text-slate-400">No active medications.</span>
          )}
        </div>
      </div>

      <button 
        onClick={handleSimulate}
        disabled={isSimulating}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
      >
        {isSimulating ? 'Running XGBoost Model...' : 'Calculate New Risk'}
      </button>

      {/* Results UI */}
      {simulationResult && (
        <div className={`p-5 rounded-lg border ${simulationResult.new_class === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <h4 className="text-sm font-semibold mb-3">Simulation Results</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Original Risk:</span>
            <span className="font-medium">{patient.riskScore}%</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-600">New Risk:</span>
            <span className="font-bold text-lg">{(simulationResult.new_risk_probability * 100).toFixed(2)}%</span>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-slate-200/50">
             {simulationResult.new_class === 'CRITICAL' ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
             <span className={`font-semibold ${simulationResult.new_class === 'CRITICAL' ? 'text-red-700' : 'text-emerald-700'}`}>
               Predicted Class: {simulationResult.new_class}
             </span>
          </div>
        </div>
      )}
    </div>
  );
}
