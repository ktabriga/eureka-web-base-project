import React, {useState, useEffect} from 'react'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper'
import {Route} from 'react-router-dom'
import Badge from './Badge'

export const useParentChildrenNavigation = (props, {mainPath}) => {
  const [current, setTab] = useState('')

  const navigate = (target) => () => {
    const {id} = props.match.params
    const {pathname} = props.location
    if (target === 'newChild') {
      return props.history.replace(pathname + '/new-child')
    }
    return props.history.replace(`/${mainPath}/${id}/${target}`)
  }

  useEffect(() => {
    const {pathname} = props.location
    if (pathname.includes('enderecos')) {
      return setTab('enderecos')
    }
    return setTab('')
  })

  return {current, navigate}
}

export const makePathWithMain = mainPath => ({name, isForm} = {}) => {
  if (!name) return `/${mainPath}/:id`
  if (isForm) return `/${mainPath}/:id/${name}/:childId`
  return `/${mainPath}/:id/${name}`
}
const makePath = makePathWithMain('pessoas')
export const CrudRoute = ({name='', isForm, render}) => (
  <Route
    path={makePath({name, isForm})}
    exact
    render={render} />
)
export const CrudTabs = ({current, mainPath, children, navigate, tabs=[], ...props}) => {
  return (
    <div>
      <Paper >
        <div>
          <Tabs indicatorColor='primary' value={current} onChange={(_, value) => navigate(value)()}>
            {
              tabs.map((tab, index) =>
                <Tab key={tab.value} value={tab.value}
                  label={
                    <Badge
                      content={index + 1}
                      disabled={tab.value !== current}
                      primary
                      label={tab.label}/>
                  }/>
              )
            }
          </Tabs>
        </div>
        {children}
      </Paper>
    </div>
  )
}
