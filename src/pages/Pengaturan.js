import React from "react"
import Navbar from "./Navbar"

const Pengaturan= ({ movePage })=> {
    return (
        <div className={"fixed flex flex-col h-screen inset-0 overflow-hidden"}>
            <Navbar title={'pengaturan'} back={()=> movePage('main-menu')}/>
            <div className={"w-full flex justify-center flex-1 py-28"}>
                <div className="w-2/4 flex flex-col">
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2">Durasi Pertandingan</div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2">Waktu Persiapan</div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2">Penambahan per Point</div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2">Pengurangan per Retry</div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2">Jumlah Point Maksimal</div>
                    <div className="font-bold text-xl text-gray-700 bg-white border-2 border-gray-700 py-1 px-5 my-2">Jumlah Checkpoint Maksimal</div>
                    <div className="flex justify-center py-10">
                        <div className="inline-block py-2 px-4 mx-2 rounded-xl font-bold text-white bg-blue-500">SIMPAN</div>
                        <div className="inline-block py-2 px-4 mx-2 rounded-xl font-bold text-white bg-red-600">RESET</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pengaturan