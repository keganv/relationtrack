import {Outlet} from 'react-router-dom';
import {RelationshipProvider} from '../../services/RelationshipService';

export default function RelationshipOutlet() {
  return (
    <RelationshipProvider>
      <Outlet />
    </RelationshipProvider>
  );
}
