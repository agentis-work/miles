export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeUnknownsAndDefaults: false,
          cleanupIds: false,
        },
      },
    },
    { name: 'sortAttrs' },
    { name: 'removeDimensions' },
  ],
};
