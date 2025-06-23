const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          modifyVars: {
            '@primary-color': '#1890ff', // Cambia este color según tu tema
            '@text-color': '#ffffff',
            '@background-color': '#11414',
            '@link-color': '#1d2ba5',     // Color de enlaces
            '@border-color': '#303030'  
          },
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};