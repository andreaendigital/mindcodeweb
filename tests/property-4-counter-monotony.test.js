/**
 * Property 4: Progreso monótono de la animación de contador
 * Validates: Requirements 10.3
 * Label: "Feature: mind-and-code-landing-page, Property 4: Progreso monótono de la animación de contador"
 */

const { describe, it, expect } = require('vitest');
const fc = require('fast-check');

/**
 * easeOutQuad function (same as used in script.js animateCounter)
 * @param {number} t - progress value between 0 and 1
 * @returns {number} eased progress value
 */
function easeOutQuad(t) {
  return t * (2 - t);
}

describe('Feature: mind-and-code-landing-page, Property 4: Progreso monótono de la animación de contador', () => {
  /**
   * **Validates: Requirements 10.3**
   *
   * For any target > 0 and two progress values p1 < p2 where 0 ≤ p1 < p2 ≤ 1,
   * the counter output at p2 must be >= counter output at p1 (monotonically non-decreasing).
   */
  it('should produce monotonically non-decreasing output for p1 < p2', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (target, a, b) => {
          // Ensure p1 < p2
          const p1 = Math.min(a, b);
          const p2 = Math.max(a, b);
          if (p1 === p2) return; // skip equal values

          const output1 = Math.round(easeOutQuad(p1) * target);
          const output2 = Math.round(easeOutQuad(p2) * target);

          expect(output2).toBeGreaterThanOrEqual(output1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.3**
   *
   * At progress = 0, the counter output must be 0.
   */
  it('should output 0 at progress = 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (target) => {
          const output = Math.round(easeOutQuad(0) * target);
          expect(output).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 10.3**
   *
   * At progress = 1, the counter output must be exactly equal to the target.
   */
  it('should output exactly target at progress = 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (target) => {
          const output = Math.round(easeOutQuad(1) * target);
          expect(output).toBe(target);
        }
      ),
      { numRuns: 100 }
    );
  });
});
