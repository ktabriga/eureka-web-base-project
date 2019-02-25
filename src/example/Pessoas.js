import React from 'react'
import PersonFilter from './PersonFilter'
import {List, CrudForm} from '../lib/CrudComponents'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import {TextField} from 'final-form-material-ui';
import {Field} from 'react-final-form';
import {useParentChildrenNavigation, CrudTabs, CrudRoute} from '../lib/CrudComponents/CrudTabs'

const personListOptions = {
  defaultOrder: 'name',
  fields: {
    name:{
      label: 'Nome'
    },
    birthdate: {
      format: (isoString) => moment(isoString).format('DD/MM/YYYY'),
      label: 'Data de Nascimento'
    }
  }
}

const pessoas = [
  {id: 1, name: 'Alan', peso: 12, ativo: true, birthdate: '2000-08-23'},
  {id: 2, name: 'João', peso: 14, ativo: true, birthdate: '1990-02-03'},
]

const fetchPage = ({rowsPerPage, page, filter}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(
      pessoas
      .filter(p => !filter.name || p.name.includes(filter.name))
      .filter(p => !p.deleted)
    ), 1000)
  })
}
const getCount = () => new Promise(resolve => setTimeout(() => resolve(20), 500))

const deleteItem = (item) => {
  const found = pessoas.filter(p => p.id === item.id)[0]
  found.deleted = true
  const undo = () =>  {
    found.deleted = false
    return Promise.resolve({ok: true})
  }
  return Promise.resolve({ok: true, undo})
}

export const PessoasList = props => (
  <List
    {...props}
    withPaper
    deleteItem={deleteItem}
    filter={PersonFilter}
    onClickEdit={(item) => props.history.push(`/pessoas/${item.id}`)}
    onClickNew={() => props.history.push('/pessoas/new')}
    getPage={fetchPage}
    getCount={getCount}
    listOptions={personListOptions} />
)

const onSave = history => values => {
  return new Promise(resolve =>
    setTimeout(() => {
      pessoas.push({
        id: 1,
        ...values
      })
      history.goBack()
      resolve()
    }, 2000)
  )
}

const getItem = ({match}) => () => {
  return Promise.resolve(
    pessoas.filter(p => +p.id === +match.params.id)[0]
  )
}

export const PessoaForm  = props => (
  <CrudForm
    history={props.history}
    getItem={getItem(props)}
    onSubmit={onSave(props.history)}>
    <Grid container spacing={16}>
      <Grid item sm>
        <Field
          fullWidth
          autoFocus
          component={TextField}
          label='Nome'
          name='name' />
      </Grid>
      <Grid item sm>
        <Field
          fullWidth
          component={TextField}
          label='Dt. Nascimento'
          name='birthdate' />
      </Grid>
    </Grid>
  </CrudForm>
)

const enderecos = [
  {logradouro: 'Av. Londrina', numero: '1466'},
  {logradouro: 'Av. são paulo', numero: '231'},
]
const fetchEnderecos = () => Promise.resolve(enderecos)

const enderecoListOptions = {
  defaultOrder: 'logradouro',
  fields: {
    logradouro:{
      label: 'Logradouro'
    },
    numero: {
      label: 'Número'
    }
  }
}
const EnderecoList = props => (
  <List
    {...props}
    onClicknew={() => props.history.push('/pessoas/idPessoa/enderecoes/new')}
    getPage={fetchEnderecos}
    listOptions={enderecoListOptions} />
)

const onSaveEndereco = history => (values) => {
  enderecos.push(values)
  history.goBack()
}

const EnderecoForm = props => (
  <CrudForm history={props.history} onSubmit={onSaveEndereco(props.history)}>
    <Grid container spacing={16}>
      <Grid item sm>
        <Field
          fullWidth
          component={TextField}
          label='Logradouro'
          name='logradouro' />
      </Grid>
      <Grid item sm>
        <Field
          fullWidth
          component={TextField}
          label='Número'
          name='numero' />
      </Grid>
    </Grid>
  </CrudForm>
)



export function PessoaTabs(props) {
  const {current, navigate} = useParentChildrenNavigation(props, {mainPath: 'pessoas'})

  return (
    <CrudTabs {...props}
      mainPath='pessoas'
      current={current}
      tabs={[
        {value: '', label: 'Pessoa'},
        {value: 'enderecos', label: 'Endereços'},
      ]}
      navigate={navigate}>
      <div>
        <CrudRoute
          render={() => <PessoaForm {...props} withPaper/>}/>
        <CrudRoute
          name='enderecos'
          render={() => <EnderecoList {...props} onClickNew={navigate('newChild')}/>}/>
        <CrudRoute
          name='enderecos'
          isForm
          render={() => <EnderecoForm {...props}/>}/>
      </div>
    </CrudTabs>
  )
}
