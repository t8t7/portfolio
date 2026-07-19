/**
 * Auto-discovers evidence screenshots from docs/ispring.
 * Add new .png / .jpg / .webp files to that folder — they appear in the gallery after rebuild/dev refresh.
 */
const modules = import.meta.glob('../../docs/ispring/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export interface IspringMediaItem {
  id: string;
  src: string;
  fileName: string;
}

function fileNameFromPath(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] ?? path;
}

export const ispringMedia: IspringMediaItem[] = Object.entries(modules)
  .map(([path, src]) => {
    const fileName = fileNameFromPath(path);
    return {
      id: fileName,
      src,
      fileName,
    };
  })
  .sort((a, b) =>
    a.fileName.localeCompare(b.fileName, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );

/** Split media across N titled groups until real categories exist. */
export function distributeIspringMedia(groupCount: number): IspringMediaItem[][] {
  const groups = Array.from({ length: Math.max(groupCount, 1) }, () => [] as IspringMediaItem[]);

  ispringMedia.forEach((item, index) => {
    groups[index % groups.length].push(item);
  });

  return groups;
}
