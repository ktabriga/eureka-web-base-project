import React, {useEffect, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import {Form} from 'react-final-form';



function CrudForm({children, getItem, withPaper, onSubmit, history, classes}) {
  const Container = withPaper ? Paper : (props => <div {...props}/>)
  const [item, setItem] = useState()

  const _getItem = async () => {
    if (getItem) {
      const data = await getItem()
      setItem(data)
    }
  }

  useEffect(() => {
    _getItem()
  })

  return (
    <Container className={classes.root}>
      <Form onSubmit={onSubmit} initialValues={item}>
        {
          ({handleSubmit, submitting}) => (
            <form onSubmit={handleSubmit} >
              <Grid direction='column' container spacing={16}>
                <Grid item>
                  <div className={classes.formContent}>
                    { children }
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Grid justify='flex-end' container spacing={16}>
                    <Grid item classes={{item: classes.buttonContainer}}>
                      <Button fullWidth type='button' onClick={() => history.goBack()}>
                        Cancelar
                      </Button>
                    </Grid>
                    <Grid item classes={{item: classes.buttonContainer}}>
                      <Button fullWidth type='submit' disabled={submitting} variant='contained' color='primary'>
                        {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                        Salvar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )
        }
      </Form>
    </Container>
  )
}
const styles = theme => ({
  formContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  buttonContainer: {
    width: 160
  },
  root: {
    padding: 16,
    marginBottom: 20
  },
  buttonWrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    right: 8,
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    width: 100
  }
})
export default withStyles(styles)(CrudForm)
