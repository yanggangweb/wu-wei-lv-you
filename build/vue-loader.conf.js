var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'


var loaders = [];

loaders.push.apply(
    loaders,
    utils.cssLoaders({
        sourceMap: isProduction
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: isProduction
    })
)

loaders.push(
    {
        test: /\.jade$/,
        loader: 'jade'
    }
)



module.exports = {
    loaders: loaders,
    postcss: [
        require('autoprefixer')({
            browsers: ['last 2 versions']
        })
    ]
}
