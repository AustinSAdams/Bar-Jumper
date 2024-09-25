/* This page is dedicated to 404 errors, or "page not found" erros.
    This should contain a timer to redirect the user back to the homepage
    after a set amount of time.
*/
import Link from 'next/link';

export default function NotFound() {
    return (
        <div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link href="/">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>
            Go to Homepage
          </button>
        </Link>
      </div>
    );
}  