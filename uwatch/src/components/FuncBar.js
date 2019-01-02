import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import { Movie, Audiotrack, CloudUpload }  from '@material-ui/icons';

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
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    mobile: {
        display: 'none',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
        },
    },

    desktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    }
});

class FuncBar extends React.Component{

    valueMapping = {0: 'Video', 1: 'Audio', 2: 'Upload'};
    keyMapping = {'Video' : 0, 'Audio' : 1, 'Upload' : 2}

    state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
        title: 'Video'
    };

    handleIconClick = (it) => {
        this.setState({title: it.currentTarget.id})
        this.props.handleChange('', this.keyMapping[it.currentTarget.id])
    };


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton + " " + classes.desktop} color="inherit" aria-label="Open drawer">
                            {this.state.title}
                        </IconButton>

                        <IconButton className={classes.menuButton + " " + classes.mobile} color="inherit" aria-label="Open drawer">
                            {this.valueMapping[this.props.valueOfBottom]}
                        </IconButton>

                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.sectionDesktop}>
                            <IconButton id='Video' color="inherit" aria-label="Video" onClick={this.handleIconClick}>
                                <Movie />
                            </IconButton>
                            <IconButton id='Audio' color="inherit" aria-label="Audio" onClick={this.handleIconClick}>
                                <Audiotrack />
                            </IconButton>
                            <IconButton id='Upload' color="inherit" aria-label="Upload" onClick={this.handleIconClick}>
                                <CloudUpload />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}


export default withStyles(styles)(FuncBar);