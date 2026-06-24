import { Bottle } from '../storage/bottleStorage';

export function exportBottlesToCSV(bottles: Bottle[]): string {
  const sorted = [...bottles].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const lines = ['Date;Heure;Quantité (ml);Notes'];

  for (const b of sorted) {
    const d    = new Date(b.timestamp);
    const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const time = `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
    const note = b.notes ?? '';
    const escapedNote = (note.includes(',') || note.includes(';')) ? `"${note}"` : note;
    lines.push(`${date};${time};${b.quantity};${escapedNote}`);
  }

  return lines.join('\n');
}
