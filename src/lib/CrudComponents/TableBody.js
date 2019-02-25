import React from 'react'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const renderCell = item => field => {
  const {format = x => x} = field
  return (
    <TableCell key={field.source} align={field.type === 'number' ? 'right' : 'left'}>
      {format(item[field.source])}
    </TableCell>
  )
}

export default ({list, fields, onClickEdit, onClickDelete}) => (
  <TableBody>
    {list.map((item, index) => {
      return (
        <TableRow key={index} hover>
          { fields.map(renderCell(item)) }
          <TableCell align='right'>
            {
              onClickEdit && (
                <IconButton
                  aria-label="Editar"
                  onClick={() => onClickEdit(item)}>
                  <EditIcon />
                </IconButton>
              )
            }
            {
              onClickDelete && (
                <IconButton
                  aria-label="Editar"
                  onClick={() => onClickDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              )
            }
          </TableCell>
        </TableRow>
      )
    })}
  </TableBody>
)
