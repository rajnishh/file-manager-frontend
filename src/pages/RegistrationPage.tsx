import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Typography, TextField, Button, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface RegistrationFormInputs {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegistrationPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormInputs>({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axiosInstance.post('/auth/register', data);
      setSuccess(true);
    } catch (error) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      // Delay for showing the success message, then redirect
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); // 2-second delay

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [success, navigate]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {success ? (
        <Typography
          color="primary"
          sx={{ mt: 2, animation: 'fadeOut 2s forwards' }} // Apply fadeOut animation
        >
          Registration successful! Redirecting to login...
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('username')}
            label="Username"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </form>
      )}

      {/* Link to Login Page */}
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <MuiLink component={Link} to="/login" color="primary">
          Log in here
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default RegistrationPage;
