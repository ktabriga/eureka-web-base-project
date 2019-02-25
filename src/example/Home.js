import React from 'react';
import AppWrap from '../lib/AppWrap'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import {PessoasList, PessoaTabs} from './Pessoas'
import {Route, Switch} from 'react-router-dom'

const menuItems = [
  {
    icon: HomeIcon,
    pathname: `/` ,
    label: 'Home'
  }, {
    icon: PersonIcon,
    pathname: `/pessoas` ,
    label: 'Pessoas'
  }
]


const Home = () => (
  <AppWrap menuItems={menuItems}>
    <Switch>
      <Route path='/pessoas' exact component={PessoasList}/>
      <Route path='/pessoas/:id' component={PessoaTabs}/>
    </Switch>
  </AppWrap>
)

export default Home


