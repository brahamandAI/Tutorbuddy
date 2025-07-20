import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { signIn } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    (signIn as jest.Mock).mockClear();
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('displays error message on failed login', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
}); 