import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import {compose} from 'recompose'
import {Link, withRouter} from 'react-router-dom'

const styles = theme => ({
  menuColor : {
    color: theme.palette.grey[500]
  },
  menuColorActive : {
    color: theme.palette.common.white
  },
  active:{
    borderLeft: `solid 3px ${theme.palette.primary.main}`,
    borderImageSlice: 1
  }
})

class MenuItems extends React.Component {
  renderItem = (item, key) => {
    const active = this.props.location.pathname === item.pathname
   
    return (
      <ListItem
        key={key}
        button
        classes={{root: classNames(active && this.props.classes.active)}}
        component={Link}
        to={item.pathname}>
        <ListItemIcon
          classes={{root: classNames(active ? this.props.classes.menuColorActive : this.props.classes.menuColor)}}>
          <item.icon/>
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          classes={{primary: classNames(active ? this.props.classes.menuColorActive : this.props.classes.menuColor)}}/>
      </ListItem>
    )
  }

  render () {
    const {items = []} = this.props
    return (
      <div>
        { items.map(this.renderItem) }
      </div>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(MenuItems)
