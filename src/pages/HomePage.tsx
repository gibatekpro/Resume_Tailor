import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import ROUTES from "../data/routes";


export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigateToInput = () => {
        // e.preventDefault();  // Prevent default anchor behavior
        navigate(ROUTES.RESUME_INPUT_PAGE);  // Navigate to the practice page
    };

    return (
        <div className="bg-white">
            {/*Be absolutely positioned at the top of the page.
                Span the full width of its container.
                Appear in front of most other elements due to its high z-index of 50.*/}
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
                            Tailor your CV to the job requirements
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            A great tool to help you tailor your cv to a job requirement,
                            while keeping your skills and experience unchanged.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                onClick={handleNavigateToInput}
                                className="cursor-pointer rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </a>
                            <a onClick={handleNavigateToInput} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
                                Generate CV <span aria-hidden="true">→</span>
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