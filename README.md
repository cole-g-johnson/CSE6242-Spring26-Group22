Overview of feature_engineer:
- Full dataset is loaded but a **subset of 50,000 samples** is used for testing the code
- Missing values will result in an "unknown" column. Ex: if NaN in wt_kg then there will be "wt_unknown" to specify that this info was not disclosed
- To deal with the high cardinality of rx_names and reactions, the top N values were selected based on frequency. The **top 550 drugs** and **top 300 reactions** cover the majority of occurrences in the dataset, capturing the most common items while keeping the feature space manageable. Less frequent items are recorded in "other_rx" and "other_reacs" to retain information about rare drugs or reactions without exploding the number of columns.
- Multi-hot encoding of the most frequent drugs and adverse reactions
- Aggregating multiple records per patient (caseid)

# Adverse Event Clinician Dashboard *(Describe the package in a few paragraphs)*
This repository contains the script tools to download the FAERS ASCII dataset, clean and encode the dataset, build XGBoost and counterfactual models, and finally visualize the result in a clinician dashboard.

The first script is used to download all the FAERS data from a user specified time frame. The script opts to download these files in an ASCII format over text since it cuts down on file size.  Subsequent scripts are then used to organize all the downloaded files and then merge them into seven main files. The next script then specifically selects the "drug" data frame and normalizes the drug names Via Rx Norm. It does this by looping through each drug, and then looking up this drugs' information via RX Norm API. This step reduces number of drugs from hundreds of thousands to tens of thousands. Please be advised that API lookups are rate limited, if the drug dataset is large (millions of rows) then this step may take several hours. ***(FILL IN INFORMATION ABOUT THE DEDUPLICATION SCRIPT HERE)***. Finally, there is a cleaning step on specific columns to normalize data and then all required fields across the seven data frames are joined together. This data frame can then be used for exploratory analysis and feature engineering.

***DATA EXPLORATION DESCRIPTION***

***DATA ENGINEERING DESCRIPTION***

***MODEL BUILDING DESCRIPTION***

***COUNTERFACTUAL DESCRIPTION***

***DASHBOARD DESCRIPTION***

## INSTALLATION *- How to install and setup your code*
Simply download or fork this repository, and run scripts below. Specific scripts were written on either local, Kaggle, or Microsoft Azure. Each script will be labeled accordingly. As this is a large dataset it's recommended to use an Azure VM for model building and feature engineering. Please see the following [link](https://learn.microsoft.com/en-us/azure/machine-learning/tutorial-azure-ml-in-a-day?view=azureml-api-2) for a guide on how to set up Azure machine learning.

## EXECUTION *- How to run a demo on your code*
- **FAERS_downloading.py:**  
     Downloads FAERS datasets from Q4 2012 - Q4 2025. Years and quarter range may be adjusted here as needed to get more, less, or more recent data. The base URL for downloading is also included and can be changed if the FDA changes the location of these files. It is not recommended to go earlier than Q4 2012 as the formatting was different and may cause issues with this script and others. Also, you are able to change the output directory. This was run locally.
- **FAERS_Organize.py:**  
     Organizes all the ASCII files downloaded from the FEARS dataset into sub folders. Able to change the input directory if your FAERS ACSII files are not in the same place. This was run locally.
- **FAERS_merge.ipynb:**  
  This script takes all the organized folders and merges into a final seven files ("demo", "drug", "indi", "outc", "reac", "rpsr", "ther"). There are fields to adjust input path, export path, fields, years and quarters. This was run on Kaggle.
- **FAERS_drug_normalize.py:**  
     The FAERS dataset consists of many hundreds of thousands of drug names. To have better model performance, we use this script to get common names for all the drugs in the dataset. There are fields to change data input, output, and RX Norm location. This was run locally.
- **FAERS-cleanup.ipynb:**  
  This notebook contains the steps required to clean many of the useful fields across the seven FEARS datasets. This script cleans/standardizes the "dose_unit", "route", "dose_vmb", "dose_form", and "cum_dose_unit" fields. It then creates a binary field for sex, standardizes ages and weights, and removes unplausible ages and weights. Finally, the tables are merged together to have a final data frame with fields: 'primaryid', 'caseid', 'role_cod', 'rx_name', 'dose_amt', 'dose_unit', 'dose_form', 'sex', 'sex_bin', 'age_years', 'wt_kg', 'outcome_death', 'outcome_life_threatening', 'outcome_hospitalisation', 'outcome_disability', 'outcome_congenital_anomaly', 'outcome_intervention_required', 'outcome_other_serious', 'reactions'. Edits can be made to include or exclude fields. The deduplication script must be run before this. This was run on Kaggle. 
