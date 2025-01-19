import traceback
import json

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest

from core.services.config import Config

class ChurnAnalysisSession:
    def __init__(self, config: Config, columns=[], model_type='random_forest'):
        """
        Initialize the Predictive Model.

        :param model_type: Type of model to use ('random_forest', 'logistic_regression').
        """
        self.config = config
        self.model_type = model_type
        self.is_trained = False
        self.dataset = None
        self.columns = columns
        self.feature_columns = None        
        self.target_column = None
        self.id_column = None
        self.name_column = None

    def configure_model(self, dataset, config):
        """
        Configures columns for the model based on the provided dataset and configuration.

        :param dataset: Pandas DataFrame containing the dataset.
        :param config: Dictionary containing column configuration with keys:
                       - 'id_column': Unique identifier column (optional).
                       - 'name_column': Label column (optional).
                       - 'target_column': Target column for the model.
                       - 'feature_columns': List of feature columns (optional).
        """
        # Validate and set columns
        
        if 'feature_columns' in config:
            self.feature_columns = config.get('feature_columns')
        if 'target_column' in config:
            self.target_column = config['target_column']
        if 'id_column' in config:
            self.id_column = config['id_column']
        if 'name_column' in config:
            # check if name column is None, if so, then use id column
            if config['name_column'] is not None:
                self.name_column = config['name_column']
            else:
                self.name_column = config['id_column']
        if 'model_type' in config:
            self.model_type = config['model_type']

    def get_config(self):
        return {
            'model_type': self.model_type,
            'target_column': self.target_column,
            'feature_columns': self.feature_columns,
            'id_column': self.id_column,
            'name_column': self.name_column
        }
    
    def preprocess_data(self, dataset):
        """
        Splits the dataset into features and target, and further into training and testing sets.
        Automatically encodes categorical columns into numeric values.

        :param dataset: Pandas DataFrame containing the dataset.
        :return: Tuple of training and testing sets (X_train, X_test, y_train, y_test).
        """
        if self.feature_columns is None or self.target_column is None:
            raise ValueError("Columns are not configured. Please call 'configure_model' first.")

        X = dataset[self.feature_columns]
        y = dataset[self.target_column]
             
        # Handle categorical columns
        categorical_cols = X.select_dtypes(include=['object']).columns
        if not categorical_cols.empty:
            X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)

        # add customerId column to X if id_column is not None
        if self.id_column is not None:
            X[self.id_column] = dataset[self.id_column]

        # copy for full dataset
        self.dataset = X

        return train_test_split(X, y, test_size=0.2, random_state=42)

    def _preprocess_data_for_train_infer(self, dataset):
        # remove id_column and name_column from dataset
        non_feature_columns = [self.id_column, self.name_column, self.target_column]

        # 
        for col in non_feature_columns:
            if col in dataset.columns:
                dataset = dataset.drop(columns=[col])
        return dataset
    
    def _sanitize_labels(self, labels):
        """
        Ensures the labels are consistent, valid, and free of invalid values.

        :param labels: List or array of labels (y_test or y_pred).
        :return: Cleaned and sanitized labels.
        """
        # Convert labels to pandas Series for processing
        labels = pd.Series(labels)

        # Remove NaN or invalid values
        labels = labels.dropna()

        # Ensure all labels are strings for consistency
        labels = labels.astype(str)

        # Convert back to a list or numpy array
        return labels.tolist()
    
    def train(self, X_train, y_train):
        """
        Trains the model using the provided training data.

        :param X_train: Training features.
        :param y_train: Training target values.
        """

        # remove id_column from X_train
        X_train = self._preprocess_data_for_train_infer(X_train)

        # set model
        if self.model_type == 'random_forest':
            self.model = RandomForestClassifier(random_state=42)
        elif self.model_type == 'logistic_regression':
            self.model = LogisticRegression(random_state=42, max_iter=1000)
        else:
            raise ValueError("Invalid model_type. Choose from 'random_forest' or 'logistic_regression'.")

        # git model
        self.model.fit(X_train, y_train)
        
        # update is_trained
        self.is_trained = True
            

    def evaluate(self, X_test, y_test):
        """
        Evaluates the model on the test data and returns accuracy and confusion matrix.

        :param X_test: Testing features.
        :param y_test: Testing target values.
        :return: Tuple containing accuracy score and confusion matrix.
        """
        if not self.is_trained:
            raise ValueError("The model is not trained. Please call the 'train' method first.")

        # Preprocess X_test for inference
        X_test = self._preprocess_data_for_train_infer(X_test)

        # Ensure consistent length between X_test and y_test
        if len(X_test) != len(y_test):
            raise ValueError(f"Mismatch in lengths: X_test ({len(X_test)}), y_test ({len(y_test)})")

        # Generate predictions
        y_pred = self.model.predict(X_test)

        # Combine y_test and y_pred into a DataFrame for easier handling
        results_df = pd.DataFrame({'y_test': y_test, 'y_pred': y_pred})

        # Drop rows with missing values
        results_df = results_df.dropna()

        # Extract cleaned y_test and y_pred
        y_test_cleaned = results_df['y_test'].astype(str).tolist()
        y_pred_cleaned = results_df['y_pred'].astype(str).tolist()

        # Calculate metrics
        try:
            accuracy = accuracy_score(y_test_cleaned, y_pred_cleaned)
            conf_matrix = confusion_matrix(y_test_cleaned, y_pred_cleaned)
        except Exception as e:
            raise ValueError(f"Error during metric computation: {e}")

        return accuracy, conf_matrix

    def get_customer_labels(self):
        """
        Returns a list of customer labels (IDs or names) for the dataset.
        """
        if self.id_column is not None:
            return self.dataset[self.id_column].values
        elif self.name_column is not None:
            # cocnatenate id_column and name_column
            return self.dataset[self.id_column].astype(str) + ' - ' + self.dataset[self.name_column].astype(str)
        else:
            return None

    def get_churn_analysis(self):
        """
        Run the full dataset through the trained model.
        """
        if not self.is_trained:
            raise ValueError("The model is not trained. Please call the 'train' method first.")

        return self.predict(self.model, self.dataset)
        
    def predict(self, model, new_data):
        """
        Predicts target values for new data and provides feature insights.

        :param model: The trained model.
        :param new_data: Pandas DataFrame containing new data (features only).
        :return: Dictionary with predictions, churn groups, and feature insights.
        """
        if not self.is_trained:
            raise ValueError("The model is not trained. Please call the 'train' method first.")

        # eda
        insights = self.generate_data_insights(new_data)

        # Save customer IDs if id_column is available
        customer_ids = self.get_customer_labels()
            
        # remove non features
        new_data = self._preprocess_data_for_train_infer(new_data)

        # Handle categorical columns in new data
        categorical_cols = new_data.select_dtypes(include=['object']).columns
        if not categorical_cols.empty:
            new_data = pd.get_dummies(new_data, columns=categorical_cols, drop_first=True)

        # Make predictions
        churn_predictions = model.predict(new_data)
        churn_probabilities = (
            model.predict_proba(new_data)[:, 1]
            if hasattr(self.model, "predict_proba")
            else None
        )

        # Extract feature importance if available
        feature_importance_df = None
        if hasattr(self.model, "feature_importances_"):
            feature_importance_df = pd.DataFrame({
                "Feature": new_data.columns,
                "Importance": self.model.feature_importances_
        }).sort_values(by="Importance", ascending=False).reset_index(drop=True)

        # create churn groups
        churn_groups = self._assign_churn_group(customer_ids, churn_probabilities)

        # Include insights in the output
        result = {
            "model_type": self.model_type,
            "churn_predictions": churn_predictions.tolist(),
            "churn_groups": churn_groups,
            "insights": insights,
            "feature_insights": feature_importance_df.to_dict(orient="records")
            if feature_importance_df is not None
            else "Feature importance is not supported for this model."
        }

        return result

    def generate_data_insights(self, dataset):
        """
        Generate insights for any CSV dataset, including outliers, clusters, and feature relationships.
        All return values are Python native datatypes for JSON serialization compatibility.

        :param dataset: Pandas DataFrame containing the dataset.
        :return: Dictionary with insights about the data using Python native data types.
        """
        insights = {}

        # Convert to Python-native types utility
        def to_native(obj):
            if isinstance(obj, (pd.Series, pd.DataFrame)):
                return obj.to_dict(orient='records') if isinstance(obj, pd.DataFrame) else obj.tolist()
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, np.generic):  # Handles numpy scalar types
                return obj.item()
            elif isinstance(obj, dict):
                return {str(k): to_native(v) for k, v in obj.items()}  # Convert all keys to strings
            elif isinstance(obj, (list, tuple)):
                return [to_native(item) for item in obj]
            elif pd.isna(obj):  # Handle NaN/None values
                return None
            return obj

        # 1. Outliers Detection
        numeric_cols = dataset.select_dtypes(include=['int64', 'float64'])
        if not numeric_cols.empty:
            isolation_forest = IsolationForest(contamination=0.05, random_state=42)
            numeric_outliers = isolation_forest.fit_predict(numeric_cols)
            outlier_count = int((numeric_outliers == -1).sum())
            insights['outliers'] = {
                "total_outliers": outlier_count,
                "percentage_outliers": float(round(outlier_count / len(dataset) * 100, 2))
            }

        # 2. Feature Relationships
        if numeric_cols.shape[1] > 1:
            corr_matrix = numeric_cols.corr()
            strong_relationships = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i + 1, len(corr_matrix.columns)):
                    correlation = corr_matrix.iloc[i, j]
                    if abs(correlation) > 0.7:
                        strong_relationships.append({
                            "Feature1": str(corr_matrix.columns[i]),
                            "Feature2": str(corr_matrix.columns[j]),
                            "Correlation": float(correlation)
                        })
            insights['strong_relationships'] = strong_relationships

        # 3. Data Clusters
        if numeric_cols.shape[1] > 1 and len(dataset) >= 10:
            kmeans = KMeans(n_clusters=3, random_state=42)
            clusters = kmeans.fit_predict(numeric_cols)
            cluster_counts = pd.Series(clusters).value_counts()
            insights['clusters'] = {
                "cluster_distribution": {str(k): int(v) for k, v in cluster_counts.items()},
                "centroids": [[float(val) for val in center] for center in kmeans.cluster_centers_]
            }

        # 4. Imbalanced Features
        imbalanced_features = {}
        for col in dataset.columns:
            if dataset[col].nunique() > 1:
                top_value_freq = float(dataset[col].value_counts(normalize=True).iloc[0])
                if top_value_freq > 0.9:
                    imbalanced_features[str(col)] = float(top_value_freq)
        insights['imbalanced_features'] = imbalanced_features

        # 5. Anomalies
        if not numeric_cols.empty:
            anomalies = numeric_cols[
                (numeric_cols < (numeric_cols.mean() - 3 * numeric_cols.std())) | 
                (numeric_cols > (numeric_cols.mean() + 3 * numeric_cols.std()))
            ].dropna(how="all")
            insights['anomalies'] = {
                "anomalous_rows": [int(idx) for idx in anomalies.index],
                "total_anomalies": int(len(anomalies))
            }

        # 6. Summary Statistics
        summary_dict = {}
        for column in dataset.columns:
            col_stats = dataset[column].describe()
            summary_dict[str(column)] = {
                "count": int(col_stats["count"]) if "count" in col_stats else 0,
                "mean": float(col_stats["mean"]) if "mean" in col_stats else None,
                "std": float(col_stats["std"]) if "std" in col_stats else None,
                "min": float(col_stats["min"]) if "min" in col_stats else None,
                "25%": float(col_stats["25%"]) if "25%" in col_stats else None,
                "50%": float(col_stats["50%"]) if "50%" in col_stats else None,
                "75%": float(col_stats["75%"]) if "75%" in col_stats else None,
                "max": float(col_stats["max"]) if "max" in col_stats else None
            }
        insights['summary_statistics'] = summary_dict

        return insights

    def _assign_churn_group(self, customer_ids, probabilities=None):
        """
        Assigns customer types (churn grades) based on probabilities.

        :param probabilities: Array of churn probabilities.
        :return: List of customer types ('red', 'yellow', 'green').
        """
        if probabilities is None:
            return ["unknown"] * len(probabilities)

        # Define custom thresholds and labels
        thresholds = {
            'red': 0.75,  # High churn risk
            'yellow': 0.5,  # Medium churn risk
            'green': 0.0  # Low churn risk
        }

        # add customer_ids to churn_groups        
        churn_group = {}
        for customer_id, prob in zip(customer_ids, probabilities):
            if prob >= thresholds['red']:
                if 'red' not in churn_group:
                    churn_group['red'] = []
                churn_group['red'].append(str(customer_id))
            elif prob >= thresholds['yellow']:
                if 'yellow' not in churn_group:
                    churn_group['yellow'] = []
                churn_group['yellow'].append(str(customer_id))
            else:
                if 'green' not in churn_group:
                    churn_group['green'] = []
                churn_group['green'].append(str(customer_id))
        
        return churn_group

    def _print_churn_group_summary(self, churn_groups):
        """
        Prints a summary of customer churn groups.

        :param churn_groups: Dictionary with churn grades as keys and lists of customer IDs as values.
        """
        for grade, customers in churn_groups.items():
            print(f"Churn Grade: {grade.capitalize()}")
            print(f"Number of Customers: {len(customers)}")
            print(f"Sample Customer IDs: {customers[:5]}")        
        


    def get_feature_importances(self, feature_names):
        """
        Retrieves feature importance from the trained model, if applicable.

        :param feature_names: List of feature names.
        :return: DataFrame with features and their importance scores.
        """
        if not self.is_trained:
            raise ValueError("The model is not trained. Please call the 'train' method first.")

        if hasattr(self.model, 'feature_importances_'):
            # Get feature importance and sort
            importances = self.model.feature_importances_
            importance_df = pd.DataFrame({
                'Feature': feature_names,
                'Importance': importances
            }).sort_values(by='Importance', ascending=False).reset_index(drop=True)
            return importance_df
        else:
            raise AttributeError("The model does not support feature importance.")

        return None

    def group_customers_by_grades(self, customer_ids, customer_types):
        """
        Groups customers by churn grades.

        :param predictions: Array of predictions (optional, can be used for debugging or additional processing).
        :param customer_ids: Array or list of customer IDs.
        :param customer_types: Array or list of customer churn grades ('red', 'yellow', 'green').
        :return: Dictionary with churn grades as keys and lists of customer IDs as values.
        """
        # Validate inputs
        if len(customer_ids) != len(customer_types):
            raise ValueError("Mismatch between the lengths of customer IDs and customer types.")

        # Group customers by grades
        grouped_customers = {}
        for customer_id, grade in zip(customer_ids, customer_types):
            if grade not in grouped_customers:
                grouped_customers[grade] = []
            grouped_customers[grade].append(customer_id)

        return grouped_customers