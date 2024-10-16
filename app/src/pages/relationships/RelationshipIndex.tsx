import {useState} from 'react';
import Modal from 'react-modal';
import RelationshipList from './components/RelationshipList';
import RelationshipForm from './components/RelationshipForm';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export default function RelationshipIndex() {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <header className="flex justify-between border-bottom-dark mb">
        <h2>My Relationships</h2>
        <button className="primary angle-right text-xs" onClick={openModal}>Add Relationship</button>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
             className="react-modal right" overlayClassName="react-modal-overlay">
        <RelationshipForm cancel={closeModal} />
      </Modal>
      <ErrorBoundary message="Could not load the relationships." styles="bg-main-blue">
        <RelationshipList />
      </ErrorBoundary>
    </>
  );
}
