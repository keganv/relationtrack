import { createPortal } from 'react-dom';
import { useLayoutEffect, useRef, useState } from "react";

type TooltipProps = { elId: string, message: string, position?: string }

const Tooltip = function({elId, message, position = 'top'}: TooltipProps) {
  const [styles, setStyles] = useState<object>();
  const el = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    el.current = document.getElementById(elId);
    if (el.current) {
      const elPos = getComputedStyle(el.current).position;
      if (elPos !== 'absolute' && elPos !== 'relative') el.current.style.position = 'relative';
      el.current.onpointerover = () => setStyles({ display: 'block' })
      el.current.onpointerleave = () => setStyles({ display: 'none' })
    }
  }, [elId]);

  if (el.current) {
    return createPortal(
      <div style={{ ...styles }} className={`tooltip ${position}`}>{message}</div>, el.current, `${elId}-tooltip`
    )
  }
}

export default Tooltip;
