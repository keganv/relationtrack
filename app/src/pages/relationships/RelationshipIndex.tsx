import { useState } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Modal from 'react-modal';

import RelationshipForm from './components/RelationshipForm';
import RelationshipList from './components/RelationshipList';

export default function RelationshipIndex() {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  function fallbackRender({ error }: FallbackProps) {
    // TODO implement resetErrorBoundary, refer to docs

    return (
      <h1 className="bg-main-blue angle-right mt-[calc(80vh/2)] m-auto w-[400px] text-white text-center">
        {error?.message || 'Could not load the relationships.'}
      </h1>
    );
  }

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
      <ErrorBoundary fallbackRender={fallbackRender}>
        <RelationshipList />
      </ErrorBoundary>
    </>
  );
}
