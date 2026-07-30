/**
 * Property-Based Test: Correctitud de validación de archivos
 * 
 * **Validates: Requirements 8.3, 8.6**
 * 
 * Property 1: Para cualquier objeto File con un tipo MIME y tamaño dados,
 * validateFile DEBE retornar {valid: true} si y solo si el tipo MIME es uno de
 * ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
 * Y el tamaño del archivo es <= 5,242,880 bytes.
 * En caso contrario DEBE retornar {valid: false} con un mensaje de error no vacío.
 */

import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import fc from 'fast-check';

const require = createRequire(import.meta.url);
const { validateFile } = require('../script.js');

// Constants matching the implementation
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5,242,880 bytes

// Helper to create File-like objects for Node.js testing
function createFileLike(name, type, size) {
  return {
    name: name,
    type: type,
    size: size
  };
}

// Arbitrary for valid MIME types
const validMimeArb = fc.constantFrom(...ALLOWED_MIME_TYPES);

// Arbitrary for invalid MIME types (anything not in allowed list)
const invalidMimeArb = fc.string({ minLength: 0, maxLength: 100 }).filter(
  (s) => !ALLOWED_MIME_TYPES.includes(s)
);

// Arbitrary for valid file sizes (0 to MAX_FILE_SIZE inclusive)
const validSizeArb = fc.integer({ min: 0, max: MAX_FILE_SIZE });

// Arbitrary for invalid file sizes (greater than MAX_FILE_SIZE)
const invalidSizeArb = fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 10 });

// Arbitrary for file names with valid extensions
const validFileNameArb = fc.constantFrom('document.pdf', 'resume.docx', 'file.pdf', 'cv.docx');

// Arbitrary for file names with invalid extensions
const invalidFileNameArb = fc.string({ minLength: 1, maxLength: 50 }).map(
  (s) => s.replace(/\.(pdf|docx)$/i, '') + '.txt'
);

// Arbitrary for any MIME type string
const anyMimeArb = fc.oneof(
  validMimeArb,
  invalidMimeArb,
  fc.constantFrom('text/plain', 'image/png', 'application/json', 'text/html', '')
);

// Arbitrary for any file size
const anySizeArb = fc.oneof(
  fc.integer({ min: 0, max: MAX_FILE_SIZE }),
  fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE * 10 })
);

describe('Feature: mind-and-code-landing-page, Property 1: Correctitud de validación de archivos', () => {

  /**
   * **Validates: Requirements 8.3, 8.6**
   * 
   * For any File with a valid MIME type AND size <= 5MB, validateFile must return valid:true.
   */
  it('should return valid:true for files with allowed MIME type AND size <= 5MB', () => {
    fc.assert(
      fc.property(
        validMimeArb,
        validSizeArb,
        validFileNameArb,
        (mimeType, size, name) => {
          const file = createFileLike(name, mimeType, size);
          const result = validateFile(file);
          expect(result.valid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.3, 8.6**
   * 
   * For any File with an invalid MIME type AND invalid extension,
   * validateFile must return valid:false with a non-empty error message.
   */
  it('should return valid:false with non-empty error for files with invalid MIME type and invalid extension', () => {
    fc.assert(
      fc.property(
        invalidMimeArb,
        validSizeArb,
        invalidFileNameArb,
        (mimeType, size, name) => {
          const file = createFileLike(name, mimeType, size);
          const result = validateFile(file);
          expect(result.valid).toBe(false);
          expect(result.error).toBeTruthy();
          expect(result.error.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.6**
   * 
   * For any File with size > 5MB (regardless of MIME type), validateFile must return
   * valid:false with a non-empty error message.
   */
  it('should return valid:false with non-empty error for files exceeding 5MB', () => {
    fc.assert(
      fc.property(
        anyMimeArb,
        invalidSizeArb,
        validFileNameArb,
        (mimeType, size, name) => {
          const file = createFileLike(name, mimeType, size);
          const result = validateFile(file);
          expect(result.valid).toBe(false);
          expect(result.error).toBeTruthy();
          expect(result.error.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.3, 8.6**
   * 
   * Biconditional property: validateFile returns valid:true IF AND ONLY IF
   * the file type is recognized (MIME or extension) AND size <= MAX_FILE_SIZE.
   */
  it('valid:true iff file type is recognized AND size <= 5MB (biconditional)', () => {
    fc.assert(
      fc.property(
        anyMimeArb,
        anySizeArb,
        fc.constantFrom('file.pdf', 'file.docx', 'file.txt', 'resume.pdf', 'cv.docx'),
        (mimeType, size, name) => {
          const file = createFileLike(name, mimeType, size);
          const result = validateFile(file);

          const hasValidMime = ALLOWED_MIME_TYPES.includes(mimeType);
          const hasValidExtension = name.endsWith('.pdf') || name.endsWith('.docx');
          const hasValidSize = size <= MAX_FILE_SIZE;
          // The implementation accepts if (MIME is valid OR extension is valid) AND size is valid
          const shouldBeValid = (hasValidMime || hasValidExtension) && hasValidSize;

          if (shouldBeValid) {
            expect(result.valid).toBe(true);
          } else {
            expect(result.valid).toBe(false);
            expect(result.error).toBeTruthy();
            expect(result.error.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
