var path = require('path');
var fs = require('fs');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.sass']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.s[ac]+ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  },

  externals: {
    'twitch-ext-helper': 'Twitch.ext',
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 8080,
    index: path.join(__dirname, 'public/index.html'),
    host: 'localhost.rig.twitch.tv',
    https: {
      key: fs.readFileSync('../developer-rig/ssl/selfsigned.key'),
      cert: fs.readFileSync('../developer-rig/ssl/selfsigned.crt')
    },
  }
};
