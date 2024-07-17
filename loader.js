new class {
    constructor(){
        const target = document.querySelector('HTML');
        const observerSettings = {
            subtree: true,
            childList: true,
        };

        const callback = (mutationList, observer) => {
            if (document.body && window === top) {
                
                        this.#loadScript("top.js");           
                        observer.disconnect();
            } 
        }

        const observer = new MutationObserver(callback);
        observer.observe(target, observerSettings);
    }

    #loadScript(path) {
        const parentElement = document.documentElement;

        let scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src = chrome.runtime.getURL(path);
        scriptElement.setAttribute("charset", "UTF-8");
        scriptElement.setAttribute("defer", "defer");
        parentElement.appendChild(scriptElement);

        if (document.head) {
            document.head.appendChild(scriptElement);
        }
        else {
            document.documentElement.appendChild(scriptElement);
        }
    }

    
}