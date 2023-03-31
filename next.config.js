/** @type {import('next').NextConfig} */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    SECRET: process.env.SECRET
  },
  sassOptions: {
    fiber: false,
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/Workers'
              ),
              to: '../public/Cesium/Workers',
            },
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/ThirdParty'
              ),
              to: '../public/Cesium/ThirdParty',
            },
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/Assets'
              ),
              to: '../public/Cesium/Assets',
            },
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/Widgets'
              ),
              to: '../public/Cesium/Widgets',
            },
          ],
        })
      )
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: process.env.SECRET ? JSON.stringify(`/threejs-cesiumjs-integration/Cesium`) : JSON.stringify('/Cesium'),
      })
    )
    config.resolve.exportsFields = []
    // return {...config, resolve: {...config.resolve, exportsFields:[]}}
    return config
  },
}

module.exports = nextConfig;