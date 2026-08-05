// jsdom does not support adoptedStyleSheets — polyfill for @digdir components
Object.defineProperty(document, 'adoptedStyleSheets', {
  value: [],
  writable: true,
  configurable: true,
})
