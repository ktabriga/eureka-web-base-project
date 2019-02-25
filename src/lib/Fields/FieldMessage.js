import React from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'

const FieldMessage = ({errors, touched}) => {
  if(errors && touched){
    return (
      <div>
        {errors.map((error, index) => 
          <FormHelperText error key={index}>{error}</FormHelperText>)}
      </div>
    )
  }
  
  return null
}

export default FieldMessage

