import React from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableFooter from '@material-ui/core/TableFooter'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from './TableHead'
import TableBody from './TableBody'
import * as R from 'ramda'
import Pagination from './Pagination'
import LinearProgress from '@material-ui/core/LinearProgress';
import {Form} from 'react-final-form'
import filterable from './HOC/filter'
import FilterActions from './FilterActions'
import Snackbar from '../Common/Snackbar'

export default class List extends React.Component {
  state = {
    fields: [],
    list: [],
    loading: true
  }

  constructor(props) {
    super(props)
    const fields = this.createFields()
    this.state = { fields }
    this.FilterForm = this.renderFilter()
  }

  createFields = () => {
    const {fields} = this.props.listOptions
    return R.keys(fields).map(source => {
      const field =  fields[source]
      const {label = source, type, format} = field
      return {
        format,
        label,
        source,
        type
      }
    })
  }

  renderFilter = () => {
    const {filter: FilterForm} = this.props
    if (FilterForm) {
      const EnhancedFilter = ({onClear, ...rest}) => (
        <Form {...rest}>
          {
            ({handleSubmit}) => (
              <Paper style={{padding: 10, marginBottom: 20}}>
                <form onSubmit={handleSubmit}>
                  <FilterForm />
                  <FilterActions onClear={onClear}/>
                </form>
              </Paper>
            )
          }
        </Form>
      )
      return filterable(EnhancedFilter)
    }
    return () => <div />
  }

  urlFilterToObject = filter => {
    if (!filter) return {}
    return filter.split(',')
      .reduce((obj, keyValue) => {
        const [key, value] = keyValue.split('=')
        return {...obj, [key]: value}
      }, {})
  }

  updatePage = async () => {
    const {getPage, getCount, location} = this.props
    const params = new URLSearchParams(location.search)
    if (getPage) {
      this.setState({loading: true})
      const page = +params.get('page') || 0
      const rowsPerPage = +params.get('row') || 10
      const filter = this.urlFilterToObject(params.get('filters'))
      const list = await getPage({page, rowsPerPage, filter})
      this.setState({ list, loading: false })
    }
    if (getCount) {
      const count = await getCount()
      this.setState({ count })
    }
  }

  componentDidMount() {
    this.updatePage()
  }

  async componentDidUpdate(prevProps) {
    const {getPage, location: {search}} = this.props
    if (search === prevProps.location.search)  return
    const params = new URLSearchParams(search)
    if (getPage) {
      this.setState({loading: true})
      const page = +params.get('page') || 0
      const rowsPerPage = +params.get('row') || 10
      const filter = this.urlFilterToObject(params.get('filters'))
      const list = await getPage({page, rowsPerPage, filter})
      this.setState({ list, loading: false })
    }
  }

  handleClickDelete = async (item) => {
    const {deleteItem} = this.props
    if (deleteItem) {
      const {ok, message='Item removed. Do you want to revert it?', undo} = await deleteItem(item)
      if (ok) {
        this.setState({
          removedMessage: message,
          removedItem: item
        })
        this.updatePage()
        this.undo = async () => {
          this.handleSnackbarClose()
          if (undo) {
            await undo()
            this.updatePage()
          }
        }
      }
    }
  }

  undoAction = () => {
    return [
      <Button key="undo" color="secondary" size="small" onClick={this.undo}>
        UNDO
      </Button>
    ]
  }

  handleSnackbarClose = () => {
    this.setState({removedMessage: ''})
  }

  renderList = () => {
    const {listOptions: {defaultOrder = ''}, withPaper, onClickNew, getCount, onClickEdit, labelRowsPerPage, labelNew='New', history, location, deleteItem} = this.props
    const {list = [], loading, removedMessage} = this.state
    const {fields, count=0} = this.state
    const Container = withPaper ? Paper : (props => <div {...props}/>)
    return (
      <Container padding={0}>
        {loading ? <LinearProgress/>: null}
        <Table>
          <TableHead
            defaultOrder={defaultOrder}
            columns={fields}/>
          <TableBody
            onClickEdit={onClickEdit}
            onClickDelete={deleteItem ? this.handleClickDelete : null}
            list={list}
            fields={fields} />
          <TableFooter>
            <TableRow>
              <TableCell align='right' colSpan={2} className="pl-0">
                {
                  getCount && (
                    <Pagination
                      count={count}
                      history={history}
                      location={location}
                      labelRowsPerPage={labelRowsPerPage} />
                  )
                }
              </TableCell>
              <TableCell align='right' colSpan={2} className="pb-25 pt-25">
                <Button variant='contained' color="primary" onClick={onClickNew}>{labelNew}</Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Snackbar message={removedMessage} action={this.undoAction()} onClose={this.handleSnackbarClose} autoHideDuration={4000}/>
      </Container>

    )
  }

  render() {
    const FilterForm = this.FilterForm
    return (
      <div>
        <FilterForm />
        {this.renderList()}
      </div>
    )
  }
}
