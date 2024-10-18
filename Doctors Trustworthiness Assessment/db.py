import pandas as pd
import mysql.connector


# Connect to MySQL
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='1234',
    database='form_data_db'
)

# SQL query to retrieve data
query = "SELECT * FROM user_data"

# Execute the query and read data into a DataFrame
df = pd.read_sql(query, conn)

# Close the connection
conn.close()

# Now you have your data in a DataFrame (df)
print(df)
