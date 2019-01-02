import { withStyles } from '@material-ui/styles';
import React from 'react';
import FancyVideo from './FancyVideo';
import { withRouter } from 'react-router';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { autoLogin } from '../util/API';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    backButton: {
        marginLeft: -12,
        marginRight: 20,
    },
})

class VideoPage extends React.Component {

    state = {title: ''};

    componentWillMount() {
        let username = localStorage.getItem('username') || this.props.username;
        let session = localStorage.getItem('session') || this.props.session;
    
        if (session && username) autoLogin({session, username})
            .then((it) => {
                if (it.status !== 1 ) this.props.history.push('/');
                else this.setState({session, username});
            });
        else this.props.history.push('/');
    }

    render() {
        const { classes } = this.props;
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton 
                        style={{boxShadow: '0 0 0 0'}}
                        className={classes.backButton} 
                        color="inherit" 
                        onClick={() => {this.props.history.push('/main')}}
                        aria-label="Menu">
                        <ArrowBack />
                    </IconButton>
                    <Typography  style={{boxShadow: '0 0 0 0'}} variant="h6" color="inherit" className={classes.grow}>
                        { this.state.title }
                    </Typography>
                    </Toolbar>
                </AppBar>
                <FancyVideo setTitle={(title) => this.setState({title})} videoId={this.props.match.params.vid} />
            </div>
        )
    }
        
}

export default withStyles(styles)(withRouter(VideoPage));
