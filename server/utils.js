const koaBody = require('koa-body');

const body = koaBody({  
    formidable:{
      uploadDir: __dirname.replace('routes/', '') + '/public/uploads', 
      keepExtensions: true 
      },
    multipart: true,
    urlencoded: true,
    })

module.exports = body