import JSZip from 'jszip';
import { DELIVERABLE_FILES } from '../data/deliverableFiles';

/**
 * Creates and triggers a download of the complete SPA Deliverable ZIP archive
 */
export async function downloadDeliverablesZip(): Promise<void> {
  const zip = new JSZip();

  // Populate files into their respective directory structure
  for (const file of DELIVERABLE_FILES) {
    zip.file(file.path, file.content);
  }

  // Generate binary zip package
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Create temporary anchor to trigger browser download
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'spa-simulation-project.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a single file from the deliverables list
 */
export function downloadSingleFile(filename: string, content: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
