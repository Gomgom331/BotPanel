import React from "react";
import style from "./Footer.module.css";

const Footer: React.FC = () => {
    return(
        <footer className={style.footer}>
            <ul className={style.listBox}>
                <li><a href="" className="textFocus borderFocus">개인정보처리방침</a></li>
                <li>|</li>
                <li><a href="" className="textFocus borderFocus">이용약관</a></li>
                <li>|</li>
                <li><a href="" className="textFocus borderFocus">사업자등록번호</a></li>
                <li>|</li>
                <li><a href="" className="textFocus borderFocus">고객지원</a></li>
                <li>|</li>
                <li><a href="" className="textFocus borderFocus">회원탈퇴</a></li>
            </ul>
        </footer>
    )
}

export default Footer;