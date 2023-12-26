import React, { Dispatch, SetStateAction } from 'react'
import {AiOutlineCloseSquare} from 'react-icons/ai'

export default function CloseButton({isComment = false} : {isComment? : boolean}) {
  return (
    <AiOutlineCloseSquare className = {`${!isComment && 'absolute'} bg-white hover:bg-sky-300`}/>
  )
}