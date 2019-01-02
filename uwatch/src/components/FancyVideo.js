import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import ControlPanel from "./ControlPanel";
import dashjs from 'dashjs';
import { queryMedia } from '../util/API';
import { withRouter } from 'react-router';
import { Config } from '../util/config';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    controlPanel: {

    },

    videoContent: {
        width: '100%',
        maxWidth: 1080
    },

    video: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },

    process: {
        height: 2,
        '&:hover': {
            height:6
        },
    },

    buttonPanel: {
        display: 'flex',
        backgroundColor: 'rgb(0,0,0,.67)'
    },

    comments: {
        width: '100%',
        zIndex: 9999,
        textAlign: 'center'
    },

    loading: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 99999,

    },
    hide: {
        display: 'none'
    },

});


class FancyVideo extends React.Component{
    state = {
                completed: 0,
                isPlay: false,
                isDone: false,
                comment: [],
                title: ''
            };

    player = null;

    comments = {};

    currTime = 0;

    qualityMap = {'360p': 0, '720p': 1, '1080p': 2};

    keyboardEvent = (e) => {
        let video = document.getElementById('video-content');
        let vol = video.volume;
        if (e.key === 'ArrowUp') {
            vol = vol + .1 >= 1 ? 1 : vol + .1
            video.volume = vol
        } else if (e.key === 'ArrowDown') {
            vol = vol - .1 <= 0 ? 0 : vol - .1
            video.volume = vol
        } else if (e.key === 'ArrowLeft') {
            let curr = video.currentTime;
            curr = curr - 5 >= 0 ? curr - 5 : 0;
            this.player.seek(curr);
        } else if (e.key === 'ArrowRight') {
            let curr = video.currentTime;
            curr = curr + 5 <= video.duration ? curr + 5 : video.duration;
            this.player.seek(curr);
        } else if (e.key === ' ') {
            this.setState({isPlay: !this.state.isPlay});
        }
    }

    componentDidMount() {
        let video = document.getElementById('video-content');
        
        this.player = dashjs.MediaPlayer().create();

        this.player.on(dashjs.MediaPlayer.events.CAN_PLAY, ()=> {this.setState({isDone: true})});

        video.ontimeupdate =  () => {
            let curr = video.currentTime;
            this.currTime = curr;
            let duration = video.duration;
            let v = 100*(curr/duration);
            this.setState({completed: v});


        }

        document.onkeydown = (e) => {
           this.keyboardEvent(e);
        }

        queryMedia({uuid: this.props.videoId}).then((e) => {
            if (true) {
                let url = Config.path + e.media;
                this.player.initialize(document.getElementById('video-content'), url, true);
                this.props.setTitle(e.title);
            } 
        })
    }


    componentWillUnmount() {
        this.player.pause();
        document.onkeydown = null;
    }

    processClick = () => {
        let clickX = window.event.offsetX
        let video = document.getElementById('video-content');
        let v = clickX/video.offsetWidth;
        this.setState({completed: v*100});
        this.player.seek((v) * video.duration);
    };

    handleQualityChange = (quality) => {
        if (quality === 'auto') this.player.setAutoSwitchQualityFor('video', true);
        else {
            this.player.setAutoSwitchQualityFor('video', false);
            this.player.setQualityFor('video', this.qualityMap[quality]);
        }
    }


    render() {
        const { classes } = this.props;

        return(
            <div  className={classes.root}>
                <div className={classes.video}>
                    <CircularProgress className={this.state.isDone? classes.hide : classes.loading} size={48}/>
                    <div className={classes.comments}>
                        <video onClick={() => {this.setState({isPlay: !this.state.isPlay})}} id='video-content' className={classes.videoContent}/>
                    </div>
                    <div className={classes.controlPanel}>
                        <LinearProgress onClick={this.processClick} className={classes.process} variant="determinate" value={this.state.completed} />
                        <ControlPanel player={this.player} isPlay={this.state.isPlay} handlePlay={(isPlay) => {this.setState({isPlay})}} handleQualityChange={this.handleQualityChange}/>
                    </div>
                </div>
            </div>
        )
    }
}


export default withStyles(styles)(FancyVideo);