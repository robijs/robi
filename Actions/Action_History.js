/** RHC-C SharePoint Team */

export default function History(param) {
    const {
        url,
        title
    } = param;

    if (!history.state || history.state.url != url) {
        history.pushState({
            url: url,
            title: title
        }, title, url);
    }

    document.title = title;
}
