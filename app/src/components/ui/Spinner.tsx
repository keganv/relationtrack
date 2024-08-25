export default function Spinner({ loading }: { loading: boolean }) {
  return loading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>
}
