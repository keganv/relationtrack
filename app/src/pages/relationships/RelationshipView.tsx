import {useCallback, useEffect, useRef, useState} from 'react';
import Modal from 'react-modal';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import { RelationshipFormData } from '../../types/Relationship';
import RelationshipForm from './components/RelationshipForm';
import useRelationshipContext from '../../hooks/useRelationshipContext';
import Spinner from '../../components/ui/Spinner';
import {useLocation} from 'react-router-dom';
import RelationshipDetails from './components/RelationshipDetails';
import ActionItems from '../../components/ui/ActionItems.tsx';
import API_File from '../../types/ApiFile.ts';

export default function RelationshipView() {
  const apiUrl = `${import.meta.env.VITE_API_URL}/api/`;
  const location = useLocation();
  const primaryImage = useRef<HTMLImageElement|null>(null);
  const {
    selectedRelationship,
    setRelationshipById,
    setPrimaryImageForRelationship,
    convertToFormData,
  } = useRelationshipContext();
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<RelationshipFormData>();
  const openFormModal = () => setFormIsOpen(true);
  const closeFormModal = () => setFormIsOpen(false);
  const setPrimaryImage = (path: string, id: string) => {
    primaryImage?.current?.setAttribute('src', path);
    primaryImage?.current?.setAttribute('data-id', id);
  };
  const setUpRelationshipData = useCallback(() => {
    const id = location?.pathname.split('/')[2];
    if (id) setRelationshipById(id);
    if (selectedRelationship) setFormData(convertToFormData(selectedRelationship));
  }, [convertToFormData, location, setRelationshipById, selectedRelationship]);

  useEffect(() => {
    setUpRelationshipData();
  }, [setUpRelationshipData]);

  if (!selectedRelationship || !formData) {
    return (
      <div className="flex justify-center vh-100 align-middle">
        <Spinner loading={true} />
      </div>
    )
  }

  return (
    <>
      <header className="flex justify-between border-bottom-dark mb">
        <h2>{formData.name}</h2>
        <button className="primary small" onClick={openFormModal}>Edit Relationship</button>
      </header>
      <div className="flex wrap">
        <div className="col-4 col-12-sm pr-sm pr-0-sm">
          <div id="primary-image-container" className="modal-images">
            {selectedRelationship?.primary_image !== null &&
                <img ref={primaryImage}
                     src={`${apiUrl}${selectedRelationship?.primary_image?.path}`}
                     id="primary-image"
                     alt={selectedRelationship?.name}
                     data-id={selectedRelationship?.primary_image?.id}
                     onClick={() => setImageModal(true)}/>
            }
            {!selectedRelationship?.primary_image &&
                <img ref={primaryImage} src="/images/generic-user.jpg" id="primary-image" alt="No Primary Image"/>
            }
            <button className="transparent tooltip" type="button" id="primary-image-button"
                    data-tooltip={`Make this the primary image For ${selectedRelationship?.name}.`}
                    onClick={() => setPrimaryImageForRelationship(primaryImage.current?.getAttribute('data-id') || '')}>
              <i className="fa-solid fa-file-arrow-up"></i>
            </button>
          </div>
          <ul className="image-list profile-images-list">
            {selectedRelationship?.files?.map((file: API_File) => (
              <li key={file.id}>
                <img src={`${apiUrl}${file.path}`} alt={file.name}
                     className="profile-image" data-id={file.id} loading="lazy"
                     onClick={() => setPrimaryImage(`${apiUrl}${file.path}`, `${file.id}`)}/>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-8 col-12-sm pb pl-sm pl-0-sm">
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Action Items</Tab>
              <Tab>Notes</Tab>
              <Tab>Reminders</Tab>
              <Tab>Media</Tab>
            </TabList>
            <TabPanel>
              <RelationshipDetails relationship={selectedRelationship} />
            </TabPanel>
            <TabPanel>
              <ActionItems relationship={selectedRelationship} />
            </TabPanel>
            <TabPanel>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <iframe style={{'display': 'block'}}
                      src="https://open.spotify.com/embed/track/6vWu5uWlox5TVDPl3LvoG3?theme=0" width="100%"
                      height="80" frameBorder="0" allow="autoplay; encrypted-media;" loading="lazy"></iframe>
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <Modal isOpen={formIsOpen} onRequestClose={closeFormModal}
             className="react-modal right" overlayClassName="react-modal-overlay">
        <RelationshipForm data={formData} cancel={closeFormModal}/>
      </Modal>
      <Modal isOpen={imageModal} onRequestClose={() => setImageModal(false)}
             className="react-modal center" overlayClassName="react-modal-overlay">
        <div className="close" onClick={() => setImageModal(false)}>X</div>
        <img src={primaryImage?.current?.src} alt={primaryImage?.current?.alt}/>
      </Modal>
    </>
  );
}
