import {useState} from 'react';
import Modal from 'react-modal';
import RelationshipList from './components/RelationshipList';
import RelationshipForm from './components/RelationshipForm';

export default function RelationshipIndex() {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <header className="flex justify-between border-bottom-dark mb">
        <h2>My Relationships</h2>
        <button className="primary small" onClick={openModal}>Add Relationship</button>
      </header>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
             className="react-modal right" overlayClassName="react-modal-overlay">
        <RelationshipForm cancel={closeModal} />
      </Modal>
      <RelationshipList />
    </>
  );
}
