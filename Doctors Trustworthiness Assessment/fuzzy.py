# final trust code
import mysql.connector
import numpy as np
import skfuzzy as fuzz
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import psycopg2

# Fuzzy logic setup 
x = np.arange(0, 11, 1)
qual_weight = fuzz.trimf(x, [0, 2, 4])
uni_weight = fuzz.trimf(x, [0, 1, 3])
exp_weight = fuzz.trimf(x, [0, 0, 40])
seniority_weight = fuzz.trimf(x, [0, 2, 3])
area_weight = fuzz.trimf(x, [0, 2, 3])

a = 0.7
b = 0.3

conn = psycopg2.connect(
        user="vmkathe",
        password="0wKRMJSP1GqV",
        host="ep-damp-sun-a1vvdcup.ap-southeast-1.aws.neon.tech",
        port="5432",
        database="form_data_db"
    )

    # SQL query to retrieve data
query = "SELECT * FROM user_data ORDER BY id ASC"

    # Execute the query and read data into a DataFrame
df = pd.read_sql(query, conn)

# Close the connection

# Read original CSV file
#df = pd.read_csv('user_data.csv')

# Handle missing values
df.fillna(0, inplace=True)  # Fill NaN values with 0

# Direct trust calculation
def calculate_direct_trust(row):
    qual_level = int(row['qualification'])
    uni_level = int(row['university'] or 0)
    exp_level = int(row['experience'] or 0)
    seniority_level = int(row['seniority'] or 0)
    area_level = int(row['area'] or 0)

    qual_fuzzy = fuzz.interp_membership(x, qual_weight, qual_level)
    uni_fuzzy = fuzz.interp_membership(x, uni_weight, uni_level)
    exp_fuzzy = fuzz.interp_membership(x, exp_weight, exp_level)
    seniority_fuzzy = fuzz.interp_membership(x, seniority_weight, seniority_level)
    area_fuzzy = fuzz.interp_membership(x, area_weight, area_level)

    direct_trust = (qual_fuzzy * uni_fuzzy**2 +
                    exp_fuzzy * seniority_fuzzy**2 +
                    area_fuzzy * qual_fuzzy**2)

    return direct_trust * 100

# Indirect trust calculation
def calculate_indirect_trust(row):
    followers = row['followers']
    total_followers = df['followers'].sum()
    return (followers / total_followers) * 100

# Final trust calculation
def calculate_final_trust(row):
    direct_trust = calculate_direct_trust(row)
    indirect_trust = calculate_indirect_trust(row)

    final_trust = a * direct_trust + b * indirect_trust
    return final_trust

# Calculate Final Trust
df['Final Trust'] = df.apply(calculate_final_trust, axis=1)
df['Final Trust %'] = (df['Final Trust'] / 100 * 100).astype(float).map('{:,.2f}%'.format)

# Save only the Final Trust % to the original CSV file
#df.drop(columns=['Final Trust']).to_csv('user_data.csv', index=False)
print("Final Trust % saved to user_data.csv")
print("")
print(df[['name', 'Final Trust %']])

# Placeholder class for the FuzzyTrustModel
class FuzzyTrustModel:
    def _init_(self):
        pass
    
    def fit(self, X_train):
        # Placeholder for model fitting
        pass
    
    def predict(self, X_test):
        # Placeholder for model prediction
        # For example, predict random values for demonstration
        return np.random.randint(2, size=len(X_test))

# Split data
X_train, X_test, y_train, y_test = train_test_split(df, df['Final Trust %'], test_size=0.2, random_state=10)

# Simulate expert labels on test data
num_test = len(y_test)
num_trusted = int(num_test * 0.7)

y_test_labeled = np.concatenate([
    np.ones(num_trusted),
    np.zeros(num_test - num_trusted)
]) 
np.random.shuffle(y_test_labeled)

model = FuzzyTrustModel()
model.fit(X_train)

# Evaluate accuracy on test data  
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test_labeled, y_pred) * 100  # Convert accuracy to percentage
print("Fuzzy Model Accuracy:", accuracy, "%")


# Calculate final trust scores 
df['Final Trust'] = df.apply(calculate_final_trust, axis=1)

# Take average of final trust scores
mean_trust = df['Final Trust'].mean() 

# Set threshold as mean final trust
threshold = mean_trust
print(threshold)

cursor = conn.cursor()

df = df.sort_values(by=['id'])

for index, row in df.iterrows():     
    update_query = f"UPDATE user_data SET final_trust = {row['Final Trust']} WHERE id = {row['id']}"
    cursor.execute(update_query)
    conn.commit()

cursor.close()
conn.close()