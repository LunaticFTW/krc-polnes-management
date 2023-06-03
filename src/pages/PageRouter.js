import React, { useState } from "react"

// Pages
import Connection from "./Connection"
import MainMenu from "./MainMenu"
import DaftarPertandingan from "./DaftarPertandingan"
import HasilPertandingan from "./HasilPertandingan"
import AturTim from "./AturTim"
import Pengaturan from "./Pengaturan"
import Pertandingan from "./Pertandingan"

const PageRouter = ()=> {
    const [currentPage, setCurrentPage] = useState("main-menu")
    const [pageData, setPageData] = useState(null)
    const pages = {
        "main-menu": MainMenu,
        "daftar-pertandingan": DaftarPertandingan,
        "atur-tim": AturTim,
        "hasil-pertandingan": HasilPertandingan,
        "pengaturan": Pengaturan,
        "connection": Connection,
        "pertandingan": Pertandingan
    };
    
    const movePage = (page, data = null) => {
        setPageData(data)
        setCurrentPage(page)
    };

    const CurrentPageComponent = pages[currentPage]

    return (
        <div>
          <CurrentPageComponent movePage={movePage} pageData={pageData} />
          {/* <Operator movePage={movePage} pageData={1} /> */}
        </div>
    )
}

export default PageRouter