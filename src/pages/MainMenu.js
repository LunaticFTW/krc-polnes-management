import React from "react"
import Navbar from "./Navbar"
import mainMenuStyle, { mainMenuButtonStyle } from "../styles/mainMenuStyle"
import pageStyle, { bodyContainerStyle } from "../styles/pageStyle"

const MainMenu = ({ movePage }) => {
    
  return (
    <div className={"fixed inset-0 overflow:hidden"}>
      <Navbar title={'KRC Polnes Management'} back={null}/>
      <div id="body-container" className={"bg-blue-100 h-full flex p-16 justify-center"}>
        <div id="main-menu-container" className="flex flex-col">
          <div className="">
            <div className="text-5xl font-black font-sans p-6 text-gray-700">Manajemen Lomba KRC</div>
          </div>
          <div className="bg-blue-300 rounded-xl w-2/3 mx-auto p-6 flex flex-col justify-center">
            <div className="flex justify-center">
              <button className="bg-gray-700 w-full m-1.5 p-3.5 rounded-xl text-white font-semibold hover:bg-gray-500" onClick={()=> {movePage('daftar-pertandingan')}}>
                Daftar Pertandingan
              </button>
            </div>
            <div className="flex justify-center">
              <button className="bg-gray-700 w-full m-1.5 p-3.5 rounded-xl text-white font-semibold hover:bg-gray-500" onClick={()=> {movePage('atur-tim')}}>
                Atur Tim
              </button>
            </div>
            <div className="flex justify-center">
              <button className="bg-gray-700 w-full m-1.5 p-3.5 rounded-xl text-white font-semibold hover:bg-gray-500" onClick={()=> {movePage('pengaturan')}}>
                Pengaturan
              </button>
            </div>
            <div className="flex justify-center">
              <button className="bg-gray-700 w-full m-1.5 p-3.5 rounded-xl text-white font-semibold hover:bg-gray-500" onClick={()=> {movePage('operator')}}>
                Operator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainMenu