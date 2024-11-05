import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SortableTable from '../../../components/ui/SortableTable'
import Spinner from '../../../components/ui/Spinner';
import useRelationshipContext from '../../../hooks/useRelationshipContext';

type FormattedRelationshipTableRow = {
  id: string;
  primary_image: string;
  name: string;
  type: string;
  title: string;
  health: number | string;
  updated_at: string;
}

export default function RelationshipList() {
  const { relationships } = useRelationshipContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [formatted, setFormatted] = useState<{ [k: string]: string | number | undefined }[] | null>(null);
  const columns = [
    { key: 'primary_image', label: '', styles: { width: '50px' }, type: 'image', alt: 'name', className: 'relation-image' },
    {
      key: 'name', label: 'Name', type: 'format',
      format: (data: FormattedRelationshipTableRow) => <Link to={`/relationships/${data.id}`}>{data.name}</Link>
    },
    { key: 'type', label: 'Relationship', className: 'hide-sm', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'health', label: 'Health', className: 'text-center', type: 'format',
      format: (data: FormattedRelationshipTableRow) => (
        <div className={`heart health-${data.health}`} title={`${data.health} out of 10`}>
          <div className="score">{data.health}</div>
        </div>
      )
    },
    { key: 'updated_at', label: 'Last Update', className: 'hide-sm', type: 'date' },
  ];

  useEffect(() => {
    if (relationships) {
      const rows: { [key: string]: string | number | undefined }[] = [];
      relationships?.forEach((r) => {
        rows.push({
          'id': r.id || '',
          'primary_image': r.primary_image?.path ?? '',
          'name': r.name,
          'type': r.type?.type,
          'title': r.title,
          'health': r.health,
          'updated_at': r.updated_at ?? '',
        });
      });
      setFormatted(rows);
      setLoading(false);
    }
  }, [relationships]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner loading={true} />
      </div>
    );
  }

  if (!formatted?.length) {
    return <div className="alert message">No Relationships Found.</div>;
  }

  return (
    <>
      {formatted?.length && <SortableTable columns={columns} data={formatted} />}
    </>
  );
}
