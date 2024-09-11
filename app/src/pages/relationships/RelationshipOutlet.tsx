import {Outlet} from 'react-router-dom';
import {RelationshipProvider} from '../../providers/RelationshipService.tsx';

export default function RelationshipOutlet() {
  return (
    <RelationshipProvider>
      <Outlet />
    </RelationshipProvider>
  );
}
