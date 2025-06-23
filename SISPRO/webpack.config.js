
const path = require('path');

module.exports = {
  entry: {
    login: './src/index-login.js', // Archivo de entrada para Login
    bitacoratrabajo: './src/index-bitacoratrabajo.js', // Archivo de entrada para Bitácora de trabajo
    workspace: './src/index-workspace.js', 
    workspacelist: './src/index-workspacelist.js',
    chatBotOpenAI: './src/index-chatbot.js',  
  },
   devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'wwwroot/js'), // Carpeta de salida
    filename: 'bundle-[name].js', // Salida dinámica para cada entrada
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Archivos JS y JSX
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/, // Archivos CSS
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/, // Archivos Less
        use: [
          'style-loader', // Inyecta los estilos en el DOM
          'css-loader', // Interpreta los archivos CSS
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true, // Necesario para que funcione con las variables de Less
              },
            },
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less'] // Asegúrate de que Webpack pueda resolver archivos .less
  }
};
