import React,{ useState } from "react";
import styles from "./NotificationItem.module.css"
import { useTranslation } from "react-i18next";

import Icon from "../Icon/Icon" //아이콘
import Tooltip from "../Tooltip/Tooltip" //툴팁
import CircleCheckBox from "../Input/CircleCheckBox/CircleCheckBox"


// 알림 컴포넌트 
interface NotificationItemProps {
    id: string | number; //고유 id
    checkBox: boolean; // 확인 체크박스
    category: string; // 카테고리
    date: string | number; // 날짜
    title: string; // 메인 타이틀
    content?: string; // 컨텐츠
    link?: string; // 더보기시 링크 입력
    hasMoreButton?: boolean; // 더보기 버튼
    onCheckboxChange?: (id: string | number, checked: boolean) => void; // 체크박스 변경
    onMoreClick?: (id: string | number) => void; // 더보기 클릭
    onItemClick?: (id: string | number) => void; // 알림 클릭
    onDelete?: (id: string | number) => void; // 삭제 클릭

} 

// 카테고리나 url 별로 다르게 설정하기
const NotificationsItem:React.FC<NotificationItemProps> = ({
    id,
    checkBox = false,
    category,
    date,
    title,
    content,
    link,
    hasMoreButton = false,
    onCheckboxChange,
    onMoreClick,
    onItemClick,
    onDelete,

}) => {

    const [ t ] = useTranslation(); // 언어설정

    return(
        <>
            <div className={`${styles.itemContainer} ${checkBox ? styles.disabled : ''}`}>
                 {/* / checkBox */}
                <ul className={`${styles.listBox}`}>
                    <li className={styles.listItem}>
                        <div className={styles.checkBox}>
                            <CircleCheckBox
                                id={`notification-${id}`}
                                checked={checkBox}
                                onChange={(checked) => onCheckboxChange?.(id, checked)}
                            />
                            <span className={`${styles.category} textTag`}>{category}</span>
                        </div>
                        <Tooltip
                            content={t("common.delete")}
                            placement="right"
                            // overflow 이슈로 미세조정
                            tooltipStyle={{ marginTop: "1.2rem" }}
                            usePortal={true}
                        >
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // 아이템 클릭 이벤트 방지
                                    onDelete?.(id);
                                }}
                                aria-label="알림 삭제"
                                className={`borderFocus ${styles.deleteButton}`}
                            >
                                    <Icon 
                                        name="trash" 
                                        size={"1.2rem"}
                                    />
                            </button>
                        </Tooltip>
                    </li>
                    {/* listItem */}
                    <li className={styles.listItem}>
                        <h2>{title}</h2>
                    </li>

                    {/* 컨텐츠가 있으면 추가 ----------*/}
                    {content && (
                        <li className={styles.listItem}>
                            <p className={styles.content}>{content}</p>
                        </li>
                    )}

                    {/* listItem */}
                    <li className={styles.listItem}>
                        <p>
                            <span><Icon name="clock" size={"1.2rem"} color="var(--color-primary)"/></span>
                            <span className={styles.itemDate}>{date}</span>
                        </p>
                        {/* 더보기 버튼기능이 있으면 추가 ----------*/}
                        {(hasMoreButton || link) && (
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // 아이템 클릭 이벤트 방지
                                    onMoreClick?.(id);
                                }}
                                className={`borderFocus ${styles.addButton}`}
                            >
                                {t("common.seeMore")}
                                <Icon 
                                    name="plus" 
                                    size={"0.7rem"}
                                />
                            </button>
                        )}
                    </li>
                    {/* listItem */}
                </ul>
                {/* / listBox */}
            </div>
            {/* itemContainer */}
        </>
    )

}

export default NotificationsItem;
