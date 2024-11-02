type SpinnerProps = { loading: boolean, className?: string }
export default function Spinner({ loading, className }: SpinnerProps) {
  return loading && <i className={`${className} fa-solid fa-spinner fa-spin-pulse`}></i>
}
