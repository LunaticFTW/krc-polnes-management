import React from "react"
import Navbar from "./Navbar"

const HasilPertandingan = ({ movePage })=> {
    return (
        <div id="hasil-pertandingan-container">
              <Navbar title={'pengaturan'} back={()=> movePage('main-menu')}/>
        </div>
    )
}

export default HasilPertandingan