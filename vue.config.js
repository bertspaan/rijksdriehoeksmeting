module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/rijksdriehoeksmeting'
    : '/',
  pages: {
    index: {
      entry: 'src/client.js',
      template: 'public/index.html',
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page'
    },
    display: {
      entry: 'src/display.js',
      template: 'public/display.html',
      filename: 'display/index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page'
    }
  }
}
