const router = require('koa-router')();
const db = require('../DBHelper');
const crypto = require('crypto');
const uuid = require('node-uuid');
/*
   post format:
   {
    'username': '',
    'password': ''
   }
   status:
   1 => login success,
   0 => wrong password,
   -1 => wrong username
   return password or username for frontend to debug
 */

router.post('/login', async (ctx, next) => {
    let {username, password} = ctx.request.body.content;
    username = username.toString();
    password = password.toString();
    const user = db.get('users').find({username}).value();
    if (user) {
        const sha1 = crypto.createHash('sha1');
        sha1.update(password + user.uuid);
        let encry_password = sha1.digest('hex');
        //check password
        if (encry_password === user.password) {
            let session = uuid.v4();
            db.get('users').find({username}).assign({session}).write();
            ctx.body = {status: 1, message: "Success", session}
        } else {
            ctx.body = {status: 0, message: `wrong password ${encry_password}`, session:"-1"}
        }
    } else {
        ctx.body = {status: -1, message: `wrong username ${username}`, session:"-1"}
    }
});
/* status code:
 -1 : duplicate username
1: success
*/
router.post('/create', async (ctx, next) => {
    let {username, password} = ctx.request.body.content;
    username = username.toString();
    password = password.toString();
    if (db.get('users').find({username}).value()) ctx.body = {status: -1, message: "duplicate username"};
    else {
        const sha1 = crypto.createHash("sha1");
        //hash password
        const uuid_ = uuid.v1();
        sha1.update(password + uuid_);
        password = sha1.digest('hex');
        //add uuid to user
        data = {
            uuid: uuid_,
            password,
            username
        };
        db.get('users')
            .push(data)
            .write();
        ctx.body = {status:1, message: 'success'}
    }
});

router.post('/autologin', async (ctx, next) => {
    let {username, session} = ctx.request.body.content;
    username = username.toString();
    session = session.toString();
    const user = db.get('users').find({username}).value();
    if (!user) ctx.body = {status: -1, message: "wrong username"};
    else {
        if (user.session === session) ctx.body = {status:1, message: 'success'}
        else ctx.body = {status: -1, message: "wrong session"};
    }
});


module.exports = router;
