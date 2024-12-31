import React, {useEffect, useState} from "react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog, DialogPanel} from "@headlessui/react";
import {useNavigate} from "react-router-dom";
import ROUTES from "../data/routes";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export const Navbar: React.FC<{ hide?: boolean }> = ({hide}) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoggedIn(!!user); // Set loggedIn state based on user presence
            if (user) {
                setEmail(user.email || ""); // Set the email if user exists
            } else {
                setEmail(""); // Clear email if no user
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    const navigation = [
        {name: "Tailor CV", path: ROUTES.RESUME_INPUT_PAGE},
        {name: "My Job Applications", path: ROUTES.MY_JOB_APPLICATIONS},
        {name: "My CVs", path: ROUTES.NEW_CV_PAGE},
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false); // Close menu in mobile view
    };

    const performLogout = () => {
        getAuth().signOut();
        setLoggedIn(false);
    };

    if (hide) return null;

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <nav className="flex items-center justify-between p-3 lg:px-8" aria-label="Global">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5" onClick={() => navigate(ROUTES.HOME)}>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            onClick={() => handleNavigate(item.path)}
                            className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                {/* Auth Links (Desktop) */}
                {!loggedIn && (
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a
                            onClick={() => handleNavigate(ROUTES.LOGIN)}
                            className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
                        >
                            Log in <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                )}
                {loggedIn && (
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <button
                            style={{
                                backgroundColor: "white",
                                border: "1px solid darkgray",
                                color: "black",
                                padding: "4px",
                                borderRadius: "4px",
                                cursor: "text",
                                fontSize: 12,
                                transition: "background-color 0.3s, color 0.3s",
                            }}
                            className={"mx-4"}
                        >
                            {email}
                        </button>
                        <a
                            onClick={performLogout}
                            className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
                        >
                            <span aria-hidden="true">&larr;</span> Log out
                        </a>
                    </div>
                )}
            </nav>

            {/* Mobile Menu */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50"/>
                <DialogPanel
                    className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5" onClick={() => navigate(ROUTES.HOME)}>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                                alt="Your Company"
                            />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                        </button>
                    </div>

                    {/* Mobile Nav Links */}
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        onClick={() => handleNavigate(item.path)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                {!loggedIn ? (
                                    <a
                                        onClick={() => handleNavigate(ROUTES.LOGIN)}
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                ) : (
                                    <>
                                        <button
                                            style={{
                                                backgroundColor: "white",
                                                border: "1px solid darkgray",
                                                color: "black",
                                                paddingLeft: "4px",
                                                padding: "4px",
                                                borderRadius: "4px",
                                                cursor: "text",
                                                fontSize: 12,
                                                transition: "background-color 0.3s, color 0.3s",
                                            }}
                                            className={"mx-4"}
                                        >
                                            {email}
                                        </button>
                                        <a
                                            onClick={performLogout}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Log out
                                        </a>
                                    </>

                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
};
