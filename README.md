# Rijksdriehoeksmeting

Interactive map: http://bertspaan.nl/rijksdriehoeksmeting.

Data: https://github.com/bertspaan/rijksdriehoeksmeting-data

## Run & deploy

This website is made with Vue. To start, run:

    npm run serve

To deploy the website to GitHub Pages, run:

    npm run deploy

Edit [`vue.config.js`](vue.config.js) to edit the [`publicPath`](https://cli.vuejs.org/config/#publicpath), or set the `PUBLIC_PATH` environment variable with the path you want to use.

## IIIF

The website uses [IIIF](https://iiif.io/) and [`srcset`](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/) to fetch and show reponsive images. See the [`IIIFImage`](https://github.com/bertspaan/rijksdriehoeksmeting/blob/master/src/components/IIIFImage.vue) component for more details.
