/**
 * Dynamically loads the PayHere JavaScript SDK.
 *
 * IMPORTANT: PayHere only has ONE script URL for both sandbox and production:
 *   https://www.payhere.lk/lib/payhere.js
 *
 * Sandbox vs. Live mode is controlled by the `sandbox: true/false` flag
 * in the payment payload object - NOT by a different script URL.
 */

const PAYHERE_SCRIPT_SRC = 'https://www.payhere.lk/lib/payhere.js';
const PAYHERE_SCRIPT_ID = 'payhere-sdk-script';

export const loadPayHereScript = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined (SSR context)'));
      return;
    }

    // Already loaded - resolve immediately
    if ((window as any).payhere) {
      resolve((window as any).payhere);
      return;
    }

    // Script tag already injected but still loading - attach listeners
    const existingScript = document.getElementById(PAYHERE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      const handleLoad = () => {
        if ((window as any).payhere) {
          resolve((window as any).payhere);
        } else {
          reject(new Error('PayHere SDK loaded but did not define window.payhere'));
        }
        cleanup();
      };
      const handleError = () => {
        reject(new Error('Failed to load PayHere SDK script.'));
        cleanup();
      };
      const cleanup = () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);
      return;
    }

    // Inject the script for the first time
    const script = document.createElement('script');
    script.id = PAYHERE_SCRIPT_ID;
    script.src = PAYHERE_SCRIPT_SRC;
    script.async = true;

    script.onload = () => {
      if ((window as any).payhere) {
        resolve((window as any).payhere);
      } else {
        reject(new Error('PayHere SDK loaded but did not define window.payhere'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PayHere SDK script.'));
    };

    document.body.appendChild(script);
  });
};
