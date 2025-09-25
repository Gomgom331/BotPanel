import React from "react";
import Sprite from "../../assets/icons/sprite.svg"

export type IconName = 
| 'eye' // 눈 아이콘
| 'eye-off'
| 'loading' // 로딩
| 'close' // 닫기

interface IconProps {
    name: IconName;
    size?: number | string;
    className?: string;
    color?: string
}

const Icon:React.FC<IconProps> = ({ name, size = 24, className, color = "var(--icon-color)"})=> {
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
