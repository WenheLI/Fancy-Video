import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import IconButton from "@material-ui/core/IconButton/IconButton";
import CloseIcon from '@material-ui/icons/Close';

class SnackMessager extends Component{

    render() {
        return(
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={this.props.snackState}
                autoHideDuration={3000}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.props.snackMessage}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.props.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        )
    }
}

export default SnackMessager