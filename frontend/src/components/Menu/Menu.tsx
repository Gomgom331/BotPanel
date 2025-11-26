import React, { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMenuItem } from "../../hooks/useMenuItem"; // 외부 훅
import Icon from "../Icon/Icon" // 외부 컴포넌트
import Collapsible from "../Collapsible/Collapsible"; // 메뉴 애니메이션

import styles from "./Menu.module.css";


// 메뉴 아이템 타입 정의
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

// SidebarNode Props 정의 (focusedItemId로 변경됨)
interface SidebarNodeProps {
    node: MenuItem; // 노드 데이터
    depth: number; // 깊이
    currentPath: string; //링크
    openIds: Set<number>; // 열려 있는 그룹 id 집합 (메뉴)
    onToggleGroup: (node: MenuItem) => void; //그룹 토글 이벤트
    focusedItemId: number | null; // 💡 수정: 현재 포커스된 아이템의 ID
    onFocusChange: (id: number, focused: boolean) => void;
}


// 메뉴 아이템 애니메이션 관리를 위한 도우미 함수 (그룹 ID 수집)
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
    focusedItemId,
    onFocusChange,
}) => {

    const isFocused = focusedItemId === node.id; // 포커스 계산

    // 포커스 이벤트 핸들러
    const handleFocus = () => {
        onFocusChange(node.id, true);
    };

    const handleBlur = () => {
        onFocusChange(node.id, false)
    }

    let toggleIcon: React.ReactNode = null;

    // 포커스 여부에 따라 아이콘 색상 결정
    const iconColor = isFocused
        ? "var(--icon-color-wh)"
        : "var(--text-body)"

    // 💡 수정: isFocused가 true일 때 원하는 색상으로 변경됩니다.
    const iconColor2 = isFocused
        ? "var(--icon-color-wh)"
        : "var(--icon-color)"

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
    

    // 토글 아이콘 렌더링
    if(isGroup && hasChildren ){
        if (depth === 0){
            toggleIcon = (
                <Icon
                    name="chevronRight"
                    size={9}
                    color={iconColor}
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                />
            );
        } else{
            toggleIcon = (
                <Icon
                    name={isOpen ? "minus" : "plus"}
                    size={isOpen ? 14 : 9 } //사이즈 조절
                    color={iconColor2} // 💡 수정: 이제 isFocused 상태에 따라 색이 바뀝니다.
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
                    className={`${styles.itemWrapper} menuFocus`}
                    onClick={() => hasChildren && onToggleGroup(node)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    {/* 공통 아이콘 박스 (모든 메뉴가 같은 폭을 가지도록) */}
                    <div className={styles.itemIcon}>
                        {/* 그룹이고 children이 있는 경우에만 토글 아이콘 표시 */}
                        {toggleIcon}
                    </div>

                    {/* 그룹 제목 */}
                    <div className={`${styles.itemTitle} ${styles.groupLabel} ${isFocused ? styles.focusedText : ""}`}>
                        {node.label}
                    </div>
                </button>
                
                {/* 그룹 자식 메뉴 */}
                {hasChildren && (
                <Collapsible isOpen={isOpen}>
                    <div className={styles.groupChildren}>
                    {/* 💡 수정: 중복 렌더링 코드 제거 및 focusedItemId 전달 */}
                    {node.children!.map((child) => (
                        <SidebarNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            currentPath={currentPath}
                            openIds={openIds}
                            onToggleGroup={onToggleGroup}
                            focusedItemId={focusedItemId} // 👈 이 부분이 핵심
                            onFocusChange={onFocusChange}
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
    const rowClass = [styles.item, depthClass, "menuFocus"].join(" ");

    if (node.external) {
        // 외부 링크
        return (
            <a 
                href={href} 
                className={rowClass} 
                target="_blank" 
                rel="noreferrer"
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
            <div className={styles.itemIcon} />
            <div className={`${styles.itemTitle} ${isFocused ? styles.focusedText : ""}`}>{node.label}</div>
        </a>
        )}
        // 내부 라우팅 (react-router Link)
        return (
            <Link to={href} className={rowClass} onFocus={handleFocus} onBlur={handleBlur}>
                <div className={styles.itemIcon}>
                {/* 나중에 아이콘 있으면 여기 */}
                </div>
                <div className={`${styles.itemTitle} ${isFocused ? styles.focusedText : ""}`}>{node.label}</div>
            </Link>
        );
};


// 전체 메뉴 컴포넌트 ------------------------------------------------------
const Menu: React.FC = () => {
    const { menu, loading } = useMenuItem(); // 아이템 로딩
    const location = useLocation(); 

    // 열려있는 그룹 아이디 관리
    const [openIds, setOpenIds] = useState<Set<number>>(() => new Set());

    // 포커스 아이템
    const [focusedItemId, setFocusedItemId] = useState<number | null>(null);

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

    // 포커스 변경 핸들러
    const handleFocusChange = useCallback((id: number, focused: boolean) => {
        if (focused) {
            setFocusedItemId(id);
        } else {
            setFocusedItemId(null);
        }
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
                    // 💡 수정: focusedItemId를 전달합니다.
                    focusedItemId={focusedItemId} 
                    onFocusChange={handleFocusChange}
                />
                ))}
                </nav>
        </aside>
    );
};

export default Menu;