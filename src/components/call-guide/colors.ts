export const partColors = {
  MIKU: '#39c5bbaa',
  RIN: '#ffa500aa',
  LEN: '#ffe211aa',
  LUKA: '#ffc0cbaa',
  KAITO: '#0000ffaa',
  MEIKO: '#d80000aa',
} as const;

export const createGradientWithRinLenBoundary = (parts: string[]) => {
  const colors = parts.map(name => partColors[name as keyof typeof partColors]).filter(Boolean);

  if (colors.length === 0) return '';
  if (colors.length === 1) return colors[0];

  const hasRinAndLen = parts.includes('RIN') && parts.includes('LEN');

  if (!hasRinAndLen) {
    return `linear-gradient(to bottom right, ${colors.join(', ')})`;
  }

  const rinIndex = parts.indexOf('RIN');
  const lenIndex = parts.indexOf('LEN');
  const rinColor = partColors.RIN;
  const lenColor = partColors.LEN;

  if (colors.length === 2) {
    return `linear-gradient(to bottom right, ${rinColor} 0%, ${rinColor} 49%, rgba(255,255,255,0.9) 50%, ${lenColor} 51%, ${lenColor} 100%)`;
  }

  if (colors.length === 3) {
    const otherPart = parts.find(p => p !== 'RIN' && p !== 'LEN');
    const otherColor = partColors[otherPart as keyof typeof partColors];

    if (rinIndex < lenIndex) {
      if (rinIndex === 0 && lenIndex === 1) {
        return `linear-gradient(to bottom right, ${rinColor} 0%, ${rinColor} 32%, rgba(255,255,255,0.9) 33%, ${lenColor} 34%, ${lenColor} 65%, ${otherColor} 66%, ${otherColor} 100%)`;
      } else if (rinIndex === 0 && lenIndex === 2) {
        return `linear-gradient(to bottom right, ${rinColor} 0%, ${rinColor} 32%, ${otherColor} 33%, ${otherColor} 65%, rgba(255,255,255,0.9) 66%, ${lenColor} 67%, ${lenColor} 100%)`;
      } else {
        return `linear-gradient(to bottom right, ${otherColor} 0%, ${otherColor} 32%, ${rinColor} 33%, ${rinColor} 65%, rgba(255,255,255,0.9) 66%, ${lenColor} 67%, ${lenColor} 100%)`;
      }
    } else {
      if (lenIndex === 0 && rinIndex === 1) {
        return `linear-gradient(to bottom right, ${lenColor} 0%, ${lenColor} 32%, rgba(255,255,255,0.9) 33%, ${rinColor} 34%, ${rinColor} 65%, ${otherColor} 66%, ${otherColor} 100%)`;
      } else if (lenIndex === 0 && rinIndex === 2) {
        return `linear-gradient(to bottom right, ${lenColor} 0%, ${lenColor} 32%, ${otherColor} 33%, ${otherColor} 65%, rgba(255,255,255,0.9) 66%, ${rinColor} 67%, ${rinColor} 100%)`;
      } else {
        return `linear-gradient(to bottom right, ${otherColor} 0%, ${otherColor} 32%, ${lenColor} 33%, ${lenColor} 65%, rgba(255,255,255,0.9) 66%, ${rinColor} 67%, ${rinColor} 100%)`;
      }
    }
  }

  return `linear-gradient(to bottom right, ${colors.join(', ')})`;
};
