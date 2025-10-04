'use client';
import { useEffect, useRef, useState } from 'react';
import { LoginForm } from './_components/login-form';
import type { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<UserRole>('citizen');
    const underlineRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const activeTabNode = tabsRef.current[activeTab === 'citizen' ? 0 : 1];
        if (underlineRef.current && activeTabNode) {
             setTimeout(() => {
                underlineRef.current!.style.width = `${activeTabNode.offsetWidth}px`;
                underlineRef.current!.style.left = `${activeTabNode.offsetLeft}px`;
            }, 50)
        }
         const handleResize = () => {
            const activeTabNode = tabsRef.current[activeTab === 'citizen' ? 0 : 1];
            if (underlineRef.current && activeTabNode) {
                underlineRef.current.style.width = `${activeTabNode.offsetWidth}px`;
                underlineRef.current.style.left = `${activeTabNode.offsetLeft}px`;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab]);


    return (
        <div className="relative grid min-h-screen w-full grid-cols-1 text-white lg:grid-cols-2">
            <div className="relative hidden h-full flex-col justify-between p-10 lg:flex bg-background">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-transparent"></div>
                <div className="relative z-10">
                    <a className="flex items-center" href="#">
                        <span className="font-display text-8xl font-bold tracking-tighter text-white">Saaf-Dilli</span>
                    </a>
                </div>
                <div className="relative z-10 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-4xl font-bold text-white/90">"The air we breathe is the symphony of our city. Let's compose a clearer, healthier score, together."</p>
                        <footer className="text-base text-white/60">- An inspired citizen</footer>
                    </blockquote>
                </div>
            </div>

            <div className="flex items-center justify-center p-6 lg:p-8 bg-background">
                <div className="login-card mx-auto flex w-full max-w-md flex-col justify-center space-y-8 rounded-2xl p-8">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-4xl font-bold tracking-tighter text-white">Welcome Back</h1>
                        <p className="text-white/60">Log in to continue the mission.</p>
                    </div>

                    <div className="relative">
                        <div className="flex border-b border-white/10">
                            <button 
                                ref={el => tabsRef.current[0] = el}
                                className={cn("flex-1 py-3 text-center text-sm font-medium transition-colors duration-300", activeTab === 'citizen' ? 'text-white' : 'text-white/60 hover:text-white')}
                                onClick={() => setActiveTab('citizen')}
                            >
                                Citizen
                            </button>
                            <button 
                                ref={el => tabsRef.current[1] = el}
                                className={cn("flex-1 py-3 text-center text-sm font-medium transition-colors duration-300", activeTab === 'policy' ? 'text-white' : 'text-white/60 hover:text-white')}
                                onClick={() => setActiveTab('policy')}
                            >
                                Policymaker
                            </button>
                        </div>
                        <div ref={underlineRef} className="tab-underline"></div>
                    </div>
                    
                    <LoginForm role={activeTab} />
                    
                </div>
            </div>
        </div>
    );
}
