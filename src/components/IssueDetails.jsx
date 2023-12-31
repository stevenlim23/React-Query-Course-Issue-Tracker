import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

// Components
import { IssueHeader } from "./IssueHeader";
import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";

function useIssueData(issueNumber) {
  return useQuery(["issues", issueNumber], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}`, { signal }).then((res) =>
      res.json()
    );
  });
}

function useIssueComment(issueNumber) {
  return useQuery(["issues", issueNumber, "comments"], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}/comments`, { signal }).then(
      (res) => res.json()
    );
  });
}

const Comment = ({ comment, createdBy, createdDate }) => {
  const userQuery = useUserData(createdBy);

  if (userQuery.isLoading)
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="comment">
      <img src={userQuery.data.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{userQuery.data.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
};

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComment(number);

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading Issue...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data} />
          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment}></Comment>
                ))
              )}
            </section>
            <aside></aside>
          </main>
        </>
      )}
    </div>
  );
}
