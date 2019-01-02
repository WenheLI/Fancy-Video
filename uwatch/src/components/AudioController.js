import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Stop from '@material-ui/icons/Stop';
import { Config } from '../util/config';

const styles = theme => ({
    card: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    controller: {
        position: 'fixed',
        width: '100%',
        bottom: 56,
        marginBottom: 4,
        [theme.breakpoints.up('md')]: {
            maxWidth: 400,
            bottom: 0,
            right: 0,
            left: 0,
            margin: 'auto'
        },
    }
  });


class AudioController extends React.Component{

    state = {isPlay: true};

    handlePause = () => {
        let player = document.getElementById('audio');
        this.setState({isPlay: !this.state.isPlay});
        if (!this.state.isPlay) player.play();
        else player.pause();
    }

    componentWillUnmount() {
        let player = document.getElementById('audio');
        this.setState({isPlay: false});
        player.pause();
    }

    componentDidMount() {
        let player = document.getElementById('audio');
        if (!this.state.isPlay) player.play();
        else player.pause();
    }

    
    render() {
        const { classes, theme } = this.props;
        return (
            
            <div className={classes.controller}>
                <audio autoPlay id='audio' src={Config.path+this.props.media}>
                </audio>
                <Card className={classes.card}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {this.props.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {this.props.desc}
                    </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                    <IconButton aria-label="Previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>
                    <IconButton aria-label="Play/pause" onClick={this.handlePause}>
                        {!this.state.isPlay ?  <PlayArrowIcon className={classes.playIcon} /> : <Stop className={classes.playIcon} />}
                    </IconButton>
                    <IconButton aria-label="Next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>
                    </div>
                </div>
                <CardMedia
                    className={classes.cover}
                    image={Config.path+this.props.cover}
                />
                </Card>
            </div>
          );
    }
}

export default withStyles(styles, { withTheme: true })(AudioController);
