import { useState, useEffect } from 'react';
import { TrendingDown, AlertCircle, CheckCircle, X, Plus } from 'lucide-react';
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
  // State for the drugs currently being simulated
  const [activeDrugs, setActiveDrugs] = useState<string[]>([]);
  const [selectedDropdownDrug, setSelectedDropdownDrug] = useState<string>('');
  
  // State for the API
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<APIResponse | null>(null);

  // Reset the panel whenever a new patient is clicked
  useEffect(() => {
    setActiveDrugs(patient.mainPrescriptions || []);
    setSimulationResult(null);
  }, [patient]);

  // Handle adding a drug from the dropdown
  const handleAddDrug = () => {
    if (selectedDropdownDrug && !activeDrugs.includes(selectedDropdownDrug)) {
      setActiveDrugs([...activeDrugs, selectedDropdownDrug]);
      setSelectedDropdownDrug('');
    }
  };

  // Handle removing a drug
  const handleRemoveDrug = (drugToRemove: string) => {
    setActiveDrugs(activeDrugs.filter(d => d !== drugToRemove));
  };

  // Trigger the API Call
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

      {/* Drug Selection UI */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex gap-2 mb-4">
          <select 
            className="flex-1 p-2 border rounded text-sm"
            value={selectedDropdownDrug}
            onChange={(e) => setSelectedDropdownDrug(e.target.value)}
          >
            <option value="">Select a drug to add...</option>
            {ALL_DRUGS.map(drug => (
              <option key={drug} value={drug} disabled={activeDrugs.includes(drug)}>
                {drug}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddDrug}
            disabled={!selectedDropdownDrug}
            className="bg-slate-800 text-white p-2 rounded disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Current Drug Badges */}
        <div className="flex flex-wrap gap-2">
          {activeDrugs.map(drug => (
            <span key={drug} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs border border-slate-200">
              {drug}
              <button onClick={() => handleRemoveDrug(drug)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {activeDrugs.length === 0 && (
            <span className="text-sm text-slate-400">No active medications.</span>
          )}
        </div>
      </div>

      {/* Simulate Button */}
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
