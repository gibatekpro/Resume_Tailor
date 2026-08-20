import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useAuth } from '../../context/auth/AuthProvider';
import { appName } from '../../utils/applicationData';
import AppLayout from '../../components/shared/AppLayout';
import TopNav from '../../components/shared/TopNav';
import PageLoadingOverlay from '../../components/shared/PageLoadingOverlay';

export const ResetPasswordPage: React.FC = () => {
    window.scroll(0, 0);
    const [resetFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(values: { email: string }) {
        try {
            await auth?.resetPassword(values.email, (message: string) => {
                console.log(message);
                alert(message);
                const from = (location.state as any)?.from?.pathname || '/login';
                navigate(from, { replace: true });
            });
        } catch (error) {
            console.log('An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const ResetSchema = Yup.object().shape({
        email: Yup.string().required('Required').matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, {
            message: 'Email does not match expected pattern',
        }),
    });

    return (
        <AppLayout>
            <TopNav title="Reset Password" />
            <main className="relative flex flex-1 items-center justify-center p-6">
                <PageLoadingOverlay
                    visible={isLoading}
                    withinParent={true}
                    message='Sending reset instructions...'
                />
                <div className="w-full max-w-xl">
                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={ResetSchema}
                        onSubmit={async (values) => {
                            setIsLoading(true);
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            handleSubmit(values);
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <form
                                noValidate
                                onSubmit={handleSubmit}
                                className="flex w-full flex-col gap-5 rounded-2xl border border-[#c6c6cd] bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(33,112,228,0.08)]"
                            >
                                <div className="text-center">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Account help</p>
                                    <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-[#161c22]">{appName}</h1>
                                </div>

                                <div className="border-b border-[#eaeaf0]" />

                                <div className="space-y-2 text-center">
                                    <h2 className="text-xl font-semibold text-[#161c22]">Reset Password</h2>
                                    <p className="text-sm text-[#45464d]">Enter your email to receive password reset instructions.</p>
                                </div>

                                <div className="border-b border-[#eaeaf0]" />

                                {isLoading && (
                                    <div className="flex items-center justify-center py-2">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8e2ff] border-t-[#2170e4]" aria-label="Loading" />
                                    </div>
                                )}

                                {!isLoading && resetFailed && (
                                    <div className="rounded-xl border border-[#f3c3c3] bg-[#fff1f1] px-4 py-3 text-sm text-[#7a1f1f]" role="alert">
                                        Details incorrect or user unverified.
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-[#161c22]">Email</label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            className={`w-full rounded-xl border px-4 py-3 text-sm text-[#161c22] outline-none transition-all duration-200 placeholder:text-[#76777d] ${
                                                touched.email && errors.email
                                                    ? 'border-[#ba1a1a] bg-[#fff4f4] focus:border-[#ba1a1a]'
                                                    : 'border-[#c6c6cd] bg-[#f6f9ff] focus:border-[#2170e4] focus:ring-2 focus:ring-[#d8e2ff]'
                                            }`}
                                            placeholder="name@company.com"
                                            aria-invalid={Boolean(touched.email && errors.email)}
                                        />
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#45464d]">@</span>
                                    </div>
                                    {touched.email && errors.email && (
                                        <p className="text-xs text-[#ba1a1a]">{errors.email}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center rounded-xl bg-[#2170e4] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0058be] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff] disabled:cursor-not-allowed disabled:bg-[#9ab9ee] cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>

                                <div className="border-t border-[#eaeaf0] pt-2 text-center text-sm text-[#45464d]">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-semibold text-[#2170e4] transition-colors duration-200 hover:text-[#0058be]">
                                        Sign in
                                    </Link>
                                </div>

                                <div className="text-center text-sm text-[#45464d]">
                                    Need an account?{' '}
                                    <Link to="/register" className="font-semibold text-[#2170e4] transition-colors duration-200 hover:text-[#0058be]">
                                        Register
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </main>
        </AppLayout>
    );
};
