import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../../types';

const prisma = new PrismaClient();

export default async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    if (!username || !password) { res.status(400).json({ success: false, message: 'Username dan password wajib.' }); return; }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) { res.status(401).json({ success: false, message: 'Username atau password salah.' }); return; }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) { res.status(401).json({ success: false, message: 'Username atau password salah.' }); return; }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, nama: admin.nama },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: { admin: { id: admin.id, username: admin.username, nama: admin.nama } },
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ success: false, message: 'Gagal login.' });
  }
}
