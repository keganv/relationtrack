import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Modal from 'react-modal';

import RelationshipForm from './components/RelationshipForm';
import useRelationshipContext from '../../hooks/useRelationshipContext';
import Spinner from '../../components/ui/Spinner';
import RelationshipDetails from './components/RelationshipDetails';
import ActionItems from '../../components/action-items/ActionItems';
import API_File from '../../types/ApiFile.ts';
import '../../styles/relationship.scss';
import Tooltip from "../../components/ui/Tooltip.tsx";

export default function RelationshipView() {
  const apiUrl = `${import.meta.env.VITE_API_URL}/api/`;
  const location = useLocation();
  const primaryImageRef = useRef<HTMLImageElement>(null);
  const { selectedRelationship, setSelectedRelationship, setRelationshipById, setPrimaryImageForRelationship } = useRelationshipContext();
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<boolean>(false);
  const setPrimaryImage = (path: string, id: string) => {
    if (primaryImageRef.current) {
      primaryImageRef.current.src = path;
      primaryImageRef.current.setAttribute('data-id', id);
    }
  };
  const setUpRelationshipData = useCallback(() => {
    const id = location?.pathname.split('/')[2];
    if (id) setRelationshipById(id);
  }, [location, setRelationshipById]);

  useEffect(() => {
    setUpRelationshipData();
    return () => setSelectedRelationship(null);
  }, [setUpRelationshipData, setSelectedRelationship]);

  if (!selectedRelationship) {
    return (
      <div className="flex justify-center h-[100vh] items-center">
        <Spinner loading={true}/>
      </div>
    )
  }

  return (
    <>
      <header className="page-header">
        <h2>{selectedRelationship.name}</h2>
        <button className="primary small angle-right" onClick={() => setFormIsOpen(true)}>
          Edit Relationship
        </button>
      </header>
      <div className="flex flex-wrap">
        <div id="relationship-images-container">
          <div id="primary-image-container" className="section">
            {selectedRelationship.primary_image &&
              <>
                <img ref={primaryImageRef}
                     src={`${apiUrl}${selectedRelationship.primary_image?.path}`}
                     alt={selectedRelationship.name}
                     data-id={selectedRelationship.primary_image?.id}
                     onClick={() => setImageModal(true)}
                />
                <button id="primary-image-button" className="text-xs white right" type="button"
                        onClick={() => setPrimaryImageForRelationship(primaryImageRef.current?.getAttribute('data-id') ?? '')}>
                  <i className="fa-solid fa-file-arrow-up"></i>
                </button>
                <Tooltip elId="primary-image-button" message={`Make this the primary image For ${selectedRelationship?.name}.`} position="right" />
              </>
            }
            {!selectedRelationship.primary_image &&
              <img ref={primaryImageRef} src="/images/generic-user.jpg" alt="No Primary Image"/>
            }
          </div>
          <div className="section mt-3">
            <ul className="flex -mx-1">
              {selectedRelationship.files?.map((file: API_File) => (
                <li key={file.id} className="w-1/3 px-1">
                  <img src={`${apiUrl}${file.path}`} alt={file.name}
                       className="profile-image" data-id={file.id} loading="lazy"
                       onClick={() => setPrimaryImage(`${apiUrl}${file.path}`, `${file.id}`)} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="relationship-data">
          <div className="section">
            <Tabs>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Notes</Tab>
                <Tab>Reminders</Tab>
                <Tab>Media</Tab>
              </TabList>
              <TabPanel>
                <RelationshipDetails relationship={selectedRelationship}/>
              </TabPanel>
              <TabPanel>
                <h2>Notes will go here.</h2>
              </TabPanel>
              <TabPanel>
                <h2>Reminders will go here.</h2>
              </TabPanel>
              <TabPanel>
                <iframe style={{'display': 'block', width: '100%'}}
                        src="https://open.spotify.com/embed/track/6vWu5uWlox5TVDPl3LvoG3?theme=0" width="100%"
                        height="80" frameBorder="0" allow="autoplay; encrypted-media;" loading="lazy"></iframe>
              </TabPanel>
            </Tabs>
          </div>
          <div className="section mt-3">
            <ActionItems relationship={selectedRelationship} />
          </div>
        </div>
      </div>
      <Modal isOpen={formIsOpen} onRequestClose={() => setFormIsOpen(false)}
             appElement={document.getElementById('root') ?? undefined}
             className="react-modal center" overlayClassName="react-modal-overlay">
        <RelationshipForm relationship={selectedRelationship} cancel={() => setFormIsOpen(false)}/>
      </Modal>
      <Modal isOpen={imageModal} onRequestClose={() => setImageModal(false)}
             appElement={document.getElementById('root') ?? undefined}
             className="react-modal center" overlayClassName="react-modal-overlay">
        <div className="close" onClick={() => setImageModal(false)}>X</div>
        <img src={primaryImageRef?.current?.src} alt={primaryImageRef?.current?.alt}/>
      </Modal>
    </>
  );
}
