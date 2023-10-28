const plugin = require('tailwindcss/plugin')

const rangeThumb = plugin(function ({addVariant, e}) {
  addVariant('range-thumb', ['&::-webkit-slider-thumb', '&::-moz-range-thumb']);
});

module.exports = rangeThumb
