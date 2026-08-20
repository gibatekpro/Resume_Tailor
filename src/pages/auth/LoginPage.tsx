import { useState } from "react";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../../context/auth/AuthProvider";
import AppLayout from "../../components/shared/AppLayout";
import TopNav from "../../components/shared/TopNav";
import PageLoadingOverlay from "../../components/shared/PageLoadingOverlay";

export const LoginPage: React.FC = () => {
    window.scroll(0, 0);
    const [passVisible, setPassVisible] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitClickCount, setSubmitClickCount] = useState(0);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getLoginErrorMessage = (error: unknown): string => {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case "auth/invalid-credential":
                case "auth/wrong-password":
                case "auth/user-not-found":
                    return "Incorrect email or password.";
                case "auth/too-many-requests":
                    return "Too many attempts. Please wait a moment and try again.";
                case "auth/network-request-failed":
                    return "Network issue while signing in. Check your connection and try again.";
                default:
                    return "Unable to sign in right now. Please try again.";
            }
        }

        if (error instanceof Error && error.message.trim().length > 0) {
            return error.message;
        }

        return "Failed to sign in. Check credentials.";
    };

    const handlePasswordVisibility = () => setPassVisible((value) => !value);

    async function handleSubmit(values: { email: string; password: string }) {
        console.log(`Attempting to log in with email: ${values.email}`);
        try {
            if (!auth) {
                throw new Error("Authentication service is unavailable.");
            }

            await auth.login(values.email, values.password, (_user: string) => {
                console.log(`User ${_user} logged in successfully.`);
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            });
        } catch (error) {
            setLoginFailed(true);
            setLoginErrorMessage(getLoginErrorMessage(error));
            console.log("An error occurred", error);
        } finally {
            setIsLoading(false);
        }
    }

    const SignupSchema = Yup.object().shape({
        password: Yup.string().min(8, "Too Short!").max(25, "Too Long!").required("Required"),
        email: Yup.string().email("Please enter a valid email").required("Required"),
    });

    return (
        <AppLayout>
            <TopNav title="Login" />
            <main className="relative flex flex-1 items-center justify-center p-6">
                <PageLoadingOverlay
                    visible={isLoading}
                    withinParent={true}
                    message="Signing you in..."
                />
                <div className="w-full max-w-xl">
                    <Formik
                       initialValues={{ email: "", password: "" }}
                       validationSchema={SignupSchema}
                       onSubmit={async (values) => {
                           setIsLoading(true);
                           setLoginFailed(false);
                           setLoginErrorMessage("");
                           await handleSubmit(values);
                       }}
                    >
                       {({ handleSubmit, handleChange, values, touched, errors, submitCount }) => {
                           const showEmailError = (touched.email || submitCount > 0) && Boolean(errors.email);
                           const showPasswordError = (touched.password || submitCount > 0) && Boolean(errors.password);
                           const hasValidationErrors = submitCount > 0 && Object.keys(errors).length > 0;

                           const emailClass = `w-full rounded-xl border px-4 py-3 text-sm text-[#161c22] outline-none transition-all duration-200 placeholder:text-[#76777d] ${
                               showEmailError
                                   ? "border-[#ba1a1a] bg-[#fff4f4] focus:border-[#ba1a1a]"
                                   : "border-[#c6c6cd] bg-[#f6f9ff] focus:border-[#2170e4] focus:ring-2 focus:ring-[#d8e2ff]"
                           }`;

                           const passwordClass = `w-full rounded-xl border px-4 py-3 pr-12 text-sm text-[#161c22] outline-none transition-all duration-200 placeholder:text-[#76777d] ${
                               showPasswordError
                                   ? "border-[#ba1a1a] bg-[#fff4f4] focus:border-[#ba1a1a]"
                                   : "border-[#c6c6cd] bg-[#f6f9ff] focus:border-[#2170e4] focus:ring-2 focus:ring-[#d8e2ff]"
                           }`;

                           return (
                               <form
                                   noValidate
                                   onSubmit={handleSubmit}
                                   className="flex w-full flex-col gap-5 rounded-2xl border border-[#c6c6cd] bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(33,112,228,0.08)]"
                               >
                                   <div className="text-center">
                                       <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Secure access</p>
                                   </div>

                                   <div className="border-b border-[#eaeaf0]" />

                                   <div className="space-y-2 text-center">
                                       <h2 className="text-xl font-semibold text-[#161c22]">Sign in</h2>
                                       <p className="text-sm text-[#45464d]">Use your account to access your dashboard.</p>
                                   </div>

                                   <div className="border-b border-[#eaeaf0]" />

                                   {isLoading && (
                                       <div className="flex items-center justify-center py-2">
                                           <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8e2ff] border-t-[#2170e4]" aria-label="Loading" />
                                       </div>
                                   )}

                                   {!isLoading && loginFailed && (
                                       <div className="rounded-xl border border-[#f3c3c3] bg-[#fff1f1] px-4 py-3 text-sm text-[#7a1f1f]" role="alert">
                                           {loginErrorMessage || "Failed to sign in. Check credentials."}
                                       </div>
                                   )}

                                   {!isLoading && hasValidationErrors && (
                                       <div className="rounded-xl border border-[#f3c3c3] bg-[#fff1f1] px-4 py-3 text-sm text-[#7a1f1f]" role="alert">
                                           Please fix the highlighted fields before signing in.
                                       </div>
                                   )}

                                   {!isLoading && submitClickCount > 0 && submitCount === 0 && (
                                       <div className="rounded-xl border border-[#e0d0a3] bg-[#fff9e8] px-4 py-3 text-sm text-[#7a5a12]" role="status">
                                           Sign-in button click detected, but form submission did not run.
                                       </div>
                                   )}

                                   <div className="space-y-2">
                                       <label htmlFor="email" className="text-sm font-medium text-[#161c22]">Email</label>
                                       <input
                                           id="email"
                                           type="email"
                                           name="email"
                                           value={values.email}
                                           onChange={handleChange}
                                           className={emailClass}
                                           placeholder="name@company.com"
                                           aria-invalid={showEmailError}
                                       />
                                       {showEmailError && (
                                           <p className="text-xs text-[#ba1a1a]">{errors.email}</p>
                                       )}
                                   </div>

                                   <div className="space-y-2">
                                       <label htmlFor="password" className="text-sm font-medium text-[#161c22]">Password</label>
                                       <div className="relative">
                                           <input
                                               id="password"
                                               type={passVisible ? "text" : "password"}
                                               name="password"
                                               value={values.password}
                                               onChange={handleChange}
                                               className={passwordClass}
                                               placeholder="Enter your password"
                                               aria-invalid={showPasswordError}
                                           />
                                           <button
                                               type="button"
                                               onClick={handlePasswordVisibility}
                                               className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#45464d] transition-colors duration-200 hover:bg-[#eef4fc] hover:text-[#2170e4] cursor-pointer"
                                               aria-label={passVisible ? "Hide password" : "Show password"}
                                           >
                                               {passVisible ? (
                                                   <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                                                       <path d="M12 5c5.2 0 9.5 3.8 10.8 7-1.3 3.2-5.6 7-10.8 7S2.5 15.2 1.2 12C2.5 8.8 6.8 5 12 5Zm0 2.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 2.1a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4Z" />
                                                   </svg>
                                               ) : (
                                                   <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                                                       <path d="M3.7 3.3 2.3 4.7l2.4 2.4A13.9 13.9 0 0 0 1.2 12c1.3 3.2 5.6 7 10.8 7 2 0 3.8-.5 5.4-1.4l2.6 2.6 1.4-1.4-18-18ZM9.5 9.5a2.7 2.7 0 0 1 3.8-3.8l-3.8 3.8Zm4.7 4.7a2.7 2.7 0 0 1-3.8 3.8l3.8-3.8Zm6.6-2.7c-1.2 2.2-4.8 5.1-8.9 5.7l1.7-1.7c1.5-.3 2.9-.9 4.1-1.8.7-.6 1.4-1.4 2-2.2-.5-.5-1.1-1-1.8-1.5l1.1-1.1c1.2.8 2.3 1.9 3.2 3.1a9.7 9.7 0 0 1-2.4 2.5Zm-9.1-7.8c1.7-.7 3.5-1 5.3-.9L13.9 7c-1.3-.2-2.6-.1-3.8.4l-1.5 1.5-1.1 1.1c-.9.9-1.6 1.9-2.3 3 .5.5 1.1 1 1.8 1.5l-1.9 1.9A11.9 11.9 0 0 1 1.2 12c1.3-3.2 5.6-7 10.8-7 1.6 0 3.2.3 4.6.9L15 6.1a9.2 9.2 0 0 0-5.5-1.2Z" />
                                                   </svg>
                                               )}
                                           </button>
                                       </div>
                                       {showPasswordError && (
                                           <p className="text-xs text-[#ba1a1a]">{errors.password}</p>
                                       )}
                                   </div>

                                   <button
                                       type="submit"
                                       onClick={() => setSubmitClickCount((count) => count + 1)}
                                       disabled={isLoading}
                                       className="inline-flex items-center justify-center rounded-xl bg-[#2170e4] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0058be] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff] disabled:cursor-not-allowed disabled:bg-[#9ab9ee] cursor-pointer"
                                   >
                                       {isLoading ? (
                                           <>
                                               <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                               Signing in...
                                           </>
                                       ) : (
                                           "Sign in"
                                       )}
                                   </button>

                                   <div className="flex items-center justify-between text-sm">
                                       <Link to="/reset-password" className="italic text-[#2170e4] transition-colors duration-200 hover:text-[#0058be]">
                                           Forgot password
                                       </Link>
                                   </div>

                                   <div className="border-t border-[#eaeaf0] pt-2 text-center text-sm text-[#45464d]">
                                       Don&apos;t have an account?{' '}
                                       <Link to="/register" className="font-semibold text-[#2170e4] transition-colors duration-200 hover:text-[#0058be]">
                                           Register
                                       </Link>
                                   </div>
                               </form>
                           );
                       }}
                    </Formik>
                </div>
            </main>
        </AppLayout>
    );
};
