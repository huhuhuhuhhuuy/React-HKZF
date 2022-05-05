import { Button } from 'antd-mobile';
 const { override, fixBabelImports } = require('customize-cra');
 module.exports = override(
   fixBabelImports('import', {
     libraryName: 'antd-mobile',
     style: 'css',
   }),
 );

 /*config-overrides.js */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireCssModules = require('react-app-rewire-css-modules');
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}


module.exports = function override(config, env) {
    // do stuff with the webpack config...

    //启用ES7的修改器语法（babel 7）
    config = injectBabelPlugin(['@babel/plugin-proposal-decorators', { "legacy": true }], config)   //{ "legacy": true }一定不能掉，否则报错

    //按需加载UI组件
    config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);

    //配置别名，设置@指向src目录
    config.resolve.alias = {
        '@': resolve('src')
    }
    //css模块化
    config = rewireCssModules(config, env);


    return config;
};
