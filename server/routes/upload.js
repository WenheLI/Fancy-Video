const router = require('koa-router')();
const db = require('../DBHelper');
const asyncBusboy =  require('async-busboy');
const fs = require('fs')
const uuid = require('node-uuid');
const FfmpegCommand = require('fluent-ffmpeg');
const path = require('path');
const cp = require('child_process');

const resolution = [1080, 720, 360];
const bitrate = [2650, 1200, 300];

router.post('/video', async (ctx, next) => {
  let res = (await asyncBusboy(ctx.req))
  let {fields, files} = res;
  let uuid_ = uuid.v4()
  let instance = {uuid: uuid_, isDone: false, type: 'video'};
  let isCovered = files.length === 2;
  
  for (let key in fields){
    instance[key] = fields[key]
  }

  let path_ = __dirname.replace('routes', '') + '/public/media/' + instance.uuid + '/';
  fs.mkdirSync(path_);
  
  files.forEach((file) => {
    //download via stream
    let medias = file.mimeType.split('/');
    let normalizedName = uuid_ + '.' + file.filename.split('.')[file.filename.split('.').length-1];
    let upStream = fs.createWriteStream(path_+normalizedName);
    file.pipe(upStream);
    if (medias[0] === 'video') {
      let names = [];
      upStream.on('finish', () => {
        let filenames = normalizedName.split('.');
        let command = new FfmpegCommand(path.join(path_, normalizedName))
                    .noVideo()
                    .outputOptions([ '-ac 2', '-ab 128k'])
                    .on('end', () => {
                      names.push(path.join(path_, filenames[0]+'-audio.mp4'))
                    }) .on('error', function(err, stdout, stderr) {
                      console.log('Cannot process video: ' + err.message);
                      names.push(null);
                    })
                    .output(path.join(path_, filenames[0]+'-audio.mp4'));
        command.run();
  
        for(let index = 0; index < resolution.length; index++) {
          let command = new FfmpegCommand(path.join(path_, normalizedName))
                        .noAudio()
                        .videoCodec('libx264')
                        .videoBitrate(bitrate[index])
                        .size('?x'+resolution[index]).aspect('16:9')
                        .on('end', ()=>{
                          names.push(path.join(path_, filenames[0]+'-'+resolution[index]+'.mp4'))
                          if (resolution.length + 1 === names.length) {
                            cp.exec('MP4Box -dash 2000 -rap -profile dashavc264:live -out '+path_+'video.mpd '+names.join(' '));
                            db.get('media').find({uuid: uuid_}).assign({isDone: true}).write();
                            if (!isCovered) {
                              cp.exec('ffmpeg -i '+path.join(path_,normalizedName)+' -y -f image2 -ss 2 -t 0.001 '+path.join(path_, filenames[0]+'.jpg'));
                            }
                          }
                        })
                        .output(path.join(path_, filenames[0]+'-'+resolution[index]+'.mp4'))
            command.run();
        }
        instance['cover'] = path_.split('/public')[1]+path.join(filenames[0]+'.jpg')
        instance['media'] = path_.split('/public')[1] + 'video.mpd';
      })
    } 
  });

  db.get('media')
    .push(instance)
    .write();
  ctx.body = {status: 1}
});

router.post('/audio', async (ctx, next) => {
  let res = (await asyncBusboy(ctx.req))
  let {fields, files} = res;
  let uuid_ = uuid.v4()
  let instance = {uuid: uuid_, isDone: false, type: 'audio'};
  let isCovered = files.length === 2;
  
  for (let key in fields){
    instance[key] = fields[key];
  }

  let path_ = __dirname.replace('routes', '') + '/public/media/' + instance.uuid + '/';
  fs.mkdirSync(path_);

  files.forEach((file) => {
    let medias = file.mimeType.split('/');
    if (medias[0] === 'image') medias[1] = 'jpg';
    let normalizedName = uuid_ + '.' + medias[1]
    let upStream = fs.createWriteStream(path_+normalizedName);
    file.pipe(upStream);
    
    if (medias[0] === 'audio') {
      let filenames = normalizedName.split('.');
      upStream.on('finish', () => {
      let command = new FfmpegCommand(path.join(path_, normalizedName))
                      .on('end', ()=>{
                        db.get('media').find({uuid: uuid_}).assign({isDone: true}).write();
                      })
                      .output(path.join(path_, filenames[0]+'-coded-'+'.'+'mp3'))
      command.run();
      });
      instance['cover'] = isCovered? path_.split('/public')[1] + path.join(filenames[0]+'.jpg') : '/default_audio.png';
      instance['media'] = path_.split('/public')[1] + filenames[0] +'-coded-' + '.mp3';
    }
  });

  db.get('media')
    .push(instance)
    .write();
  ctx.body = {status: 1}
})

module.exports = router;
