const crypto = require('crypto');

// Server-side accounts configuration
const USERS = [
  {
    username: 'samanvitha@recover.demo',
    passwords: ['Recover@2026'],
    name: 'Samanvitha',
    email: 'samanvitha@recover.demo',
    role: 'Admin', // Full access
    permissions: ['read', 'execute', 'batch_execute', 'reset', 'audit_export']
  },
  {
    username: 'admin',
    passwords: ['Recover@2026', 'demo pass', 'demopass', 'admin123', 'password'],
    name: 'Alex Rivera',
    email: 'admin@recover.demo',
    role: 'Admin',
    permissions: ['read', 'execute', 'batch_execute', 'reset', 'audit_export']
  },
  {
    username: 'ops1',
    passwords: ['Recover@2026', 'demo pass', 'demopass', 'ops123', 'password'],
    name: 'Taylor Kim',
    email: 'ops1@recover.demo',
    role: 'Ops',
    permissions: ['read', 'execute', 'batch_execute']
  },
  {
    username: 'viewer',
    passwords: ['Recover@2026', 'demo pass', 'demopass', 'viewer123', 'password'],
    name: 'Jordan Lee',
    email: 'viewer@recover.demo',
    role: 'Viewer',
    permissions: ['read']
  }
];

// In-memory active session tokens
const activeSessions = new Map();

function authenticate(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const user = USERS.find(u => u.username.toLowerCase() === cleanUser);
  if (!user) {
    return { success: false, error: 'Invalid credentials. User not found.' };
  }

  const isMatch = user.passwords.some(p => p === cleanPass || p.toLowerCase() === cleanPass.toLowerCase());
  if (!isMatch) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }

  // Generate session token
  const token = `rec_sess_${crypto.randomBytes(24).toString('hex')}`;
  const sessionData = {
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    createdAt: new Date().toISOString()
  };

  activeSessions.set(token, sessionData);

  return {
    success: true,
    token,
    user: sessionData
  };
}

function verifyToken(token) {
  if (!token) return null;
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  return activeSessions.get(cleanToken) || null;
}

function logout(token) {
  if (!token) return true;
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  activeSessions.delete(cleanToken);
  return true;
}

module.exports = {
  USERS: USERS.map(u => ({ username: u.username, role: u.role, name: u.name })),
  authenticate,
  verifyToken,
  logout
};
