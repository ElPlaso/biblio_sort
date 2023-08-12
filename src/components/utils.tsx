export function renderWithLinks(text: string) {
  // Use non-capturing group to exclude trailing comma and period after a URL
  const urlPattern = /(https?:\/\/[^\s]+)(?<![.,])/g;

  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    const isLink = part.match(urlPattern);
    if (isLink) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          className="text-blue-600 dark:text-blue-400"
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
  const urlPattern = /(https?:\/\/[^\s]+)(?<![.,])/g;
  return text.replace(urlPattern, function (url) {
    return `<a href="${url}">${url}</a>`;
  });
}
