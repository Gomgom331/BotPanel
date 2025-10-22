import React from "react";
import Sprite from "../../assets/icons/sprite.svg"

// svg를 넣어줄때 currentColor로 넣어주기

export type IconName = 
| 'eye' // 눈 on
| 'eye-off' // 눈 off 
| 'loading' // 로딩
| 'close' // 닫기
| 'language' //언어
| 'selectArrow' //select 화살표
| 'hamburger' // 햄버거 
| 'bell' // 알림
| 'bell-active' // 알림 활성화 
| 'logout' // 로그아웃
| 'home' // 집
| 'user' // 유저
| 'contact' // 연락처, 유저연락처
| 'chat' // 챗 ,챗봇
| 'add-btn' // 더하기, 더보기 원형 플러스 버튼
| 'refresh' // 리프래시, 새로고침
| 'forwarding' // 전송, (비행기모양)


interface IconProps {
    name: IconName | string;
    size?: number | string;
    className?: string;
    color?: string
}

const Icon:React.FC<IconProps> = ({ name, size = "1.8rem", className, color = "var(--icon-color)"})=> {
    return(
        <svg
            className={className}
            width={size}
            height={size}
            style={{ color }}
            role="img"
            aria-hidden="true"
        >
            <use href={`${Sprite}#${name}`} />
        </svg>
    )
}

export default Icon
