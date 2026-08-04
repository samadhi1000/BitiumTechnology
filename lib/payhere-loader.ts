/**
 * Dynamically loads the PayHere JavaScript SDK.
 * Supports sandbox or production depending on the payload/configuration.
 */
export const loadPayHereScript = (sandbox: boolean): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    if ((window as any).payhere) {
      resolve((window as any).payhere);
      return;
    }

    const scriptId = 'payhere-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (script) {
      // Script is already in DOM but payhere is not loaded yet (maybe still downloading)
      // Listen to load/error events on the existing script
      const handleLoad = () => {
        if ((window as any).payhere) {
          resolve((window as any).payhere);
        } else {
          reject(new Error('PayHere SDK did not define payhere on window.'));
        }
        cleanup();
      };

      const handleError = () => {
        reject(new Error('Failed to load PayHere SDK script.'));
        cleanup();
      };

      const cleanup = () => {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
      };

      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
      return;
    }

    // Otherwise, create and inject the script
    script = document.createElement('script');
    script.id = scriptId;
    script.src = sandbox 
      ? 'https://sandbox.payhere.lk/lib/payhere.js' 
      : 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).payhere) {
        resolve((window as any).payhere);
      } else {
        reject(new Error('PayHere SDK did not define payhere on window.'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PayHere SDK script.'));
    };

    document.body.appendChild(script);
  });
};
