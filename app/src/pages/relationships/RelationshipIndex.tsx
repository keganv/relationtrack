import {useState} from 'react';
import Modal from 'react-modal';
import RelationshipList from './components/RelationshipList';
import RelationshipForm from './components/RelationshipForm';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function RelationshipIndex() {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <header className="page-header">
        <h2>My Relationships</h2>
        <button className="primary angle-right text-xs" onClick={() => setIsOpen(true)}>Add Relationship</button>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}
             appElement={document.getElementById('root') ?? undefined}
             className="react-modal center" overlayClassName="react-modal-overlay">
        <RelationshipForm cancel={() => setIsOpen(false)} />
      </Modal>
      <ErrorBoundary message="Could not load the relationships." styles="bg-main-blue">
        <RelationshipList />
      </ErrorBoundary>
    </>
  );
}
