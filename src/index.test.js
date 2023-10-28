const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const progress = require('./index.js')
const path = require("path");


describe('range-thumb', () => {

  const expectedOutput = `
    .range-thumb\\:h-\\[36px\\]::-webkit-slider-thumb {
        height: 36px
    }
    .range-thumb\\:w-\\[54px\\]::-webkit-slider-thumb {
        width: 54px
    }
    .range-thumb\\:h-\\[36px\\]::-moz-range-thumb {
        height: 36px
    }
    .range-thumb\\:w-\\[54px\\]::-moz-range-thumb {
        width: 54px
    }
`;

  it('generates the expected class', async () => {
    willRunTailwindCss().then((css) => {
      expect(css).toContainCss(expectedOutput)
    });
  })
});


const willRunTailwindCss = () => {
  const {currentTestName, testPath} = expect.getState();
  return postcss(tailwindcss({
    // disabling everything but our plugin;
    corePlugins: {preflight: false},
    plugins: [progress],
    // making it thru tailwind tree shaking:
    content: [{raw: String.raw`<input type="range" class="range-thumb:w-[54px] range-thumb:h-[36px]" />`}],
  })).process(['@tailwind base', '@tailwind components', '@tailwind utilities'].join(';\n'), {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
    .then((result) => result.css)
}

expect.extend({
  toContainCss: (received, argument) => {
    const stripped = str => str.replace(/[;\s]/g, '');
    if (stripped(received).includes(stripped(argument))) {
      return {
        message: () => `expected CSS not to contain CSS: ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected CSS \n\n-***********\n${received}\n\n-***********\n to contain CSS: ${argument}`,
        pass: false,
      };
    }
  },
})
