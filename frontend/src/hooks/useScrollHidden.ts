// hooks/useScrollHidden.ts
import { useEffect, useRef } from 'react';

export const useScrollHidden = (delay: number = 400) => {
    const scrollingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const scrollBoxesRef = useRef<Set<Element>>(new Set());

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollingTimeoutRef.current) {
                console.log('start wheeling!');
                document.documentElement.style.setProperty('--scroll-opacity', '1');
            }

            if (scrollingTimeoutRef.current) {
                clearTimeout(scrollingTimeoutRef.current);
            }

            scrollingTimeoutRef.current = setTimeout(() => {
                console.log('stop wheeling!');
                scrollingTimeoutRef.current = undefined;
                document.documentElement.style.setProperty('--scroll-opacity', '0');
            }, delay);
        };

        const attachScrollListener = (element: Element) => {
            if (!scrollBoxesRef.current.has(element)) {
                element.addEventListener('scroll', handleScroll, { passive: true });
                scrollBoxesRef.current.add(element);
            }
        };

        const detachScrollListener = (element: Element) => {
            if (scrollBoxesRef.current.has(element)) {
                element.removeEventListener('scroll', handleScroll);
                scrollBoxesRef.current.delete(element);
            }
        };

        // 초기 .scrollBox 요소들에 리스너 추가
        const initialScrollBoxes = document.querySelectorAll('.scrollBox');
        initialScrollBoxes.forEach(attachScrollListener);

        // MutationObserver로 동적으로 추가되는 .scrollBox 감지
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof Element) {
                        if (node.classList.contains('scrollBox')) {
                            attachScrollListener(node);
                        }
                        // 자식 요소 중에도 .scrollBox가 있는지 확인
                        node.querySelectorAll('.scrollBox').forEach(attachScrollListener);
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    if (node instanceof Element) {
                        if (node.classList.contains('scrollBox')) {
                            detachScrollListener(node);
                        }
                        node.querySelectorAll('.scrollBox').forEach(detachScrollListener);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 초기값 설정
        document.documentElement.style.setProperty('--scroll-opacity', '0');

        return () => {
            observer.disconnect();
            scrollBoxesRef.current.forEach(element => {
                element.removeEventListener('scroll', handleScroll);
            });
            scrollBoxesRef.current.clear();
            if (scrollingTimeoutRef.current) {
                clearTimeout(scrollingTimeoutRef.current);
            }
        };
    }, [delay]);
};