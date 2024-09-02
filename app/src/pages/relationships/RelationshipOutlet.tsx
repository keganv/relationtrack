import {Outlet} from 'react-router-dom';
import {RelationshipProvider} from '../../services/RelationshipService.tsx';

export default function RelationshipOutlet() {
  return (
    <RelationshipProvider>
      <Outlet />
    </RelationshipProvider>
  );
}
