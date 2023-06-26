export function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return parts.map((part, index) => {
    const isLink = part.match(/(https?:\/\/[^\s]+)/);
    if (isLink) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          className="text-blue-600"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    } else {
      return part;
    }
  });
}

export function renderWithLinksHrefOnly(text: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, function (url) {
    return `<a href="${url}">${url}</a>`;
  });
}
