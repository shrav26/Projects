

const dropdown = document.querySelector(".dropdown");
const select = dropdown.querySelector(".select");
const caret = dropdown.querySelector(".caret");
const menu = dropdown.querySelector(".menu");
const options = dropdown.querySelectorAll(".menu li");
const selected = dropdown.querySelector(".selected");

select.addEventListener("click", () => {
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open")
})

options.forEach(option => {
    option.addEventListener("click", () => {
        selected.innerText = option.innerText;
        select.classList.remove("select-clicked");
        caret.classList.remove("caret-rotate");
        menu.classList.remove("menu-open");
        options.forEach(option => {
            option.classList.remove("active")
        })
        option.classList.add("active")
    })
})

// Find the button element
var loginButton = document.querySelector('.login-register-btn');

// Attach an onclick event handler
loginButton.onclick = function() {
    // Navigate to the next page (login.html)
    window.location.href = '/static/login.html';
  
};


var loginButton = document.querySelector('.login-register-btn1');

// Attach an onclick event handler
loginButton.onclick = function() {
    // Navigate to the next page (login.html)
    window.location.href = '/static/plogin.html';
};


document.getElementById('nextBtn').addEventListener('click', function () {
  const selectedCity = document.querySelector('.selected').textContent;
  
  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: selectedCity }),
  })
    .then((response) => response.json())
    .then((data) => {
      const doctorList = document.getElementById('doctorList');
      doctorList.innerHTML = ''; // Clear previous results
      
      const tbody = document.getElementById('doctorTable').getElementsByTagName('tbody')[0];

      data.results.forEach((doctor) => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.textContent = doctor.name; // Assuming 'name' is the field name for doctor's name
        cell2.textContent = doctor.final_trust; // Assuming 'final_trust' is the field name for trust score
      });
    })
    .catch((error) => console.error('Error:', error));
});


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
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to PostgreSQL database 1:', err);
      return;
    }
    console.log('Connected to PostgreSQL database 2');
  });
  

// Basic route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
  app.get('/login1', (req, res) => {
    res.sendFile(path.join(__dirname, 'plogin.html'));
  });
  app.get('/phome', (req, res) => {
    res.sendFile(path.join(__dirname, 'phome.html'));
  });
  // Route for handling login form submission
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
    
    