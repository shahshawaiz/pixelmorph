import logging
import traceback
import random

import pandas as pd
from backend.app.core.services.ml.churn import ChurnAnalysisSession

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to datasets
TEST_CASES = [
    'core/assets/datasets/bank/Bank_Churn_Data.csv',
    'core/assets/datasets/ecom/churn_data.csv',
    'core/assets/datasets/telco/Telco-Customer-Churn.csv'
]

# Dataset-specific configurations
DATASET_CONFIG = {
    'bank': {
        'id_column': 'CustomerId',
        'name_column': None,  # No name column for this dataset
        'target_column': 'Exited',
        'feature_columns': ['CreditScore', 'Geography', 'Gender', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'HasCrCard', 'IsActiveMember', 'EstimatedSalary'],
        'model_type': 'logistic_regression'
    },
    'ecom': {
        'id_column': 'customerID',
        'name_column': None,  # No name column for this dataset
        'target_column': 'Churn',
        'feature_columns': ['tenure', 'PhoneService', 'Contract', 'PaperlessBilling', 'PaymentMethod', 'MonthlyCharges', 'TotalCharges'],
        'model_type': 'random_forest'
    },
    'telco': {
        'id_column': 'customerID',
        'name_column': None,  # No name column for this dataset
        'target_column': 'Churn',
        'feature_columns': ['gender', 'SeniorCitizen', 'tenure', 'MonthlyCharges', 'TotalCharges', 'Contract', 'InternetService'],
        'model_type': 'logistic_regression'
    }
}

# Process each test case
for dataset_path in TEST_CASES:
    try:
        # Determine dataset type
        dataset_type = None
        if 'bank' in dataset_path:
            dataset_type = 'bank'
        elif 'ecom' in dataset_path:
            dataset_type = 'ecom'
        elif 'telco' in dataset_path:
            dataset_type = 'telco'
        else:
            logger.error("Unknown dataset type for path: %s", dataset_path)
            continue

        logger.info("Processing dataset: %s", dataset_path)

        # Load dataset
        data = pd.read_csv(dataset_path)

        # Get configuration
        config = DATASET_CONFIG.get(dataset_type)
        if not config:
            logger.error("No configuration found for dataset type: %s", dataset_type)
            continue
        
        # step 1: initialize the model
        model = ChurnAnalysisSession(
            model_type=config['model_type']
        )

        # step 2: configure columns
        model.configure_model(data, config)

        # step 3: preprocess data
        X_train, X_test, y_train, y_test = model.preprocess_data(data)

        # step 4: train the model
        model.train(X_train, y_train)

        # step 5: evaluate the model
        accuracy, conf_matrix = model.evaluate(X_test, y_test)
        logger.info("Accuracy for %s: %.2f", dataset_type, accuracy)
        logger.info("Confusion Matrix for %s:\n%s", dataset_type, conf_matrix)

        # step 6: make predictions
        churn_predictions, churn_groups = model.predict(model.model, X_test)
        # model._print_churn_group_summary(churn_groups)        

    except Exception as e:
        traceback.print_exc()
        logger.error("Error processing dataset %s: %s", dataset_path, str(e))
