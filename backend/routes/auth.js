router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query the database for the user
    const result = await pool.query(
      'SELECT id, email, password_hash FROM admins WHERE email = $1',
      [email]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const payload = { adminId: admin.id };
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';

    jwt.sign(payload, jwtSecret, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;

      res.json({
        token,
        admin: {
          id: admin.id,
          email: admin.email
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
