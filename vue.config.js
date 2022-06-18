module.exports = {
    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://172.17.144.172:5555/chat',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        host: 'localhost',
        port: 8081
    },
    lintOnSave: false,
    chainWebpack(config) {
        globalSass(config)
    }
}

const globalSass = config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach((item) => {
        item
            .use('sass-resources-loader')
            .loader('sass-resources-loader')
            .options({
                resources: './src/common/style/index.scss'
            })
            .end()
    })
}