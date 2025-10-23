import React, { useState } from "react";
import { Link } from "react-router-dom";
import localStyle from "./SideBar.module.css";

import Icon from "../Icon/Icon";
import Tooltip from "../Tooltip/Tooltip";

import Menu from "../Menu/Menu";
import Notification from "../Notification/Notification";


type IconItem = {
    name: string;
    tooltip: string;
    link?: string;
    onClick?: () => void;
}

const iconItems: IconItem[] = [
    { name: "logout", tooltip: "로그아웃", link: "/hide" },
    { name: "home", tooltip: "홈 이동", link: "/hide" },
    { name: "user", tooltip: "내정보", link: "/hide" },
    { name: "contact", tooltip: "회사정보", link: "/hide" },
    { name: "chat", tooltip: "챗봇", onClick: () => alert("삭제 클릭!") },
    { name: "add-btn", tooltip: "보기 숨김", link: "/hide" },
];


const SideBar:React.FC = () => {

    const [activeButton, setActiveButton] = useState<'first' | 'second'>('first'); //first가 기본값


    return(
        <div className={localStyle.container}>
            <aside className={localStyle.sidebar}>
                <div className={localStyle.toggleButtonGroup}>
                    <ul>
                        <Tooltip
                                content="메뉴"
                                placement="right"
                        >
                            <li className={`${localStyle.iconBox} ${localStyle.switchBox} ${localStyle.toggleButtonBox}`}>
                                <button
                                    onClick={()=>setActiveButton('first')}
                                    className={`${localStyle.toggleButton} ${activeButton === 'first' ? localStyle.active : ''}`}
                                >
                                    
                                    <Icon 
                                        name="hamburger" 
                                        color={activeButton === 'first' ? "var(--color-white)" : "var(--color-primary)"} 
                                        size="1.4rem"
                                    />
                                </button>
                            </li>
                        </Tooltip>
                        {/* .toggleButtonBox */}
                        <Tooltip
                                content="알림"
                                placement="right"
                        >
                            <li className={`${localStyle.iconBox} ${localStyle.switchBox} ${localStyle.bellButtonBox}`}>
                            
                                {/* 알림이 있을 경우 Icon bell-active로 교체하기 */}
                                <button 
                                    onClick={()=>setActiveButton('second')}
                                    className={`${localStyle.bellButton} ${activeButton === 'second' ? localStyle.active : ''}`} 
                                >
                                    <Icon 
                                        name="bell" 
                                        color={activeButton === 'second' ? "var(--color-white)" : "var(--color-primary)"}
                                        size="1.6rem"
                                    />
                                </button>
                            </li>
                        </Tooltip>
                        
                        {/* .bellButtonBox */}
                    </ul>
                </div>
                {/* .toggleButtonGroup */}
                <div className={localStyle.sidebarMenuIconBox}>
                    <ul>
                        {iconItems.map((item, index) => (
                        <Tooltip content={item.tooltip} placement="right">
                            <li className={localStyle.iconBox} key={index}>
                            
                            {item.link ? (
                                <Link
                                    className={localStyle.iconCircle}
                                    to={item.link}
                                    aria-label={item.tooltip}
                                >
                                    <Icon name={item.name} color="var(--color-primary)" size="1.4rem"/>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    className={localStyle.iconCircle}
                                    aria-label={item.tooltip}
                                    onClick={item.onClick}
                                >
                                    <Icon name={item.name} color="var(--color-primary)" size="1.4rem"/>
                                </button>
                            )}
                            </li>
                        </Tooltip>
                        ))}
                    </ul>
                </div>
                {/* .sidebarMenuIconBox */}
            </aside>
            {/* .sidebar */}
            <aside className={localStyle.sidebarMenu}>
                {activeButton === 'first' ? 
                    <>
                        <div className={localStyle.titleBox}>
                            <img src="/assets/title/title_logo.png" alt="titleLogo" />
                        </div>
                        <div className={localStyle.MenuBox}>
                            <Menu />
                        </div>
                    </> 
                    :
                    <>
                        <h1>second</h1>
                        <Notification />
                    </>
                }
            </aside>
            {/* .sidebarMenu */}
        </div>
        // .container
    )
}

export default SideBar