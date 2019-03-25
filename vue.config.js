module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tentoonstelling'
    : '/',
  pages: {
    index: {
      entry: 'src/client.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    display: {
      entry: 'src/display.js',
      template: 'public/display/index.html',
      filename: 'display/index.html',
    },
    exhibition: {
      entry: 'src/exhibition.js',
      template: 'public/display/index.html',
      filename: 'exhibition/index.html',
    }
  }
}
