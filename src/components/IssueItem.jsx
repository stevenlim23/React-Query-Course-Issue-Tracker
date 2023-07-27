import { Link } from "react-router-dom";

// Helper
import { relativeDate } from "../helpers/relativeDate";
import { useUserData } from "../helpers/useUserData";

// Icon
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";

export const IssueItem = ({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) => {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);

  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>

      <div className="issue-content">
        <span>
          <Link to={`issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <span key={label} className={`label red`}>
              {label}
            </span>
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}
          {createdByUser.isSuccess && `by ${createdByUser.data.name}`}
        </small>
      </div>

      {assignee && (
        <img
          className="assigned-to"
          alt={`Assigned To ${
            assigneeUser.isSuccess ? assigneeUser.data.name : "Avatar"
          }`}
          src={assigneeUser.isSuccess && assigneeUser.data.profilePictureUrl}
        />
      )}

      <span className="comment-count">
        {commentCount > 0 && (
          <>
            <GoComment />
            {commentCount}
          </>
        )}
      </span>
    </li>
  );
};
