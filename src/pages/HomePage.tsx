import React, {useState} from "react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Dialog, DialogPanel} from "@headlessui/react";
import {useNavigate} from "react-router-dom";

const navigation = [
    {name: 'Product', href: '#'},
    {name: 'Features', href: '#'},
    {name: 'Marketplace', href: '#'},
    {name: 'Company', href: '#'},
]

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    let [isOpen, setIsOpen] = useState(true);

    function open() {
        setIsOpen(true)
    }

    function close() {
        setIsOpen(false)
    }

    const handleNavigate = () => {
        // e.preventDefault();  // Prevent default anchor behavior
        navigate('/practice');  // Navigate to the practice page
    };

    const handleNavigateToInput = () => {
        // e.preventDefault();  // Prevent default anchor behavior
        navigate('/input');  // Navigate to the practice page
    };

    return (
        <div className="bg-white">
            {/*Be absolutely positioned at the top of the page.
                Span the full width of its container.
                Appear in front of most other elements due to its high z-index of 50.*/}
            <header className="absolute inset-x-0 top-0 z-50">
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
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a
                            onClick={handleNavigate}
                            href="#"  // Keep href="#" but prevent its default behavior
                            className="text-sm font-semibold leading-6 text-gray-900"
                        >
                            Log in <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
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
                                <div className="py-6">
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-50 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div
                            className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                            Announcing our next round of funding.{' '}
                            <a href="#"
                               className="font-semibold text-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-indigo-800">
                                <span aria-hidden="true" className="absolute inset-0"></span>
                                Read more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Data to enrich your online business
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                            Elit
                            sunt amet
                            fugiat veniam occaecat fugiat aliqua.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                onClick={handleNavigateToInput}
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </a>
                            <a href="/input" className="text-sm font-semibold leading-6 text-gray-900">
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
                {/*<Button className="bg-black text-white z-10" onClick={handleNavigate}>*/}
                {/*    Practice*/}
                {/*</Button>*/}
            </div>
            {/*<Button*/}
            {/*    onClick={open}*/}
            {/*    className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"*/}
            {/*>*/}
            {/*    Open dialog*/}
            {/*</Button>*/}
            {/*<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>*/}
            {/*    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">*/}
            {/*        <div className="flex min-h-full items-center justify-center p-4">*/}
            {/*            <DialogPanel*/}
            {/*                transition*/}
            {/*                className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"*/}
            {/*            >*/}
            {/*                <DialogTitle as="h3" className="text-base/7 font-medium text-white">*/}
            {/*                    Payment successful*/}
            {/*                </DialogTitle>*/}
            {/*                <p className="mt-2 text-sm/6 text-white/50">*/}
            {/*                    Your payment has been successfully submitted. We’ve sent you an email with all of the details of your*/}
            {/*                    order.*/}
            {/*                </p>*/}
            {/*                <div className="mt-4">*/}
            {/*                    <Button*/}
            {/*                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"*/}
            {/*                        onClick={close}*/}
            {/*                    >*/}
            {/*                        Got it, thanks!*/}
            {/*                    </Button>*/}
            {/*                </div>*/}
            {/*            </DialogPanel>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Dialog>*/}
        </div>
    );
}