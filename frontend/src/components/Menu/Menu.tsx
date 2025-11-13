
import React, { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMenuItem } from "../../hooks/useMenuItem";

import Icon from "../Icon/Icon"
import Collapsible from "../Collapsible/Collapsible"; // 메뉴 애니메이션

import styles from "./Menu.module.css";



// 훅에서 사용하는 타입과 동일하게 정의
// 메뉴 아이템 ------------------------------------------------------
type MenuItem = {
    id: number; // id
    kind: "item" | "group"; // 자식 or 링크 유무
    label: string; // 메뉴명
    path: string; // 링크
    order: number; // 메뉴순서
    external: boolean; // 외부 api 유무
    external_url?: string | null; // 외부 api 링크
    children?: MenuItem[]; // 자식
};

interface SidebarNodeProps {
    node: MenuItem;
    depth: number; // 깊이
    currentPath: string; //링크
    openIds: Set<number>; // 열려 있는 그룹 id 집합 (메뉴)
    onToggleGroup: (node: MenuItem) => void; //그룹 토글 이벤트
}


// 메뉴 아이템 애니메이션
const collectGroupIds = (node: MenuItem, acc: number[] = []): number[] => {
    if (node.kind === "group"){
        acc.push(node.id);
    }
    if(node.children){
        node.children.forEach((child) => collectGroupIds(child, acc));
    }
    return acc;
};



// 개별 메뉴 노드 (group / item 재귀 렌더링)
const SidebarNode: React.FC<SidebarNodeProps> = ({
    node,
    depth,
    currentPath,
    openIds,
    onToggleGroup,
}) => {

    // depth에 따라 style이 다름
    const depthClass = 
        depth === 0
        ? styles.depth1
        : depth === 1
        ? styles.depth2
        : styles.depth3;

    
    // 그룹, 아이템, 토글 여부
    const isGroup = node.kind === "group";
    const hasChildren = !!node.children?.length;
    const isOpen = openIds.has(node.id);

    // 토글 아이콘
    // 0 = depth 1 => 위아래 화살표
    // 1~ = depth 2~ => + / - 아이콘 계열
    let toggleIcon: React.ReactNode = null;

    if(isGroup && hasChildren ){
        if (depth === 0){
            toggleIcon = (
                <Icon
                name="chevronRight"
                size={9}
                color={"var(--text-body)"}
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                />
            );
        } else{
            toggleIcon = (
                <Icon
                    name={isOpen ? "minus" : "plus"}
                    size={isOpen ? 14 : 9 } //사이즈 조절
                />
            );
        }
    }

    // ---------------------------
    // 그룹 노드 (하위 메뉴 묶음)
    // ---------------------------
    if (node.kind === "group") {
        return (
            <div className={`${styles.group} ${styles.depthItem} ${depthClass}`}>
                {/* 그룹 헤더 라인: 아이콘 박스 + 라벨 */}
                <button
                    type="button"
                    className={styles.itemWrapper}
                    onClick={() => hasChildren && onToggleGroup(node)}
                >
                    {/* 공통 아이콘 박스 (모든 메뉴가 같은 폭을 가지도록) */}
                    <div className={styles.itemIcon}>
                        {/* 그룹이고 children이 있는 경우에만 토글 아이콘 표시 */}
                        {toggleIcon}
                    </div>

                    {/* 그룹 제목 */}
                    <div className={`${styles.itemTitle} ${styles.groupLabel}`}>
                        {node.label}
                    </div>
                </button>
                
                {/* 그룹 자식 메뉴 */}
                {hasChildren && (
                <Collapsible isOpen={isOpen}>
                    <div className={styles.groupChildren}>
                    {node.children!.map((child) => (
                        <SidebarNode
                        key={child.id}
                        node={child}
                        depth={depth + 1}
                        currentPath={currentPath}
                        openIds={openIds}
                        onToggleGroup={onToggleGroup}
                        />
                    ))}
                    </div>
                </Collapsible>
                )}
            </div>
        );
    }

    // ---------------------------
    // item 노드 (실제 링크)
    // ---------------------------
    const href = node.external ? node.external_url ?? "#" : node.path || "#";
    
    const rowClass = [styles.item, depthClass].join(" ");

    if (node.external) {
        // 외부 링크
        return (
            <a href={href} className={rowClass} target="_blank" rel="noreferrer">
            <div className={styles.itemIcon} />
            <div className={styles.itemTitle}>{node.label}</div>
        </a>
        )}
        // 내부 라우팅 (react-router Link)
        return (
            <Link to={href} className={rowClass}>
                <div className={styles.itemIcon}>
                {/* 나중에 아이콘 있으면 여기 */}
                </div>
                <div className={styles.itemTitle}>{node.label}</div>
            </Link>
        );
};


// 전체 메뉴 컴포넌트 ------------------------------------------------------
const Menu: React.FC = () => {
const { menu, loading } = useMenuItem(); // 아이템 로딩
const location = useLocation(); 

// 열려있는 그룹 아이디 관리
const [openIds, setOpenIds] = useState<Set<number>>(() => new Set());

// 그룹 토글 핸들러
const handleToggleGroup = useCallback((node: MenuItem) => {
    setOpenIds((prev)=>{
        const next = new Set(prev);
        const currentlyOpen = next.has(node.id);
        if (currentlyOpen) {
            // 닫힐 때: 자기 + 자식 그룹 모두 닫기
            const toClose = collectGroupIds(node);
            toClose.forEach((id) => next.delete(id));
        } else {
            // 열릴 때: 자기만 열기 (자식들은 사용자가 개별로 열도록)
            next.add(node.id);
        }
        return next;
    });
}, []);

// 로딩 이벤트 (메뉴 불러오기)
if (loading && menu.length === 0) {
    return (
    <aside className={styles.sidebar}>
        메뉴 불러오는 중... (로딩중...)
    </aside>
    );
}

return (
    <aside className={styles.sidebar}>
        <nav>
            {menu.map((node) => (
                <SidebarNode
                    key={node.id}
                    node={node}
                    depth={0}
                    currentPath={location.pathname}
                    openIds={openIds}
                    onToggleGroup={handleToggleGroup}
                />
            ))}
        </nav>
    </aside>
);
};

export default Menu;