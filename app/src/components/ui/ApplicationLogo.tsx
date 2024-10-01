interface ApplicationLogoProps { className?: string }

export default function ApplicationLogo(props: ApplicationLogoProps) {
    const srcSet = [
        "/images/logo-xs.png 320w",
        "/images/logo-sm.png 480w",
        "/images/logo-md.png 800w",
        "/images/logo-lg.png 1200w"
    ];
    const sizes = "(max-width: 320px) 320px, (max-width: 480px) 480px, (max-width: 800px) 800px, 1200px";

    return (
        <img
            {...props}
            srcSet={srcSet.join(',')}
            sizes={sizes}
            src="/images/logo-md.png"
            alt="RelationTrack"
            aria-label="Relation Track"
            className={props.className ?? ''}
            role="img"
        />
    );
}
