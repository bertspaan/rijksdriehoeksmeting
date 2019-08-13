module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? process.env.PUBLIC_PATH || '/rijksdriehoeksmeting'
    : '/',
  pages: {
    standalone: {
      entry: 'src/standalone.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    client: {
      entry: 'src/client.js',
      template: 'public/tentoonstelling/index.html',
      filename: 'tentoonstelling/index.html'
    },
    display: {
      entry: 'src/display.js',
      template: 'public/tentoonstelling/display/index.html',
      filename: 'tentoonstelling/display/index.html'
    }
  }
}
