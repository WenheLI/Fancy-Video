import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import { create, login, autoLogin } from "../util/API";
import { withRouter } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import blue from '@material-ui/core/colors/blue';
import SnackMessager from './SnackMessager';


const styles = theme => ({
    loginCard: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },

    loginButton: {
        marginTop: theme.spacing.unit * 3,
    },

    main: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },

    input: {
        marginTop: theme.spacing.unit,
    },

    avatar: {
        margin: theme.spacing.unit,
    },

    remember: {
        alignSelf: 'flex-start'
    },

    fabProgress: {
        color: blue[500],
        position: 'absolute',
        top: "50%",
        left: "50%",
        zIndex: 9999
    },
});

class LoginPage extends Component {

    state = {
        username:"",
        password: "",
        snackState: false,
        snackMessage: "",
        isRemember: false,
        loading: false
    };

    componentDidMount() {
        let remember = localStorage.getItem('remember');
        if (remember) {
            this.setState({isRemember: remember !== 'false'});

            let session = localStorage.getItem('session');
            let username = localStorage.getItem('username');

            autoLogin({username, session}).then((it) => {
                if (it.status === 1) {
                    this.props.history.push('/main');
                    this.setState({ snackState: true, snackMessage: 'login'});
                } else {
                    this.setState({ snackState: true, snackMessage: 'session outdate'});
                    localStorage.removeItem('username');
                    localStorage.removeItem('session');
                }
            })
        }
    }

    circulePopup = () => {
        this.setState({loading: true});
    };

    circleClose = () => {
        this.setState({loading: false});
    };

    signIn = () => {
        this.circulePopup();
        if (this.state.username && this.state.password) {
            login({username: this.state.username, password: this.state.password}).then((it) => {
                this.circleClose();
                if (it.status  === -2) this.setState({ snackState: true, snackMessage: 'No internet connection.'});
                else if (it.status !== 1) this.setState({ snackState: true, snackMessage: 'Password or Username username is wrong.'});
                else {
                    this.setState({ snackState: true, snackMessage: 'Log in'});
                    if (this.state.isRemember) {
                        localStorage.setItem('session', it.session);
                        localStorage.setItem('username', this.state.username);
                    }
                    this.props.changeState(it.session, this.state.username);
                    this.props.history.push('/main');
            }
        })
    }
        else {
            this.setState({ snackState: true, snackMessage: 'Password & Username should not be empty.'});
            this.circleClose();
        }
    };

    create = () => {
        this.circulePopup();
        if (this.state.username && this.state.password) {
            create({username: this.state.username, password: this.state.password}).then((it) => {
                this.circleClose();
                if (it.status  === -2) this.setState({ snackState: true, snackMessage: 'No internet connection.'});
                else if (it.status !== 1) this.setState({ snackState: true, snackMessage: 'Duplicate username.'});
                else this.setState({ snackState: true, snackMessage: 'Create success. Please Log in'});
            })
        }
        else {
            this.setState({ snackState: true, snackMessage: 'Password & Username should not be empty.'});
            this.circleClose();
        }
    };

    checkedRemember = (element) => {
        this.setState({isRemember: element.target.checked});
        localStorage.setItem("remember", element.target.checked);
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ snackState: false });
    };


    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.main}>
                <Card className={classes.loginCard}>

                    <Avatar 
                            style={{boxShadow: '0 0 0 0'}}
                            className={classes.avatar}
                            alt="Logo"
                            src="./tv_icon.png"/>

                    <Typography component="h1" variant="h5">
                        Watch
                    </Typography>
                    <TextField
                        onChange={(e) => {this.setState({username: e.target.value})}}
                        className={classes.input} fullWidth label="username"/>
                    <TextField
                        onChange={(e) => {this.setState({password: e.target.value})}}
                        className={classes.input} fullWidth label="password" type="password" />

                    <FormControlLabel
                        style={{boxShadow: '0 0 0 0'}}
                        onChange={this.checkedRemember}
                        className={classes.remember}
                        control={<Checkbox value="remember" color="primary" checked={this.state.isRemember} />}
                        label="Remember me"
                    />

                    <Button
                        onClick={this.signIn}
                        className={classes.loginButton} variant="outlined" color="primary" fullWidth type="submit" >
                        SIGN IN
                    </Button>
                    <Button
                            onClick={this.create}
                            className={classes.loginButton}
                            style={{marginTop: 12 + 'px'}}
                            variant="outlined" color="primary" fullWidth type="submit" >
                        Create
                    </Button>
                </Card>

                <p style={{ 
                            marginTop: 48 + 'px',
                            marginBottom: 32 + 'px',
                            color: 'rgba(0, 0, 0, .54)',
                            textAlign: 'center',
                            fontSize: .875 + 'em'
                        }}>
                    Code with <span role="img" aria-label="Love">❤️</span> by <a style={{textDecoration: 'none', }} href="https://github.com/WenheLI">Eric</a>
                </p>
                
                <SnackMessager snackState={this.state.snackState} snackMessage={this.state.snackMessage} handleClose={this.handleClose}  />

                {this.state.loading && <CircularProgress style={{boxShadow: '0 0 0 0'}} size={68} className={classes.fabProgress} />}
            </div>
        );
    }
}

//Shader

export default withStyles(styles, { withTheme: true })(withRouter(LoginPage));
