# ML_Customer_Churn_Prediction

## Introduction

**Every business deals with customer churn. It is one of the top business priorities.**

**Customer churn**, also known as customer attrition, refers to "a degree of inactivity or disengagement observed given a period of time". There are usualy early indicators which could be uncovered from relational or behavioral data with churn analysis. To understand key drivers of customer churn and to be abe to identify at-risk customers is crucial to many aspects of business development, from **revenue growth** to **acquisition campaign ROI**. Normally, loyal, long-term customers spend 90% more often and buy 90% more per transaction. Hence it's always worth business attention to investigate on how to retain existing customers and prevent churn. 


## Introduction

### For this project, I aim to accomplish these two objectives : 
1. Diagnose key factors of customer churn
2. Build a model to identify at-risk customers (likely to churn)

### Content

1. Introduction
2. Data Preparation
3. Explorative Data Analysis (EDA)
4. Feature Engineering
   - Categorical Encoding
   - Numeric Scaling
   - Create New Features
5. Model Selection
   - Logistic Regression 
   - Polynomial Logistic Regression (degree =2)
   - Support Vecotr Machine (RBF Kernel)
   - Support Vecotr Machine (Poly Kernel)
   - Random Forest 
   - Extreme Gradient Boosting Machine
6. Feature Selection
   - L1 regularization
   - L2 regularization
7. Summary


I kicked off this project by first looking into internal structure of input data. Some statistic analysis and visualization techniques are used to explore numeric and categorical features in the dataset. A bunch of interesting insights were extracted from data (numeric, categorical). 

The feature engineering part includes a set of numeric scaling (normalization) and categorical transformation (onehotencoding, ordinal encodring). Some new features were believed to have contribution to predicting target values, thus added to the feature space. 

K-fold cross validation and grid search methods are utilized at model selection stages. Since it is of greate significance for the model to ba able to identify as many churned customers as possbile, recall is more valued among other evaluation metrics (precision, accuracy, f1 score, auc score). 

The best model after training and paramter tuning is Random Forest (recall:0.48, precision: 0.8, accuracy: 0.87, auc score: 0.87). 
