import React from 'react'
import { connect } from 'react-redux'
import { withStyles, withTheme } from '@material-ui/core/styles'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import styles from './AppWrapStyles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Breadcrumb from './Breadcrumb'
import Grid from '@material-ui/core/Grid';
import {compose} from 'recompose'
import CrudLoadingBar from './CrudLoadingBar'
import {actionCreators, isOpenSelector} from './AppWrapRedux'
import UserAvatar from './UserAvatar'
import MenuItems from './MenuItems'


class AppWrap extends React.Component {
  updateDimensions() {
    if(window.innerWidth < this.props.theme.breakpoints.values.md){
      this.props.collapseMenu()
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const {classes, children, logo, history, location, toggleMenu, opened, menuItems} = this.props
    return (
      <div className={classes.root}>
        <div className={classes.loadingBar}>
          <CrudLoadingBar />
        </div>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, opened && classes.appBarShift)} position="absolute">
            <Toolbar disableGutters classes={{root:classes.navBarRoot}}>
              <Grid container>
                <Grid item xs className={classNames(classes.toolsLeft)}>

                  <IconButton aria-label="open drawer"
                    onClick={toggleMenu}
                    className={classNames(classes.menuButton)}>
                    <MenuIcon />
                  </IconButton>

                  <Breadcrumb location={location} history={history}/>
                </Grid>

                <Grid item xs className={classNames(classes.toolsRight)}>
                  <UserAvatar />
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !opened && classes.drawerPaperClose),
            }}
            open={opened}>
            <div className={classes.drawerInner}>
              <div className={classNames(classes.drawerHeader)}>
                <div className={classNames( opened ? classes.drawerLogo : classes.drawerLogoClosed)}>
                  { logo }
                </div>
              </div>
              <Divider />
              <List disablePadding={true}>
                <MenuItems items={menuItems}/>
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <div>
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  opened: isOpenSelector(state)
})

export default compose(
  withStyles(styles),
  withTheme(),
  withRouter,
  connect(mapStateToProps, actionCreators)
)(AppWrap)
