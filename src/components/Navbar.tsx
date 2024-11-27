import React, {useContext, useEffect, useState} from "react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog, DialogPanel} from "@headlessui/react";
import {useNavigate} from "react-router-dom";
import ROUTES from "../data/routes";
import {useAuth} from "../services/auth/AuthProvider";
import {getAuth, onAuthStateChanged} from "firebase/auth";



export const Navbar:React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    let [isOpen, setIsOpen] = useState(true);
    const [loggedIn, setLogedIn] = useState<boolean>(false)
    let auth = useAuth();

    useEffect(() => {
        //useEffect is used to handle side effects
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            //onAuthStateChanged listens for changes in the user's sign-in state
            if (user) {
                const token = await user.getIdToken();
                setLogedIn(true)
            } else {
                setLogedIn(false)
            }
        });

        //cleanup function to unsubscribe from onAuthStateChanged
        return () => unsubscribe();
    }, []);

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const handleNavigateToLogin = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(ROUTES.LOGIN);
    };

    const performLogout = () => {

        auth?.logout();

    }
    
    const navigation = [
        {name: 'Product', href: '#'},
        {name: 'Features', href: '#'},
        {name: 'Marketplace', href: '#'},
        {name: 'Company', href: '#'},
    ]
    
    return (
        <header className="absolute inset-x-0 top-0 z-50 bg-gray-300">
            {/*flex: Applies Flexbox to the <nav> container, allowing child elements to be positioned in a flexible layout (in this case, horizontally by default).
                   items-center: Aligns all child items (flex items) along the center of the cross-axis, which is vertically centered in a horizontal Flexbox.
                   justify-between: Distributes space between the child items so they are spaced out, with the first item aligned to the start and the last item aligned to the end of the container.
                   p-6: Applies padding of 1.5rem (24px) on all sides of the <nav> element, adding space inside the container.
                   lg:px-8: Adds horizontal padding (px) of 2rem (32px) on large screens and above (lg breakpoint), giving extra padding on the left and right sides when the screen is larger.*/}
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                {/*flex: Applies Flexbox to the <div>, making it a flex container. This allows any child elements inside this <div> to be laid out in a flexible, responsive manner (by default in a row).
                       lg:flex-1: This is a responsive utility that only applies at the lg (large) breakpoint and above. It sets flex: 1 1 0%, which makes the <div>:
                            Grow to fill any available space (flex-grow: 1).
                            Shrink if necessary to fit within the container (flex-shrink: 1).
                            Have an initial size of 0 (flex-basis: 0%), making it flexible to expand based on available space.*/}
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto"
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-green-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6"/>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href}
                           className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                            {item.name}
                        </a>
                    ))}
                </div>

                {!loggedIn && (
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a
                            onClick={handleNavigateToLogin}
                            href="#"  //Keep href="#" but prevent its default behavior
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Log in <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                )}

                {loggedIn && (
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a
                            onClick={performLogout}
                            href="#"
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            <span aria-hidden="true">&larr;</span> Log out
                        </a>
                    </div>
                )}


            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50"/>
                <DialogPanel
                    className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6"/>
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            {!loggedIn && (
                                <div className="py-6">
                                    <a
                                        onClick={handleNavigateToLogin}
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                </div>
                            )}

                            {loggedIn && (
                                <div className="py-6" hidden={!loggedIn}>
                                    <a
                                        onClick={performLogout}
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log out
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>

    );
}