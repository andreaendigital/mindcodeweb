/**
 * Property 2: Completitud de validación de campos obligatorios
 * 
 * Para cualquier combinación de campos obligatorios (nombre, email, rol, cv)
 * estando llenos con datos válidos o vacíos, la validación retorna errores
 * para exactamente el conjunto de campos que están vacíos/inválidos — ni más, ni menos.
 * 
 * **Validates: Requirements 8.5**
 * Label: "Feature: mind-and-code-landing-page, Property 2: Completitud de validación de campos obligatorios"
 */

const fc = require('fast-check');
const { validateField, validateFile } = require('../script');

// ---- Mock field factory ----

/**
 * Creates a mock field object that simulates the interface expected by validateField.
 * @param {object} options
 * @param {string} options.tagName - 'input' or 'select'
 * @param {string} options.value - field value
 * @param {string} options.type - input type ('text', 'email', 'url', etc.)
 * @param {boolean} options.required - whether the field has the 'required' attribute
 */
function createMockField({ tagName = 'input', value = '', type = 'text', required = true }) {
  return {
    tagName: tagName.toUpperCase(),
    value: value,
    type: type,
    hasAttribute: function (attr) {
      if (attr === 'required') return required;
      return false;
    }
  };
}

// ---- Valid data generators ----

// Generates a valid non-empty name (1-100 chars, no leading/trailing whitespace issues)
const validNameArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

// Generates a valid email matching the regex: ^[^\s@]+@[^\s@]+\.[^\s@]+$
const validEmailArb = fc.tuple(
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0 && !s.includes('@') && !s.includes(' ')),
  fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0 && !s.includes('@') && !s.includes(' ') && !s.includes('.')),
  fc.string({ minLength: 2, maxLength: 6 }).filter(s => s.trim().length > 0 && !s.includes('@') && !s.includes(' ') && !s.includes('.'))
).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

// Generates a valid rol selection (non-empty string from predefined options)
const validRolArb = fc.constantFrom(
  'Desarrollo Frontend',
  'Desarrollo Backend',
  'Full Stack',
  'DevOps / SRE',
  'Data Science / Analytics',
  'UX/UI Design',
  'Project/Product Management',
  'QA / Testing',
  'Ciberseguridad',
  'SDR / Ventas TI',
  'Otro'
);

// Generates a valid file (PDF or DOCX, ≤5MB)
const validFileArb = fc.record({
  name: fc.constantFrom('resume.pdf', 'cv.docx'),
  type: fc.constantFrom('application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
  size: fc.integer({ min: 1, max: 5 * 1024 * 1024 })
});

// ---- Property test ----

describe('Feature: mind-and-code-landing-page, Property 2: Completitud de validación de campos obligatorios', () => {
  
  test('For any combination of required fields being valid or empty, validation errors match exactly the set of empty/invalid fields', () => {
    /**
     * **Validates: Requirements 8.5**
     * 
     * Strategy: For each of the 4 required fields (nombre, email, rol, cv),
     * independently decide whether it is filled with valid data or left empty.
     * Then validate all fields and verify that:
     * - Fields with valid data produce no errors (valid: true)
     * - Fields that are empty produce errors (valid: false)
     * - The set of fields with errors equals exactly the set of empty fields
     */
    fc.assert(
      fc.property(
        // For each field, generate either valid data or empty (boolean true = valid, false = empty)
        fc.record({
          nombreFilled: fc.boolean(),
          emailFilled: fc.boolean(),
          rolFilled: fc.boolean(),
          cvFilled: fc.boolean()
        }),
        // When filled, use valid generated data
        validNameArb,
        validEmailArb,
        validRolArb,
        validFileArb,
        (flags, validName, validEmail, validRol, validFile) => {
          // Build field values based on flags
          const nombreValue = flags.nombreFilled ? validName : '';
          const emailValue = flags.emailFilled ? validEmail : '';
          const rolValue = flags.rolFilled ? validRol : '';
          const cvFile = flags.cvFilled ? validFile : null;

          // Create mock fields
          const nombreField = createMockField({ tagName: 'input', value: nombreValue, type: 'text', required: true });
          const emailField = createMockField({ tagName: 'input', value: emailValue, type: 'email', required: true });
          const rolField = createMockField({ tagName: 'select', value: rolValue, type: '', required: true });

          // Validate each field
          const nombreResult = validateField(nombreField);
          const emailResult = validateField(emailField);
          const rolResult = validateField(rolField);
          const cvResult = validateFile(cvFile);

          // Determine expected validity
          const expectedNombreValid = flags.nombreFilled;
          const expectedEmailValid = flags.emailFilled;
          const expectedRolValid = flags.rolFilled;
          const expectedCvValid = flags.cvFilled;

          // Assert: errors match exactly the set of empty/invalid fields
          expect(nombreResult.valid).toBe(expectedNombreValid);
          expect(emailResult.valid).toBe(expectedEmailValid);
          expect(rolResult.valid).toBe(expectedRolValid);
          expect(cvResult.valid).toBe(expectedCvValid);

          // Additionally verify: valid fields have empty error, invalid fields have non-empty error
          if (expectedNombreValid) {
            expect(nombreResult.error).toBe('');
          } else {
            expect(nombreResult.error).not.toBe('');
          }

          if (expectedEmailValid) {
            expect(emailResult.error).toBe('');
          } else {
            expect(emailResult.error).not.toBe('');
          }

          if (expectedRolValid) {
            expect(rolResult.error).toBe('');
          } else {
            expect(rolResult.error).not.toBe('');
          }

          if (expectedCvValid) {
            expect(cvResult.error).toBe('');
          } else {
            expect(cvResult.error).not.toBe('');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
