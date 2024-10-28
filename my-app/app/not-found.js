"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/';
        }, 10000);
        return () => clearTimeout(timer); 
    }, []);

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404 - Page Not Found</h1>
            <p className="not-found-message">
                Sorry, the page you are looking for does not exist.<br/> You will be redirected to the homepage in 10 seconds.
            </p>
            <Link href="/" className="not-found-link">
                <button className="not-found-button">Go to Homepage</button>
            </Link>
        </div>
    );
}
