import { useRef, useState, type MouseEvent } from 'react';

export const useDragScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => setIsDrag(false);

  const onDragMove = (e: MouseEvent) => {
    if (!isDrag || !scrollRef.current) return;
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  return { scrollRef, onDragStart, onDragEnd, onDragMove };
};