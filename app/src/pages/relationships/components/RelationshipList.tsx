import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import SortableTable, { type SortTableColumn } from '../../../components/ui/SortableTable'
import Spinner from '../../../components/ui/Spinner';
import useAuthContext from '../../../hooks/useAuthContext.ts';
import useRelationshipContext from '../../../hooks/useRelationshipContext';
import { type Relationship } from '../../../types/Relationship.ts';

type FormattedRelationshipTableRow = {
  id: string;
  key: string;
  primary_image: string;
  name: string;
  type: string;
  title: string;
  health: number | string;
  updated_at: string;
}

export default function RelationshipList() {
  const { user } = useAuthContext();
  const { relationships, getRelationships, setRelationships } = useRelationshipContext();
  const [loading, setLoading] = useState<boolean>(true);
  const columns: SortTableColumn<FormattedRelationshipTableRow>[] = [
    { key: 'primary_image', label: '', styles: { width: '50px' }, type: 'image', alt: 'name', className: 'relation-image' },
    {
      key: 'name', label: 'Name', type: 'format',
      format: (data) => <Link to={`/relationships/${data.id}`}>{data.name}</Link>
    },
    { key: 'type', label: 'Relationship', className: 'hide-sm', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    {
      key: 'health', label: 'Health', className: 'text-center', type: 'format',
      format: (data) => (
        <div className={`heart health-${data.health}`} title={`${data.health} out of 10`}>
          <div className="score">{data.health}</div>
        </div>
      )
    },
    { key: 'updated_at', label: 'Last Update', className: 'hide-sm', type: 'date' },
  ];

  const formattedRows = useMemo(() => {
    return relationships?.map((r: Relationship): FormattedRelationshipTableRow => ({
        id: r.id || '',
        key: r.id || '',
        primary_image: r.primary_image?.path ?? '',
        name: r.name,
        type: r.type.type,
        title: r.title,
        health: r.health,
        updated_at: r.updated_at ?? '',
      })) ?? []
  }, [relationships]);

  useEffect(() => {
    if (!relationships) {
      user?.relationships ? setRelationships(user.relationships) : getRelationships();
    }
  }, [user?.relationships, relationships, getRelationships, setRelationships]);

  useEffect(() => {
    if (formattedRows) {
      setLoading(false);
    }
  }, [formattedRows]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner loading={true} />
      </div>
    );
  }

  if (!formattedRows?.length && !loading) {
    return <div className="alert message">No Relationships Found.</div>;
  }

  return (
    <>
      <section className="section">
        <SortableTable columns={columns} data={formattedRows} />
      </section>
    </>
  );
}
