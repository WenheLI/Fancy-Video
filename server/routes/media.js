const router = require('koa-router')();
const db = require('../DBHelper');

router.get('/', async (ctx, next) => {
  let type = ctx.request.querystring.split('=')[1];
  console.log(type);
  let res = await db.get('media').cloneDeep().value();
  console.log(res)
  if (!res) res = [];
  if (!Array.isArray(res)) res = [res];
  res = res.filter((r) => r.type === type);
  res.forEach(element => {
    delete element['media']
  });
  ctx.body = {
      media: res.filter((it) => it.isDone),
      status: 1
  }
});

router.post('/', async (ctx, next) => {
  let {uuid} = ctx.request.body.content;
  const media = await db.get('media').find({uuid}).value();
  if (media) {
    ctx.body = {status: 1, media: media.media, title: media.title, desc: media.desc, cover: media.cover};
  } else {
    ctx,body = {status: -1};
  }
});

module.exports = router;
