import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppLayout from '../components/shared/AppLayout';
import TopNav from '../components/shared/TopNav';
import PageLoadingOverlay from '../components/shared/PageLoadingOverlay';
import userProfileService from '../service/UserProfileService';

interface ProfileFormValues {
    firstName: string;
    lastName: string;
}

const profileSchema = Yup.object().shape({
    firstName: Yup.string().min(1, 'Too Short!').max(25, 'Too Long!').required('Required'),
    lastName: Yup.string().min(1, 'Too Short!').max(25, 'Too Long!').required('Required'),
});

export const ProfilePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading profile...');
    const [saveComplete, setSaveComplete] = useState(false);
    const [saveFailed, setSaveFailed] = useState(false);
    const [initialValues, setInitialValues] = useState<ProfileFormValues>({
        firstName: '',
        lastName: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setLoadingMessage('Loading profile...');

            try {
                const profile = await userProfileService.getMyProfile();
                setInitialValues({
                    firstName: profile?.firstName ?? '',
                    lastName: profile?.lastName ?? '',
                });
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProfile();
    }, []);

    const handleSubmit = async (values: ProfileFormValues) => {
        setIsLoading(true);
        setLoadingMessage('Saving profile...');
        setSaveComplete(false);
        setSaveFailed(false);

        try {
            await userProfileService.saveMyProfile(values.firstName, values.lastName);
            setSaveComplete(true);
        } catch (error) {
            setSaveFailed(true);
            console.error('Error saving profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <TopNav title="Profile" />
            <main className="relative flex flex-1 items-center justify-center px-4 py-6 md:px-6 lg:px-8">
                <PageLoadingOverlay
                    visible={isLoading}
                    withinParent={true}
                    message={loadingMessage}
                />
                <div className="w-full max-w-2xl">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={profileSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit: submitForm, handleChange, values, touched, errors }) => {
                            const inputClass = (fieldName: keyof ProfileFormValues) =>
                                `w-full rounded-xl border px-4 py-3 text-sm text-[#161c22] outline-none transition-all duration-200 placeholder:text-[#76777d] ${
                                    touched[fieldName] && errors[fieldName]
                                        ? 'border-[#ba1a1a] bg-[#fff4f4] focus:border-[#ba1a1a]'
                                        : 'border-[#c6c6cd] bg-[#f6f9ff] focus:border-[#2170e4] focus:ring-2 focus:ring-[#d8e2ff]'
                                }`;

                            return (
                                <form
                                    noValidate
                                    onSubmit={submitForm}
                                    className="flex w-full flex-col gap-5 rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(33,112,228,0.08)] md:p-7"
                                >
                                    <div className="text-center">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2170e4]">Account settings</p>
                                    </div>

                                    <div className="border-b border-[#eaeaf0]" />

                                    <div className="space-y-2 text-center">
                                        <h2 className="text-xl font-semibold text-[#161c22]">Update Profile</h2>
                                        <p className="text-sm text-[#45464d]">Manage your first and last name.</p>
                                    </div>

                                    <div className="border-b border-[#eaeaf0]" />

                                    {saveComplete && !isLoading && (
                                        <div className="rounded-xl border border-[#b7e1c2] bg-[#edf9f1] px-4 py-3 text-sm text-[#225b34]" role="status">
                                            Profile updated successfully.
                                        </div>
                                    )}

                                    {saveFailed && !isLoading && (
                                        <div className="rounded-xl border border-[#f3c3c3] bg-[#fff1f1] px-4 py-3 text-sm text-[#7a1f1f]" role="alert">
                                            Failed to update profile.
                                        </div>
                                    )}

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-medium text-[#161c22]">First name</label>
                                            <input
                                                id="firstName"
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                className={inputClass('firstName')}
                                                placeholder="John"
                                                aria-invalid={Boolean(touched.firstName && errors.firstName)}
                                            />
                                            {touched.firstName && errors.firstName && (
                                                <p className="text-xs text-[#ba1a1a]">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-medium text-[#161c22]">Last name</label>
                                            <input
                                                id="lastName"
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                className={inputClass('lastName')}
                                                placeholder="Doe"
                                                aria-invalid={Boolean(touched.lastName && errors.lastName)}
                                            />
                                            {touched.lastName && errors.lastName && (
                                                <p className="text-xs text-[#ba1a1a]">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-[#2170e4] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0058be] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff] disabled:cursor-not-allowed disabled:bg-[#9ab9ee]"
                                    >
                                        Save profile
                                    </button>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </main>
        </AppLayout>
    );
};
