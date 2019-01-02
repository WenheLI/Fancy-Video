import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { VerticalAlignTop, PermMedia, AddPhotoAlternate }  from '@material-ui/icons';
import CardActionArea from '@material-ui/core/CardActionArea';
import Dropzone from 'react-dropzone'
import CircularProgress from '@material-ui/core/CircularProgress';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';

import { upload } from '../util/API';
import SnackMessager from './SnackMessager';

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        height: "100%",
    },

    card: {
        minWidth: 275,
        minHeight: 275,

        [theme.breakpoints.down('md')]: {
            minWidth: '100%',
            width: '100%',
            height: 200,
            minHeight: 200,
            marginDown: 3 * theme.spacing.unit,
        },
    },

    medias: {
        display: 'flex',
        justifyContent: 'space-around',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },

    inputPanel: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing.unit,
        marginTop: 3*theme.spacing.unit
    },

    button: {
        position: 'absolute',
        marginRight: 3*theme.spacing.unit,
        right: 0,
        bottom: 60
    },

    extendedIcon: {
        marginRight: theme.spacing.unit,
    },

    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },

    preview: {
        position: 'absolute',
        zIndex: 99999,
        width: '100%',
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '45%',
        zIndex: 99999,

    },
    hide: {
        display: 'none'
    },
    bluredRoot: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        height: "100%",
        marginTop: 5 * theme.spacing.unit,
        filter: 'blur(10px)'
    },
    typeSelection: {
        margin: 8,
        display: 'flex',
        flexDirection: 'column'
    }
});

class UploadFragment extends React.Component {

    state = {
                isDone: true,
                snackState: false,
                snackMessage: "",
                mediaType: 'video',
            }

    handleUpload = () => {
        let form = new FormData();
        for (let key in this.state){
            if (key === 'media' || key === 'cover') form.append(key, this.state[key]);
        }
        let title = document.getElementById('title').value;
        let desc = document.getElementById('desc').value;
        form.append('title', title);
        form.append('desc', desc);
        
        if(!this.state.media || desc.length === 0 || title.length === 0) this.setState({snackState: true, snackMessage: 'Please ensure media, title and description are all filled.'});
        else {
            this.setState({isDone: false});
            upload(form, '/'+this.state.mediaType).then((res) => {
                if (res.status === 1) {
                    this.setState({isDone: true});
                    this.setState({snackState: true, snackMessage: 'Upload success'});
                } else {
                    this.setState({snackState: true, snackMessage: 'Upload fail'});
                    this.setState({isDone: true});
                }
            }).finally(() => {
                this.setState({media: '', cover: ''});
                document.getElementById('title').value = '';
                document.getElementById('desc').value = '';
            });
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ snackState: false });
    };
    

    render() {
        const { classes } = this.props;
        return (
            <div>
                <CircularProgress className={this.state.isDone? classes.hide : classes.loading} size={48}/>
                <div className={this.state.isDone? classes.root : classes.bluredRoot}>
                    <div className={classes.medias}>
                        <Dropzone className={classes.card} accept={this.state.mediaType+'/*'} onDrop={(a) => {this.setState({media: a[0]})}} >
                                <Card style={{height: '100%'}}>
                                    <CardActionArea className={classes.content}>
                                        <PermMedia fontSize="large" aria-label="Upload Media" />
                                        <CardContent >
                                            <Typography color="textSecondary" gutterBottom>
                                                Click or draw to upload media.
                                            </Typography>
                                        </CardContent>
                                        {this.state.media && <video className={classes.preview} src={URL.createObjectURL(this.state.media)} alt="cover"/>}
                                    </CardActionArea>
                                </Card>
                            </Dropzone>
                            <Dropzone className={classes.card} accept='image/*' onDrop={(a) => {this.setState({cover: a[0]})}} >
                                <Card style={{height: '100%'}}>
                                    <CardActionArea className={classes.content}>
                                        <AddPhotoAlternate fontSize="large" aria-label="Upload Cover" />
                                        <CardContent >
                                            <Typography color="textSecondary" gutterBottom>
                                                Click or draw to upload cover.
                                            </Typography>
                                        </CardContent>
                                        {this.state.cover && <img className={classes.preview} src={URL.createObjectURL(this.state.cover)} alt="cover"/>}
                                    </CardActionArea>
                                </Card>
                            </Dropzone>
                    </div>

                    <div className={classes.inputPanel}>
                        <TextField
                            label="Title"
                            style={{ margin: 8 }}
                            placeholder="Title"
                            helperText="Put title here"
                            margin="normal"
                            variant="outlined"
                            id='title'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Description"
                            style={{ margin: 8 }}
                            placeholder="Description"
                            helperText="Put Description here"
                            margin="normal"
                            variant="outlined"
                            id='desc'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div className={classes.typeSelection}>
                            <InputLabel> Media Type </InputLabel>
                            <Select
                                native
                                value={this.state.mediaType}
                                onChange={(e)=>{this.setState({mediaType: e.target.value})}}
                                input={
                                <OutlinedInput
                                    name="Type"

                                />
                                }
                            >
                                <option value='video'>Video</option>
                                <option value='audio'>Audio</option>
                            </Select>
                        </div>
                    </div>
                    <Button variant="extendedFab" aria-label="Upload" className={classes.button} onClick={this.handleUpload}>
                    <VerticalAlignTop className={classes.extendedIcon} />
                    Upload
                </Button>
                </div>
                <SnackMessager snackState={this.state.snackState} snackMessage={this.state.snackMessage} handleClose={this.handleClose}/>
                
            </div>
        )
    }
}

export default withStyles(styles)(UploadFragment);
