# Callapsible 사용 목적

메뉴에 들어가는 height 애니메이션을 담당함
자연스러운 열림/닫힘을 위해 height 값을 계산하는 애니메이션 부분 쪽만 담당하고 데이터와 모델은 MENU 컴포넌트에서 담당

## 사용하는 방법 
"""
import Collapsible from "../Collapsible/Collapsible"; //불러오기

// 메뉴 아이템 props
interface SidebarNodeProps {
    node: MenuItem;
    depth: number; // 깊이
    currentPath: string; //링크
    openIds: Set<number>; // 열려 있는 그룹 id 집합 (메뉴)
    onToggleGroup: (id: number) => void; //그룹 토글 이벤트
}

// height 애니메이션이 필요한 곳에 값을 넣어주기
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

"""

