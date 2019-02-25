import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles';

function CustomSnackbar({autoHideDuration, classes, onClose, message, action=[]}) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right', }}
        open={!!message}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        action={[
          ...action,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
        message={<span id="message-id">{message}</span>}/>
  )
}

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
})

export default withStyles(styles)(CustomSnackbar)
