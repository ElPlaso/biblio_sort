export function renderWithLinks(text: string) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, function (url) {
        return `<a href="${url}" target="_blank" class='text-blue-600' rel="noopener noreferrer">${url}</a>`;
    });
}

export function renderWithLinksHrefOnly(text: string) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, function (url) {
        return `<a href="${url}">${url}</a>`;
    });
}