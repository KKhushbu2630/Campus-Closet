const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(express.static(__dirname));

// Configure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

let items = [];

// API to add new items
app.post('/api/items', upload.single('image'), (req, res) => {
  const { name, description, price, category, contact } = req.body;
  
  const newItem = {
    id: Date.now(),
    name,
    description,
    price,
    category,
    contact,
    date: new Date().toLocaleString(),
    image: req.file ? '/uploads/' + req.file.filename : null
  };

  items.push(newItem);
  res.json(newItem);
});

// API to get all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const initialLength = items.length;
  
  // Filter out the item to delete
  items = items.filter(item => item.id !== itemId);
  
  if (items.length < initialLength) {
    res.json({ success: true, message: 'Item deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Item not found' });
  }
});

//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
const ADMIN_USERNAME = "Khushbu";
const ADMIN_PASSWORD = "123";

// Admin login route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Admin logout route
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Middleware to check admin authentication
function checkAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
}

// Protected admin routes
app.get('/admin/items', checkAdmin, (req, res) => {
  res.json(items);
});

app.delete('/admin/items/:id', checkAdmin, (req, res) => {
  const itemId = parseInt(req.params.id);
  const initialLength = items.length;
  
  items = items.filter(item => item.id !== itemId);
  
  if (items.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

//login vala part
// Add these to your existing server.js

const bcrypt = require('bcryptjs');
//const session = require('express-session');

// Add after other middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Sample user database (in real app, use a database)
const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        email: 'admin@example.com'
    },
    {
        id: 2,
        username: 'user1',
        password: bcrypt.hashSync('user123', 10),
        role: 'user',
        email: 'user1@example.com'
    }
];

// Login endpoint for both admin and users
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
    };

    res.json({ 
        success: true, 
        role: user.role,
        redirect: user.role === 'admin' ? '/dashboard.html' : '/profile.html'
    });
});

// Logout endpoint
app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// Middleware to check admin role
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden' });
    }
}



// Add this before app.listen
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});
//admin
// Add these routes to your existing server.js

// User management endpoints
app.get('/api/users', checkAdmin, (req, res) => {
    // In a real app, fetch users from database
    const users = [
        { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin" },
        { id: 2, name: "Regular User", email: "user@example.com", role: "User" }
    ];
    res.json(users);
});

app.delete('/api/users/:id', checkAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    // In a real app, delete from database
    res.json({ success: true, message: 'User deleted successfully' });
});

// Add this middleware to check if user is admin
function checkAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
}
//

// User profile endpoint
app.get('/api/user-profile', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

// Admin check endpoint
app.get('/api/check-admin', isAuthenticated, isAdmin, (req, res) => {
    res.json({ success: true });
});

// Add this to protect all admin pages
app.get('/admin/*', isAuthenticated, isAdmin, (req, res, next) => {
    next();
});
app.get('/api/user-profile', isAuthenticated, (req, res) => {
            res.json(req.session.user);
        });


// Serve HTML files
app.get('/sell', (req, res) => {
  res.sendFile(path.join(__dirname, 'sell.html'));
});

app.get('/buy', (req, res) => {
  res.sendFile(path.join(__dirname, 'buy.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});