type ImageProps = {
  alt: string;
  className?: string;
  onClick?: () => void;
  dataId?: string | number;
  loading?: 'eager' | 'lazy';
  src: string;
}

export default function Image(props: ImageProps) {
  const removeLoadingPulse = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.target as HTMLImageElement;
    const parentEl = el.parentElement as HTMLElement;
    parentEl.classList.remove('bg-slate-400', 'animate-pulse');
  };

  return (
    <img
      {...props}
      {...(props.dataId && { 'data-id': props.dataId })}
      {...(props.onClick && { onClick: props.onClick })}
      onLoad={removeLoadingPulse}
    />
  );
}
