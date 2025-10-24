// import React ,{ useState, useEffect } from "react"

// 스타일
import localStyle from "./Header.module.css"
import LanguageSelector  from "../LanguageSelector/LanguageSelector"
import { useUser } from "../../hooks/useUser"
import { useLanguage } from "../../hooks/useLanguage "


const Header:React.FC = () =>{

    const { me } = useUser();
    const { t } = useLanguage();

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
                                <dt>
                                    <h2>{me?.full_name}</h2>
                                    <span className={`${localStyle.userRole} fw600`}>
                                        {me?.groups.length
                                            ? t(`role.${me.groups[0].role_in_group}`)
                                            : "undefined"}
                                    </span>
                                </dt>
                                <dd>{me?.groups[0].name}</dd>
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