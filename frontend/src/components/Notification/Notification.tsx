import React from "react";
import style from "./Notification.module.css"
import Icon from "../Icon/Icon"

const Notification:React.FC = () =>{
    return(
        <>
            <div className={style.titleContainer}>
                <div className="titleBox">
                    <div className="iconBox">
                        <Icon name="plus"/>
                    </div>
                    <h1>알림</h1>
                </div>
                {/* / titleBox */}
                <a className={style.addButton}>
                    <Icon name="plus"/>
                </a>
            </div>
            {/* / titleContainer */}
            <div className={`${style.ItemContainer}`}>
                아이템 리스트 박스
            </div>
            {/* / ItemContainer */}
        </>
    )
}

export default Notification