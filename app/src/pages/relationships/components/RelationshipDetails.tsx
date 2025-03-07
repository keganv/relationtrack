import Tooltip from '../../../components/ui/Tooltip.tsx';
import type { Relationship } from '../../../types/Relationship';

type RelationshipDetailsProps = { relationship: Relationship; }
export default function RelationshipDetails({relationship}: RelationshipDetailsProps) {
  return (
    <div className="details">
      <div>
        <strong>Relationship:</strong>
        <p>{relationship.type.type}</p>
      </div>
      <div>
        <strong>Health:</strong>
        <div id="health-score">
          <div className={`heart health-${relationship.health}`}
               title={`${relationship.health} out of 10`}>
            <div className="score">{relationship.health}</div>
          </div>
          out of 10
        </div>
        <Tooltip elId="health-score" message={`The health of this relationship is a ${relationship.health} out of 10`} />
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
              'en-US', {timeZone:'UTC', year: 'numeric', month: 'long', day: 'numeric'}
            )}
          </p>}
      </div>
      <div>
        <strong>Description:</strong>
        <p>{ relationship.description }</p>
      </div>
    </div>
  );
}
