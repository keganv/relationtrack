import { Outlet } from 'react-router-dom';
import RelationshipProvider from '../../providers/RelationshipProvider';

export default function RelationshipOutlet() {
  return (
    <RelationshipProvider>
      <Outlet />
    </RelationshipProvider>
  );
}
