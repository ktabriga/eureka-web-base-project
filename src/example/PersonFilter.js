import React from 'react'
import Grid from '@material-ui/core/Grid'
import {TextField} from 'final-form-material-ui';
import {Field} from 'react-final-form';

export default () => (
  <Grid spacing={24} container>
    <Grid item xs>
      <Field
        fullWidth
        component={TextField}
        label='Nome'
        name="name"/>
    </Grid>
    <Grid item xs>
      <Field
        fullWidth
        component={TextField}
        label='Dt. Nascimento'
        name="birthdate"/>
    </Grid>
  </Grid>
)
