import { useCallback, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useLocation } from 'react-router';
import { Tab, TabList, TabPanel,Tabs } from 'react-tabs';

import ActionItems from '../../components/action-items/ActionItems';
import Image from '../../components/ui/Image';
import Spinner from '../../components/ui/Spinner';
import Tooltip from '../../components/ui/Tooltip';
import useApi from '../../hooks/useApi.ts';
import useGlobalContext from '../../hooks/useGlobalContext.ts';
import useRelationshipContext from '../../hooks/useRelationshipContext';
import type { ApiFile } from '../../types/ApiFile';
import RelationshipDetails from './components/RelationshipDetails';
import RelationshipForm from './components/RelationshipForm';

import '../../styles/relationship.scss';


export default function RelationshipView() {
  const {
    selectedRelationship,
    setSelectedRelationship,
    setRelationshipById,
    setPrimaryImageForRelationship
  } = useRelationshipContext();
  const location = useLocation();
  const { setStatus } = useGlobalContext();
  const { deleteData } = useApi();
  const primaryImageRef = useRef<HTMLImageElement>(null);
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [relationshipImages, setRelationshipImages] = useState<ApiFile[]>([]);

  const apiUrl = `${import.meta.env.VITE_API_URL}/api/`;

  const setPrimaryImage = (path: string, id: string) => {
    if (primaryImageRef.current) {
      primaryImageRef.current.src = path;
      primaryImageRef.current.id = id;
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;
    const url = `/api/files/${primaryImageRef?.current?.id}`;
    const result = await deleteData(url);
    if (result) {
      setStatus({type: 'success', message: 'Successfully deleted image.'});
      const filteredFiles = relationshipImages.filter((file: ApiFile) => {
        return file.id !== Number(primaryImageRef?.current?.id)
      }) || [];
      setRelationshipImages(filteredFiles);
      if (filteredFiles.length) {
        setPrimaryImage(`${apiUrl}${filteredFiles[0].path}`, filteredFiles[0].id.toString());
      } else {
        setSelectedRelationship((prev) => {
          return prev ? {...prev, primary_image: null, files: []} : null;
        });
      }
    }
  };

  const setUpRelationshipData = useCallback(() => {
    const id = location.pathname.split('/')[2];
    if (id) setRelationshipById(id);
  }, [location, setRelationshipById]);

  useEffect(() => {
    if (!selectedRelationship) return;
    setRelationshipImages(selectedRelationship.files ?? []);
  }, [selectedRelationship, selectedRelationship?.files]);

  useEffect(() => {
    setUpRelationshipData();
    // Reset the selected relationship when the component unmounts
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
            {selectedRelationship.primary_image ?
              <>
                <img ref={primaryImageRef}
                     src={`${apiUrl}${selectedRelationship.primary_image?.path}`}
                     alt={selectedRelationship.name}
                     id={selectedRelationship.primary_image?.id.toString()}
                     onClick={() => setImageModal(true)}
                />
                <menu>
                  <button id="primary-image-button" className="left"
                          onClick={() => setPrimaryImageForRelationship(primaryImageRef.current?.id ?? '')}>
                    <i className="fa-solid fa-file-arrow-up"/>
                  </button>
                  <button className="black !text-red-700" onClick={handleDelete}>
                    <i className="fa fa-trash"/>
                  </button>
                  <Tooltip elId="primary-image-button"
                           message={`Make this the primary image For ${selectedRelationship?.name}.`} position="right"/>
                </menu>
              </> :
              <img ref={primaryImageRef} src="/images/generic-user.jpg" alt="No Primary Image"/>
            }
          </div>
          <div className="section mt-3 mb-3">
            <ul className="grid grid-cols-5 gap-3">
              {relationshipImages?.map((file: ApiFile) => (
                <li key={file.id} className="flex justify-center items-center overflow-hidden aspect-square relative bg-slate-400 animate-pulse">
                  <Image
                    alt={file.name}
                    className="object-cover cursor-pointer"
                    id={file.id.toString()}
                    src={`${apiUrl}${file.path}`}
                    onClick={() => setPrimaryImage(`${apiUrl}${file.path}`, `${file.id}`)}
                    loading="lazy"
                  />
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
