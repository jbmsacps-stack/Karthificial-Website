/**
 * Clerk Authentication Initialization
 * Mounts Clerk sign-in and sign-up components to their respective divs
 * Uses the CLERK_PUBLISHABLE_KEY from config.js
 */

// Wait for Clerk to be loaded on the window object
async function initializeClerk() {
    try {
        // Check if Clerk is available
        if (!window.Clerk) {
            console.error('Clerk failed to load from CDN');
            return;
        }

        console.log('Clerk loaded successfully');

        // Initialize Clerk with the publishable key
        await window.Clerk.load({
            publishableKey: CLERK_PUBLISHABLE_KEY,
        });

        console.log('Clerk initialized with publishable key');

        // Mount sign-in component if the mount point exists
        const signInElement = document.getElementById('clerk-sign-in');
        if (signInElement) {
            console.log('Mounting Clerk sign-in component...');
            await window.Clerk.mountSignIn(signInElement, {
                redirectUrl: '/',
            });
            console.log('Clerk sign-in component mounted successfully');
        }

        // Mount sign-up component if the mount point exists
        const signUpElement = document.getElementById('clerk-sign-up');
        if (signUpElement) {
            console.log('Mounting Clerk sign-up component...');
            await window.Clerk.mountSignUp(signUpElement, {
                redirectUrl: '/',
            });
            console.log('Clerk sign-up component mounted successfully');
        }

        // If neither component exists, log a warning
        if (!signInElement && !signUpElement) {
            console.warn('No Clerk mount points found (clerk-sign-in or clerk-sign-up divs)');
        }

    } catch (error) {
        console.error('Error initializing Clerk:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Initialize Clerk when the DOM is ready
if (document.readyState === 'loading') {
    // If the document is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeClerk);
} else {
    // If the document is already loaded, initialize immediately
    initializeClerk();
}
