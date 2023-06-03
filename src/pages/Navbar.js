import navbarContainerStyle, { navbarTitleContainerStyle, navbarBackButtonContainerStyle, navbarTitleStyle, navbarBackButtonStyle } from "../styles/navbarStyle"

const Navbar = ({title, back})=> {
    const backButton = (<button className={navbarBackButtonStyle} onClick={back}>Kembali</button>)
    
    return (
        <div className={navbarContainerStyle} >
            <div className={navbarTitleContainerStyle}>
                <p className={navbarTitleStyle}>{title}</p>
            </div>
            <div className={navbarBackButtonContainerStyle}>
                {back ? backButton : null}
            </div>
        </div>
    )
}
export default Navbar