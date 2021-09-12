export default function Action_AddLinks(param) {
    const {
        links,
    } = param;

    const head = document.querySelector('head');

    if (!links) {
        return;
    }

    links.forEach(link => head.append(createLinkElement(link)));
    
    function createLinkElement(link) {
        const {
            rel,
            as,
            href,
            path
        } = link;
        
        const linkElement = document.createElement('link');

        linkElement.setAttribute('rel', rel || 'stylesheet');

        if (as) {
            linkElement.setAttribute('as', as);
        }

        linkElement.setAttribute('href', `${path || ''}${href}`);

        return linkElement;
    }
}