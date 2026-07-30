/**
 * Feature: mind-and-code-landing-page, Property 5: Completitud de atributos de accesibilidad
 *
 * Validates: Requirements 12.2
 *
 * This test parses the actual HTML (index.html) and verifies:
 * - Every <img> element has a non-empty alt attribute
 * - Every SVG with role="img" has a non-empty aria-label attribute
 * - Every interactive element (<button>, <a>) that has NO visible text content
 *   (textContent.trim() is empty) has a non-empty aria-label attribute
 *
 * Uses fast-check with fc.constant to wrap the invariant as a property.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const fc = require('fast-check');
const { describe, it, expect } = require('vitest');

// Read and parse the HTML file once
const htmlPath = path.resolve(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

describe('Feature: mind-and-code-landing-page, Property 5: Completitud de atributos de accesibilidad', () => {

  /**
   * **Validates: Requirements 12.2**
   *
   * Property: Every <img> element must have a non-empty alt attribute.
   */
  it('every <img> element has a non-empty alt attribute', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim()).not.toBe('');
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.2**
   *
   * Property: Every SVG with role="img" must have a non-empty aria-label attribute.
   */
  it('every SVG with role="img" has a non-empty aria-label attribute', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const svgsWithImgRole = document.querySelectorAll('svg[role="img"]');
        svgsWithImgRole.forEach((svg) => {
          const ariaLabel = svg.getAttribute('aria-label');
          expect(ariaLabel).not.toBeNull();
          expect(ariaLabel.trim()).not.toBe('');
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.2**
   *
   * Property: Every interactive element (<button>, <a>) that has NO visible text
   * content (textContent.trim() is empty) must have a non-empty aria-label attribute.
   */
  it('every interactive element without visible text has a non-empty aria-label', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const interactiveElements = document.querySelectorAll('button, a');
        interactiveElements.forEach((el) => {
          const textContent = el.textContent.trim();
          if (textContent === '') {
            const ariaLabel = el.getAttribute('aria-label');
            expect(ariaLabel).not.toBeNull();
            expect(ariaLabel.trim()).not.toBe('');
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 12.2**
   *
   * Combined property: All accessibility attributes are complete across the document.
   * This runs a single comprehensive check as a property invariant.
   */
  it('all accessibility attributes are complete (combined invariant)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Check all img elements
        const images = document.querySelectorAll('img');
        images.forEach((img) => {
          const alt = img.getAttribute('alt');
          expect(alt).not.toBeNull();
          expect(alt.trim()).not.toBe('');
        });

        // Check all SVGs with role="img"
        const svgsWithImgRole = document.querySelectorAll('svg[role="img"]');
        svgsWithImgRole.forEach((svg) => {
          const ariaLabel = svg.getAttribute('aria-label');
          expect(ariaLabel).not.toBeNull();
          expect(ariaLabel.trim()).not.toBe('');
        });

        // Check interactive elements without visible text
        const interactiveElements = document.querySelectorAll('button, a');
        interactiveElements.forEach((el) => {
          const textContent = el.textContent.trim();
          if (textContent === '') {
            const ariaLabel = el.getAttribute('aria-label');
            expect(ariaLabel).not.toBeNull();
            expect(ariaLabel.trim()).not.toBe('');
          }
        });
      }),
      { numRuns: 100 }
    );
  });
});
