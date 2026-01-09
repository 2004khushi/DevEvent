'use client';

import Image from "next/image";
import Link from "next/link";
import { usePostHog } from 'posthog-js/react'

export const Navbar = () => {
    const posthog = usePostHog()

    const handleLogoClick = () => {
        posthog?.capture('logo_clicked', {
            nav_location: 'header'
        });
    };

    const handleNavClick = (linkName: string) => {
        posthog?.capture(`nav_link_clicked`, {
            nav_location: 'header',
            link_text: linkName
        });
    };

    //nav_${linkName.toLowerCase().replace(' ', '_')}_clicked changed this to general nv_link_clicked for analytical optimization, to see total nav clicks

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


//1. Without Parameters (Passing the "Address")
// When you write onClick={handleLogoClick}, you are telling React:
//
// "Hey, here is the location of my function. Don't run it now, just save it. When the user clicks, you go ahead and trigger it."
//
// Logic: You are passing the reference to the function.

// 2. With Parameters (The "Immediate" Trap)
// If you tried to do onClick={handleNavClick('Home')}, it wouldn't work.
//
// Why? Because the () at the end tells JavaScript to run the function right now, as soon as the page loads.
//
// The Result: The events would fire 3 times (once for each link) the second the user opens the site, and the onClick would be left with whatever that function returned (usually undefined), so nothing would happen when the user actually clicks.

