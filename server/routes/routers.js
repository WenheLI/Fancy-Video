const router = require('koa-router')();

const auth = require('./auth');
const upload = require('./upload');
const media = require('./media');

router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/upload', upload.routes(), upload.allowedMethods());
router.use('/media', media.routes(), media.allowedMethods());

module.exports = router;
