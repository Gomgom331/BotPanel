import React, { useState } from "react";
import style from "./Notification.module.css"

import Icon from "../Icon/Icon"
import Tooltip from "../Tooltip/Tooltip"
import CustomSelect from "../Input/SelectField/SelectField"
import NotificationItem from "./NotificationItem"

import { useLanguage } from "../../hooks/useLanguage";

export const NOTIFICATION_CATEGORIES = {
    NOTICE: 'announcement',
    APPROVAL_REQUEST: 'approvalRequest',
    SYSTEM: 'system',
    UPDATE: 'update',
};



const Notification:React.FC = () => {
    // 셀렉트
    const [selectedValue, setSelectedValue] = useState<string | number>('new'); // 'new'가 기본값
    // 언어설정
    const { t } = useLanguage();

    // 데이터가 없어 임시 배열 만들기
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.NOTICE,
            date: "2024-11-18 목요일 11:00",
            title: "시스템 점검 안내",
            content: "점검 예정입니다.",
            link: "/notice/1"
        },
        {
            id: 2,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
        {
            id: 3,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
        {
            id: 4,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
        {
            id: 5,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
        {
            id: 6,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
        {
            id: 5,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
        {
            id: 6,
            checkBox: false,
            categoryKey: NOTIFICATION_CATEGORIES.APPROVAL_REQUEST,
            date: "2024-11-18 목요일 11:00",
            title: "가입승인요청",
            content: "가입승인요청함",
        },
    ]);


    // 체크 이벤트 핸들러
    const handleCheckboxChange = async (id: string | number, checked: boolean) => {
        // 상태 업데이트
        setNotifications(prev =>
            prev.map(item => item.id === id ? { ...item, checkBox: checked } : item)
        );
        
        // API 호출
        try {
            await fetch(`/api/notifications/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ checked })
            });
        } catch (error) {
            // 실패시 롤백
            setNotifications(prev =>
                prev.map(item => item.id === id ? { ...item, checkBox: !checked } : item)
            );
        }
    };

    // 삭제 핸들러
    const handleDelete = async (id: string | number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        
        try {
            // API 호출
            await fetch(`/api/notifications/${id}`, {
                method: 'DELETE'
            });
            
            // 상태에서 제거
            setNotifications(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    // 더보기 핸들러
    const handleMoreClick = (id: string | number) => {
        const notification = notifications.find(item => item.id === id);
        if (notification?.link) {
            // 링크로 이동
            window.location.href = notification.link;
            // 또는 React Router 사용 시
            // navigate(notification.link);
        }
    };
        
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
                        <Tooltip
                            content={t('common.seeMore')}
                            placement="right"
                        >
                            <button 
                                type="button"
                                className={`
                                    ${style.addButton}
                                    iconFocus
                                `}
                            >
                                <Icon
                                    name="plus"
                                    size={"1rem"}
                                />
                            </button>
                        </Tooltip>
                        {/* / addButton */}
                    </div>
                    {/* / titleContainer */}
                    <div className={style.selectContainer}>
                        <ul>
                            <li className={style.tagBox}>
                                <button className={`${style.tag} textTag shadowFocus`}>{t('filterTags.all')}&nbsp;<span className="">28</span>{t(`unit.count`)}</button>
                                <button className={`${style.tag} textTag shadowFocus`}>{t(`filterTags.unconfirmed`)}&nbsp;<span className="">4</span>{t(`unit.count`)}</button>
                                <button className={`${style.tag} textTag shadowFocus`}>{t(`filterTags.confirmed`)}&nbsp;<span className="">24</span>{t(`unit.count`)}</button>
                            </li>
                            <li className={style.selectBox}>
                                <CustomSelect
                                    value={selectedValue}
                                    options={[
                                        { value: "new", label: `${t(`sortOptions.latest`)}` },
                                        { value: "old", label: `${t(`sortOptions.oldest`)}` },
                                        { value: "status", label: `${t(`sortOptions.status`)}`}
                                    ]}
                                    onChange={(value) => setSelectedValue(value)}
                                />
                            </li>
                        </ul>
                    </div>
                    {/* selectContainer */}
                </div>
                {/* / fixedBox */}
                <div className={`${style.ItemContainer}`}>
                    {notifications.map(noti => (
                        <NotificationItem
                            key={noti.id}
                            id={noti.id}
                            checkBox={noti.checkBox}
                            category={t(`categories.${noti.categoryKey}`)} // 여기서 번역
                            date={noti.date}
                            title={noti.title}
                            content={noti.content}
                            link={noti.link}
                            onCheckboxChange={handleCheckboxChange}
                            onDelete={handleDelete}
                            onMoreClick={handleMoreClick}
                        />
                    ))}
                </div>
                {/* / ItemContainer */}
            </div>
        </>
    )
}

export default Notification