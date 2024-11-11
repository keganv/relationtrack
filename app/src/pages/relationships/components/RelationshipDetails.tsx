import { Relationship } from '../../../types/Relationship';

type RelationshipDetailsProps = { relationship: Relationship; }
export default function RelationshipDetails({relationship}: RelationshipDetailsProps) {
  return (
    <div className="">
      <div>
        <strong>Relationship:</strong>
        <p>{relationship.type.type}</p>
      </div>
      <div>
        <strong>Health:</strong>
        <div>
          <div className={`heart health-${relationship.health}`}
               title={`${relationship.health} out of 10`}>
            <div className="score">{ relationship.health }</div>
          </div> out of 10
        </div>
      </div>
      <div>
        <strong>Title:</strong>
        <p>{relationship.title}</p>
      </div>
      <div>
        <strong>Birthday:</strong>
        {relationship.birthday &&
          <p>
            {new Date(relationship.birthday).toLocaleDateString(
              undefined, {year: 'numeric', month: 'long', day: 'numeric'}
            )}
          </p>}
      </div>
      <div className="col-12 mb-sm">
        <strong>Description:</strong>
        <p>{ relationship.description }</p>
      </div>
    </div>
  );
}
