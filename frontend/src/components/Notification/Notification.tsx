import React, { useState } from "react";
import style from "./Notification.module.css"
import Icon from "../Icon/Icon"
import CustomSelect from "../Input/SelectField/SelectField"

import Item from "./NotificationItem"
// import Select from "../Selector"

const Notification:React.FC = () => {

    const [selectedValue, setSelectedValue] = useState<string | number>('new'); // 'new'가 기본값
    
    return(
        <>
            <div className={style.container}>
                <div className={style.fixedBox}>
                    <div className={style.titleContainer}>
                        <div className={style.titleBox}>
                            <div className={style.iconBox}>
                                <Icon
                                    name="title-bell"
                                    color="var(--icon-color-wh)"
                                    size={"1rem"}
                                />
                            </div>
                            {/* / iconBox */}
                            <h1>알림</h1>
                        </div>
                        {/* / titleBox */}
                        <button className={style.addButton}>
                            <Icon
                                name="plus"
                                size={"1rem"}
                            />
                        </button>
                        {/* / addButton */}
                    </div>
                    {/* / titleContainer */}
                    <div className={style.selectContainer}>
                        <ul>
                            <li className={style.tagBox}>
                                <button className={`${style.tag} textTag`}>전체28개</button>
                                <button className={`${style.tag} textTag`}>미확인4개</button>
                                <button className={`${style.tag} textTag`}>확인24개</button>
                            </li>
                            <li className={style.selectBox}>
                                <CustomSelect
                                    value={selectedValue}
                                    options={[
                                        { value: "new", label: "최신순" },
                                        { value: "old", label: "오래된순" },
                                    ]}
                                    onChange={(value) => setSelectedValue(value)}
                                />
                            </li>
                        </ul>
                    </div>
                    {/* selectContainer */}
                </div>
                {/* / fixedBox */}
                <div className={`${style.ItemContainer} scrollBox`}>
                    <Item />
                </div>
                {/* / ItemContainer */}
            </div>
        </>
    )
}

export default Notification