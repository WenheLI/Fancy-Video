# Fancy Video

## What it is   

### Fancy video is a react based PAW that allow users to watch/upload media content(video and audio) and stream the media content based on the dash protocol. That means it allow users to switch the video quality at any time without any stall.

[Click](https://code.steins.live) to view the online demo.

## Tech Spec

- ``Dash.js`` to support the dash decoding in the front end.
- ``React`` and ``Material-UI`` to build up the front end.
- ``lowdb`` works as a non-relation database for quick prototype.
- ``MP4Box`` and ``ffmpeg`` to encode incoming media file and transform the file into dash file.
- ``crypto.js`` to ensure that the password, username and seesion will be encoded during transimission time.
- Responsive UI

## Screenshots
<table>
    <tr>
        <td ><center><img src="./assets/login_mobile.png" >Login Mobile view </center></td>
        <td ><center><img src="./assets/login_desktop.png"  >Login Desktop view</center></td>
    </tr>
    <tr>
        <td ><center><img src="./assets/main_mobile.png" >Main Mobile view </center></td>
        <td ><center><img src="./assets/main_desktop.png"  >Main Desktop view</center></td>
    </tr>
    <tr>
        <td ><center><img src="./assets/upload_mobile.png" >Upload Mobile view </center></td>
        <td ><center><img src="./assets/upload_desktop.png"  >Upload Desktop view</center></td>
    </tr>
    <tr>
        <td ><center><img src="./assets/video_mobile.png" >Video Mobile view </center></td>
        <td ><center><img src="./assets/video_desktop.png"  >Video Desktop view</center></td>
    </tr>
    <tr>
        <td>
            <center>
                <img src='./assets/audio_play_mobile.png'> Audio play mobile view
            </center>
        </td>
    </tr>
</table>



## How to run locally
Besure to include the ``MP4Box`` and ``ffmpeg`` first.
Also ``yarn`` and ``npm`` are necessary.
```bash
git clone https://github.com/WenheLI/Fancy-Video.git
cd sever
npm && npm start
cd ../uwatch
yarn && yarn start
```

## TODO list

- Danmuku support(live comments)
- Multi media type support
- Live streaming 
- YOLO3 embeded to support danmuku mask.