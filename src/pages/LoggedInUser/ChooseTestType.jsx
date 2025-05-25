import React from 'react'
import Folder from '../../components/Folder'
import { faBed, faRocket } from '@fortawesome/free-solid-svg-icons'

export default function ChooseTestType() {
  return (
    <div className='flex gap-5 justify-center max-md:flex-col'>
      <Folder path={"/createTest/normal"} text={"على مهلك"} icon={faBed}/>
      <Folder path={"/createTest/time"} text={"انجز نفسك"} icon={faRocket}/>
    </div>
  )
}
