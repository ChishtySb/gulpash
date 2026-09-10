import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className = '' }) => {
  const sanitized = useMemo(() => {
    if (!html) return '';

    let content = html;

    // 1. Un-escape if html was escaped (e.g., &lt;p&gt; or &amp;lt;p&amp;gt;)
    // Repeatedly decode entities so no escaped tags remain as literal text
    for (let i = 0; i < 3; i++) {
      if (content.includes('&lt;') || content.includes('&gt;')) {
        content = content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
      }
    }

    // 2. Strip scripts, styles, iframes, objects, embeds
    content = content.replace(/<(script|style|iframe|object|embed|noscript)[\s\S]*?<\/\1>/gi, '');

    // 3. Remove embedded external images (broken sizing badge images, trust badges)
    content = content.replace(/<img[^>]*>/gi, '');

    // 4. Unwrap or remove div tags while keeping contents
    content = content.replace(/<div[^>]*>\s*<\/div>/gi, '');
    content = content.replace(/<\/?div[^>]*>/gi, '');

    // 5. Strip all attributes from tags except semantic formatting
    content = content.replace(/\s*(?:data-[a-z0-9_-]+|style|class|id|width|height|color|align|valign|role|dir|tabindex)\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^\s>]+)/gi, '');
    content = content.replace(/\s*on[a-z]+\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^\s>]+)/gi, '');

    // 6. Unwrap span tags
    for (let i = 0; i < 3; i++) {
      content = content.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
    }

    // 7. Strip legacy external brand references if any persist
    content = content
      .replace(/Tawakal\s*Closet/gi, 'GulPash')
      .replace(/#TawakalCloset/gi, '#GulPash')
      .replace(/Anabya\s*Garments/gi, 'GulPash')
      .replace(/#AnabyaGarments/gi, '#GulPash')
      .replace(/Tawakal/gi, 'GulPash')
      .replace(/&amp;/g, '&');

    // 8. Normalize redundant nested strong/b tags
    for (let i = 0; i < 2; i++) {
      content = content.replace(/<strong>\s*<strong>/gi, '<strong>').replace(/<\/strong>\s*<\/strong>/gi, '</strong>');
      content = content.replace(/<b>\s*<b>/gi, '<b>').replace(/<\/b>\s*<\/b>/gi, '</b>');
    }

    // 9. Clean empty tags
    for (let i = 0; i < 2; i++) {
      content = content.replace(/<p>\s*(?:<br\s*\/?>|\s|&nbsp;)*<\/p>/gi, '');
      content = content.replace(/<strong>\s*<\/strong>/gi, '');
      content = content.replace(/<b>\s*<\/b>/gi, '');
      content = content.replace(/<li>\s*<\/li>/gi, '');
    }

    // 10. DOMPurify strict whitelist: only semantic text tags, zero scripts, zero iframes, zero attributes
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'br', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: [],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'img', 'svg', 'a', 'div'],
      FORBID_ATTR: ['style', 'class', 'id', 'onclick', 'onerror', 'onload', 'src', 'href']
    });
  }, [html]);

  if (!sanitized) return null;

  return (
    <div
      className={`prose prose-stone max-w-none text-stone-700 leading-relaxed font-light [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_strong]:font-medium [&_strong]:text-stone-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2.5 [&_ul]:space-y-1 [&_li]:text-stone-700 [&_li]:leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};
