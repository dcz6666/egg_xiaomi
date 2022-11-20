/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1667862712707_5754';

  config.session = {
    key: 'SESSION_ID',
    maxAge: 100 * 1000 * 60,
    httpOnly: true,
    encrypt: true,
    renew: true //延长会话有效期
  }

  // add your middleware config here
  config.middleware = ['adminauth'];
  config.adminauth = {
    match: '/admin'
  }


  //配置 ejs 模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
    }
  };

  //第二种推荐配置方式
  exports.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/eggxiaomi',
      options: {},
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };



  return {
    ...config,
    ...userConfig,
  };
};
