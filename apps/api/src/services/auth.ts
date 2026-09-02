import { supabase, supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class AuthService {
  static async signup(email: string, password: string, businessName: string, phone?: string) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new AppError(authError?.message || 'Failed to create user', 400);
    }

    const { error: dbError } = await supabaseAdmin
      .from('merchants')
      .insert([
        {
          id: authData.user.id,
          email,
          business_name: businessName,
          phone,
        },
      ]);

    if (dbError) {
      throw new AppError('Failed to create merchant profile', 500);
    }

    const token = jwt.sign({ id: authData.user.id, email }, env.JWT_SECRET, { expiresIn: '7d' });
    
    return { user: authData.user, token };
  }

  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ id: data.user.id, email }, env.JWT_SECRET, { expiresIn: '7d' });
    
    return { user: data.user, token };
  }

  static async logout(token: string) {
    // In a stateless JWT system, logout is usually handled client-side by deleting the token.
    // If we used Supabase sessions strictly, we would do:
    // await supabase.auth.signOut();
    return true;
  }

  static async getProfile(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('merchants')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new AppError('Profile not found', 404);
    }

    return data;
  }
}
