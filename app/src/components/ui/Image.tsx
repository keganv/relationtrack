type ImageProps = {
  alt: string;
  className?: string;
  onClick?: () => void;
  dataId?: string | number;
  id?: string;
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
      src={props.src}
      id={props.id}
      data-id={props.dataId}
      alt={props.alt}
      className={props.className}
      loading={props.loading ?? 'lazy'}
      onClick={props.onClick}
      onLoad={removeLoadingPulse}
      onError={removeLoadingPulse}
    />
  );
}
