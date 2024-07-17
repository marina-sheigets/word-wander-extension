export function getCssLink(url: string): HTMLLinkElement {
    let linkElement = document.createElement("link");

    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("type", "text/css");
    linkElement.setAttribute("href", url);

    return linkElement;
}
