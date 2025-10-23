// import React ,{ useState, useEffect } from "react"

// 스타일
import localStyle from "./Header.module.css"
import LanguageSelector  from "../LanguageSelector/LanguageSelector"

function useLoadMe() {
    const [user, setUser]
}


const Header:React.FC = () =>{
    return(
        <header>
            <ul>
                <li className={localStyle.columnBox}>
                    <div className={localStyle.profileBox}>
                        <div className={localStyle.profileImg}>
                            <button className={`imgBg ${localStyle.profileImg} `}>
                            </button>
                        </div>
                        <div className={localStyle.profileContent}>
                            <dl>
                                <dt><h1>홍길동</h1><span className="fw700">멤버</span></dt>
                                <dd>소속회사명</dd>
                            </dl>
                        </div>
                    </div>
                    <div className={localStyle.companySelectBox}>
                        
                        <select>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                        </select>
                    </div>
                </li>
                <li className={localStyle.columnBox}>
                    <LanguageSelector />
                </li>
            </ul>
        </header>
    )
}

export default Header