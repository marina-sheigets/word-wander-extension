export const isExtensionContext = () => {
    return (typeof chrome !== 'undefined'
        && !!chrome.storage
        && (window.location.protocol === 'chrome-extension:' || chrome.extension?.getBackgroundPage?.() === window)
    );
}