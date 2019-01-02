import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import { PlayArrow, Stop, Comment, VolumeOff, VolumeUp, VolumeDown, Fullscreen, Send } from '@material-ui/icons';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 6,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendIcon: {
        width: theme.spacing.unit * 6,
        height: '100%', 
        cursor: 'pointer',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        bottom: 0
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 6,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 6,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
        },
    },
});


class ControlPanel extends React.Component {

    state = {quality: 'auto'};


    handleStopAndPlay = () => {
        let flag = this.props.isPlay;
        this.props.handlePlay(!flag);
        if (flag) this.props.player.pause();
        else this.props.player.play();
    };

    handleSend = () => {
        let comment = document.getElementById('comment-input')
        this.props.comments[this.props.currTime] = comment.value;        
        comment.value = '';
    }

    fullScreen = () => {
            let ele = document.getElementById('video-content');
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            } else if (ele.mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            } else if (ele.webkitRequestFullScreen) {
                ele.webkitRequestFullScreen();
            }
        };


    componentWillReceiveProps(nextProps, nextContext) {
        
        const {isPlay} = nextProps;
        if (this.props.player) {
            if (!isPlay) this.props.player.pause();
            else this.props.player.play();
        }
    };

    handleChange = e => {
        this.setState({quality: e.target.value});
        this.props.handleQualityChange(e.target.value);
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant='dense'>
                        <IconButton onClick={this.handleStopAndPlay} className={classes.menuButton} color="inherit" aria-label="Play">
                            {!this.props.isPlay && <PlayArrow />}
                            {this.props.isPlay && <Stop />}
                        </IconButton>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <Comment />
                            </div>
                            <InputBase
                                id='comment-input'
                                placeholder="Leave your comment"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                            <div className={classes.sendIcon}>
                                <IconButton color='inherit' onClick={this.handleSend}>
                                <Send />
                                </IconButton>
                            </div>
                        </div>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit" onClick={() => {
                                let vol = document.getElementById('video-content').volume;
                                if (vol === 0) document.getElementById('video-content').volume = 1;
                                else document.getElementById('video-content').volume = 0;
                            }}>
                                    <VolumeOff />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => {
                                let vol = document.getElementById('video-content').volume - .1;
                                document.getElementById('video-content').volume = vol >= 0? vol : 0
                            }}>
                                    <VolumeDown />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => {
                                let vol = document.getElementById('video-content').volume + .1;
                                document.getElementById('video-content').volume = vol  <= 1? vol  : 1
                            }}>
                                <VolumeUp />
                            </IconButton>
                            <IconButton color="inherit" onClick={this.fullScreen}>
                                <Fullscreen />
                            </IconButton>
                            <Select
                                native
                                value={this.state.quality}
                                onChange={this.handleChange}
                                color='inherit'
                                style={{color: 'white'}}
                            >
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='1080p'>1080p</option>
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='720p'>720p</option>
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='360p'>360p</option>
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='auto'>auto</option>
                            </Select>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton color="inherit" onClick={this.fullScreen}>
                                <Fullscreen />
                            </IconButton>
                            <Select
                                native
                                value={this.state.quality}
                                onChange={this.handleChange}
                                color='inherit'
                                style={{color: 'white'}}
                            >
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='1080p'>1080p</option>
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='720p'>720p</option>
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='360p'>360p</option>
                                <option style={{color: 'rgba(0, 0, 0, 0.87)'}} value='auto'>auto</option>
                            </Select>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(ControlPanel);

