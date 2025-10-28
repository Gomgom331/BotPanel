import React from "react"

// 스타일
import localStyle from "./Header.module.css"
// 컴포넌트
import LanguageSelector  from "../Selector/LanguageSelector/LanguageSelector"
import CompanySelector from "../Selector/CompanySelector/CompanySelector"

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
                        {/* / profileImg */}
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
                                <dd>{me?.last_viewed_group?.name}</dd>
                            </dl>
                        </div>
                        {/* / profileContent */}
                    </div>
                    {/* / profileBox */}
                </li>
                {/* / columnBox */}
                <li className={localStyle.columnBox}>
                    <div className={localStyle.companySelectBox}>
                        <select>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                            <option value="">아무거나 넣기</option>
                        </select>
                        {/* <CompanySelector /> */}
                    </div>
                    {/* / companySelectBox */}
                    <div>
                        <LanguageSelector />
                    </div>
                </li>
                {/* / columnBox */}
            </ul>
        </header>
    )
}

export default Header