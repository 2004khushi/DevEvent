'use client';

import Image from "next/image";
import Link from "next/link";
import posthog from 'posthog-js';

export const Navbar = () => {
    const handleLogoClick = () => {
        posthog.capture('logo_clicked', {
            nav_location: 'header'
        });
    };

    const handleNavClick = (linkName: string) => {
        posthog.capture(`nav_${linkName.toLowerCase().replace(' ', '_')}_clicked`, {
            nav_location: 'header',
            link_text: linkName
        });
    };

    return (
        <header>
            <nav>
                <Link href='/' className='logo' onClick={handleLogoClick}>
                    <Image src="/icons/logo.png" alt="logo" height={24} width={24} />

                    <p>Dev Events</p>
                </Link>

                <ul>
                    <Link href='/' onClick={() => handleNavClick('Home')}>Home</Link>
                    <Link href='/' onClick={() => handleNavClick('Events')}>Events</Link>
                    <Link href='/' onClick={() => handleNavClick('Create Event')}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}
