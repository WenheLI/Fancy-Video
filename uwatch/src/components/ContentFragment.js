import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { getMedia } from '../util/API';
import { Config } from '../util/config';
import { autoLogin } from '../util/API';
import { withRouter } from 'react-router';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    titleBar: {
      background:
        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
      color: 'white',
    },
    imgCover: {
        width: 'auto',
        [theme.breakpoints.up('md')]: {
            width: '100%'
        }
    }
});

class ContentFragment extends React.Component{
    state = {data: []}

    fetchData() {
      getMedia('type='+this.props.mediaType).then((res) => {
        if(res.status === 1) this.setState({data: res.media})
      })
    }
  
    componentDidMount() {
      this.fetchData();
    }
  

    render() {

        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <GridList cellHeight={150} spacing={1} className={classes.gridList} style={{height: '100%', width: '100%', overflow: 'hidden'}}>
                    {this.state.data.map(media => (
                    <GridListTile key={media.title} id={media.desc} cols={media.featured ? 2 : 1} rows={media.featured ? 2 : 1} style={{textAlign: 'center'}} 
                                    onClick={(e) => this.props.selectMedia(media.uuid)}>
                        <img src={Config.path+media.cover} alt={media.title} className={classes.imgCover}/>
                        <GridListTileBar
                        title={media.desc}
                        titlePosition="top"
                        actionIcon={
                            <IconButton className={classes.icon}>
                            <StarBorderIcon />
                            </IconButton>
                        }
                        actionPosition="left"
                        className={classes.titleBar}
                        />
                    </GridListTile>
                    ))}
                </GridList>
            </div>
        );

    }
}

export default withStyles(styles)(withRouter(ContentFragment));