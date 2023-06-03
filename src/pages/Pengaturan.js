import React from "react"
import Navbar from "./Navbar"

const Pengaturan= ({ movePage })=> {
    return (
        <div id="pengaturan-container">
              <Navbar title={'pengaturan'} back={()=> movePage('main-menu')}/>
        </div>
    )
}

export default Pengaturan