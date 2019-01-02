import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { autoLogin } from '../util/API';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Movie, Audiotrack, CloudUpload }  from '@material-ui/icons';
import FuncBar from "./FuncBar";
import ContentFragment from "./ContentFragment";
import Upload from "./UploadFragment";
import { queryMedia } from "../util/API";
import AudioController from './AudioController';

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        height: "100%",
        display: "block",
    },

    bottom: {
        flexGrow: 1,
        position: "fixed",
        bottom: 0,
        width: "100%",
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    menuButton: {
        marginLeft: -18,
        marginRight: 10,
    },

});

class MainPage extends Component{

    state = {
                value: 0,
                isPlaying: false,
                audioTitle: '',
                audioDesc: '',
                audioMedia: '',
                audioCover: ''
            };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentWillMount() {
        let username = localStorage.getItem('username') || this.props.username;
        let session = localStorage.getItem('session') || this.props.session;
    
        if (session && username) autoLogin({session, username})
            .then((it) => {
                console.log(session)
                if (it.status !== 1 ) this.props.history.push('/');
                else this.setState({session, username});
            });
        else this.props.history.push('/');
    }

    handleSelectVideo = (uuid) => {
        this.props.history.push('video/'+uuid)
    }

    handleSelectAudio = (uuid) => {
        this.setState({isPlaying: true});
        queryMedia({uuid}).then((e) => {
            if (e.status === 1) {
                this.setState({audioDesc: e.desc, audioMedia: e.media, audioTitle: e.title, audioCover: e.cover});
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <FuncBar valueOfBottom={this.state.value} handleChange={this.handleChange}/>
                {this.state.value === 0 && <ContentFragment mediaType='video'  selectMedia={this.handleSelectVideo} />}
                {this.state.value === 1 && <ContentFragment mediaType='audio'  selectMedia={this.handleSelectAudio} />}
                {this.state.value === 2 && <Upload/>}
                {this.state.isPlaying && this.state.value === 1 && <AudioController title={this.state.audioTitle} 
                                                                        desc={this.state.audioDesc} 
                                                                        media={this.state.audioMedia} cover={this.state.audioCover}/>}
                <BottomNavigation
                    className={classes.bottom}
                    value={this.state.value}
                    onChange={this.handleChange}
                    showLabels
                >
                    <BottomNavigationAction label="Video" icon={<Movie />} />
                    <BottomNavigationAction label="Audio" icon={<Audiotrack />} />
                    <BottomNavigationAction label="Upload" icon={<CloudUpload />} />
                </BottomNavigation>
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(MainPage));
