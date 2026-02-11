const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mock user database
const users = [
    { id: 1, email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
    { id: 2, email: 'user@example.com', password: 'user123', name: 'Regular User' }
];

// Login API endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Generate simple token (in production, use JWT)
        const token = `token_${Date.now()}_${user.id}`;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token: token
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

// Get user info endpoint
app.get('/api/user', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        res.json({
            success: true,
            user: { name: 'Logged In User', email: 'user@example.com' }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Test users:');
    console.log('  - admin@example.com / admin123');
    console.log('  - user@example.com / user123');
});
