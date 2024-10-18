const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const {exec} = require('child_process')
const { Pool } = require('pg');
// Create an Express application
const app = express();

// Set the port number
const port = 7000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'static' folder
app.use('/static', express.static('static'));

// MySQL database connection configuration

const qualificationMapping = {
  'mbbs': 1,
  'md': 2,
  'dm': 3,
  // Add more mappings as needed
};
const universityMapping = {
  'Tyre1': 1,
  'Tyre2': 2,
  'Tyre3': 3,
  // Add more mappings as needed
};
const seniorityMapping = { 
  'Junior': 1,
  'Senior': 2,
  
  // Add more mappings as needed
};
const areaMapping = {
  'urban': 1,
  'rural': 2,
  
  // Add more mappings as needed
};

const connection = new Pool({
  user: 'vmkathe',
  host: 'ep-damp-sun-a1vvdcup.ap-southeast-1.aws.neon.tech',
  database: 'form_data_db',
  password: '0wKRMJSP1GqV',
  port: 5432,
  ssl: {
    require: true,
  }, // Default PostgreSQL port
});

// Connect to the databases
connection.connect(err => {
  if (err) {
    console.error('Error connecting to PostgreSQL database 1:', err);
    return;
  }
  console.log('Connected to PostgreSQL database 1');
});


// Basic route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for handling login form submission
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // Perform authentication logic and query the database

    const query = `SELECT * FROM form WHERE email = $1 AND password = $2`;
    connection.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('Error executing login query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      results = results.rows;
      if (results.length > 0) {
        return res.status(200).json({ success: true, message: 'Login successful!' });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect username or password' });
      }
    });
  });
  
  // Route for handling signup form submission
  app.post('/signup', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
   
    // Perform user registration logic and insert into the database
    const query = 'INSERT INTO form (username, email, password) VALUES ($1, $2, $3)';
    connection.query(query, [username, email, password], (err, results) => {
      if (err) {
        console.error('Error executing signup query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      return res.status(200).json({ success: true, message: 'Signup successful!' });
    });
  });
  

 
  app.post('/login1', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // Perform authentication logic and query the database

    const query = `SELECT * FROM form1 WHERE email = $1 AND password = $2`;
    connection.query(query, [email, password], (err, results) => {
      if (err) {
        console.error('Error executing login query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      results = results.rows;
      if (results.length > 0) {
        return res.status(200).json({ success: true, message: 'Login successful!' });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect username or password' });
      }
    });
  });
  
  // Route for handling signup form submission
  app.post('/signup1', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
   
    // Perform user registration logic and insert into the database
    const query = 'INSERT INTO form1 (username, email, password) VALUES ($1, $2, $3)';
    connection.query(query, [username, email, password], (err, results) => {
      if (err) {
        console.error('Error executing signup query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      return res.status(200).json({ success: true, message: 'Signup successful!' });
    });
  });
  


// Route for handling form submission
app.post('/submit', async (req, res) => {
  const formData = req.body;

  // Insert data into the 'user_data' table
  formData.qualification = qualificationMapping[formData.qualification] || formData.qualification;
  formData.university = universityMapping[formData.university] || formData.university;
  formData.seniority = seniorityMapping[formData.seniority] || formData.seniority;
  formData.area = areaMapping[formData.area] || formData.area;


  const sql = `
    INSERT INTO user_data (name, contact, date_of_birth, age, gender, qualification, specialization, university, experience, seniority, city, area, followers, final_trust) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11, $12, $13, $14)`;

const values = [
    formData.name,
    formData.contact,
    formData.date_of_birth,
    formData.age,
    formData.gender,
    formData.qualification,
    formData.specialization,
    formData.university,
    formData.experience,
    formData.seniority,
    formData.city,
    formData.area,
    formData.followers,
    0
];

await connection.query(sql, values);

  exec('python fuzzy.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      res.status(500).json({ success: false, message: 'Error inserting data' });
    }
    console.log(`Python script output: ${stdout}`);
    res.status(200).json({ success: true, message: stdout });

    if (stderr) {
      console.error(`Error from Python script: ${stderr}`);
    }
  });
 
});
 
app.get('/get_data', (req, res) => {
  // Query the user_data table to retrieve the data
  const query = 'SELECT * FROM user_data';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing login query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (results.length > 0) {
        return res.status(200).json({ results });
      } else {
        return res.status(401).json({ success: false, message: 'Not Found' });
      }
    });
  
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

// // Route for downloading CSV
// app.get('/static/home.html/download-csv', (req, res) => {
//   const outputPath = path.join(__dirname, 'user_data.csv');
//   const query = 'SELECT * FROM user_data';

//   const csvWriter = createCsvWriter({
//     path: outputPath,
//     header: [
//       'name', 'contact', 'date_of_birth', 'age', 'gender', 'qualification',
//       'specialization', 'university', 'experience', 'seniority', 'city', 'area', 'followers'
//     ],
//   });

//   connection.query(query, (err, result) => {
//     if (err) {
//       console.error('Error querying data:', err);
//       res.status(500).json({ success: false, message: 'Error querying data' });
//     } else {
//       csvWriter.writeRecords(result).then(() => {
//         res.download(outputPath, 'user_data.csv', (err) => {
//           if (err) {
//             console.error('Error downloading CSV:', err);
//             res.status(500).json({ success: false, message: 'Error downloading CSV' });
//           } else {
//             console.log('CSV file downloaded successfully');
//           }
//         });
//       });
//     }
//   });
// });

// Route for handling CSV export


function export_data(){
  connection.query('SELECT * FROM user_data', (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ success: false, message: 'Error querying database' });
      return;
    }

    // Define the CSV file path and header
    const csvFilePath = path.join(__dirname, 'user_data.csv');
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'contact', title: 'Contact' },
        { id: 'date_of_birth', title: 'Date of Birth' },
        { id: 'age', title: 'Age' },
        { id: 'gender', title: 'Gender' },
        { id: 'qualification', title: 'Qualification' },
        { id: 'specialization', title: 'Specialization' },
        { id: 'university', title: 'University' },
        { id: 'experience', title: 'Experience' },
        { id: 'seniority', title: 'Seniority' },
        { id: 'city', title: 'City' },
        { id: 'area', title: 'Area' },
        { id: 'followers', title: 'Followers' },
      ],
    });

    // Write data to CSV file
    csvWriter.writeRecords(rows)
      .then(() => {
        console.log('CSV file created successfully');
        // Send the CSV file as a response
        res.download(csvFilePath);
      })
      .catch((writeErr) => {
        console.error('Error writing CSV file:', writeErr);
        res.status(500).json({ success: false, message: 'Error writing CSV file' });
      });
  });
}





// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.post('/search', (req, res) => {
  const selectedCity = req.body.city;

  // Query the database to retrieve doctors of the selected city, sorted in descending order
  const query = 'SELECT name, final_trust FROM user_data WHERE city = $1 ORDER BY final_trust DESC';
  connection.query(query, [selectedCity], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    // Send the results as JSON
    return res.status(200).json({ success: true, results: results.rows });
  });
});