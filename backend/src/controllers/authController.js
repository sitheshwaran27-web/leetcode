import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    const { isLive, supabase, memDb } = getStore();

    if (isLive) {
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role: role === 'admin' ? 'admin' : 'student' }
        }
      });

      if (authError) {
        return res.status(400).json({ success: false, error: authError.message });
      }

      const userRole = role === 'admin' ? 'admin' : 'student';
      const userProfile = {
        id: authUser.user.id,
        full_name,
        email,
        role: userRole,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`
      };

      await supabase.from('profiles').upsert([userProfile]);

      const token = generateToken(userProfile);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: userProfile
      });
    }

    // Fallback store handling
    const existing = memDb.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const newUser = {
      id: crypto.randomUUID(),
      full_name,
      email: email.toLowerCase(),
      role: role === 'admin' ? 'admin' : 'student',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
      bio: 'Enthusiastic Learner at LearnFree',
      created_at: new Date().toISOString()
    };

    memDb.profiles.push(newUser);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Server error during registration.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const { isLive, supabase, memDb } = getStore();

    if (isLive) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback for demo users if they don't exist in Supabase Auth yet
        const isDemo = email.toLowerCase() === 'admin@learnfree.org' || email.toLowerCase() === 'student@learnfree.org';
        if (isDemo) {
          const demoRole = email.toLowerCase().includes('admin') ? 'admin' : 'student';
          const demoUser = {
            id: demoRole === 'admin' ? 'p0000000-0000-0000-0000-000000000001' : 'p0000000-0000-0000-0000-000000000002',
            email: email.toLowerCase(),
            full_name: demoRole === 'admin' ? 'Platform Admin' : 'Alex Johnson',
            role: demoRole,
            avatar_url: demoRole === 'admin' 
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' 
              : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
          };
          const token = generateToken(demoUser);
          return res.json({ success: true, token, user: demoUser });
        }
        return res.status(401).json({ success: false, error: error.message });
      }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

      const user = profile || {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || 'LearnFree Student',
        role: data.user.user_metadata?.role || 'student'
      };

      const token = generateToken(user);
      return res.json({ success: true, token, user });
    }

    // Memory Store handling
    let user = memDb.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Allow seamless test login for any email/password combo or demo users
      const assignedRole = email.toLowerCase().includes('admin') ? 'admin' : 'student';
      user = {
        id: crypto.randomUUID(),
        full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email.toLowerCase(),
        role: assignedRole,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        bio: 'Student at LearnFree',
        created_at: new Date().toISOString()
      };
      memDb.profiles.push(user);
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Server error during login.' });
  }
};

export const logoutUser = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getCurrentUser = async (req, res) => {
  try {
    const { memDb } = getStore();
    const user = memDb.profiles.find((p) => p.id === req.user.id) || req.user;
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
