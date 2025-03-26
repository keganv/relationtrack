import Spinner from '../components/ui/Spinner.tsx';
import useAuthContext from '../hooks/useAuthContext.ts';
import RelationshipList from './relationships/components/RelationshipList';

export default function Dashboard() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner loading={!user}/>
      </div>
    );
  }

  return (
    <>
      <RelationshipList />
    </>
  )
}
