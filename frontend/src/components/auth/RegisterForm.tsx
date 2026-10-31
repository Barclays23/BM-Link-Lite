import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { registerSchema, type RegisterFormData } from '../../schema/register.schema';




export default function RegisterForm() {
    const { register: registerUser } = useAuth();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const { confirmPassword: _, ...registerPayload } = data;

            await registerUser(registerPayload);

            toast.success('Registration successful');

            navigate('/login', {
                replace: true,
                state: {
                message: 'Registration successful. Please log in.',
                },
            });
        } catch (error) {
            toast.error(
                getErrorMessage(error, 'Registration failed.'),
            );
        }
    };

    return (
        <form
            className="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <label htmlFor="register-name">
                Full name
            </label>

            <input
                id="register-name"
                autoComplete="name"
                {...register('name')}
            />

            {errors.name && (
                <p className="field-error">
                    {errors.name.message}
                </p>
            )}

            <label htmlFor="register-email">
                Email address
            </label>

            <input
                id="register-email"
                type="email"
                autoComplete="email"
                {...register('email')}
            />

            {errors.email && (
                <p className="field-error">
                    {errors.email.message}
                </p>
            )}

            <label htmlFor="register-password">
                Password
            </label>

            <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
            />

            {errors.password && (
                <p className="field-error">
                    {errors.password.message}
                </p>
            )}

            <label htmlFor="register-confirm-password">
                Confirm Password
                </label>

                <input
                    id="register-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                />

                {errors.confirmPassword && (
                    <p className="field-error">
                        {errors.confirmPassword.message}
                    </p>
                )}

            <button
                className="button button-primary button-full"
                disabled={isSubmitting}
                type="submit"
            >
                {isSubmitting
                ? 'Creating account...'
                : 'Create account'}
            </button>

            <p className="auth-footer">
                Already have an account?{' '}
                <Link to="/login">Log in</Link>
            </p>
        </form>
    );
}