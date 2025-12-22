
import { width } from '@mui/system'
import React from 'react'

export default function Loader() {
  return (
    <img className="img-fluid" src={require('../../assets/images/loader.gif')} style={{height:40,width:40}}/>
  )
}
 