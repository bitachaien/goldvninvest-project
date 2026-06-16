import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

const CommentSection = ({
  comments,
  post_id,
  PostCommentAction,
  comment_allow,
}: any) => {
  const { t } = useTranslation("common");

  const [postComment, setPostComment] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
    post_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [commentList, setCommentList] = useState(comments);
  useEffect(() => {
    setCommentList(comments);
  }, [comments]);
  const onSubmit = (e: any) => {
    e.preventDefault();
    PostCommentAction(
      postComment.name,
      postComment.email,
      postComment.website,
      postComment.message,
      post_id,
      setCommentList,
      setLoading,
      setPostComment
    );
  };
  return (
    <div className=" tradex-mt-8">
      <div className=" tradex-space-y-10">
        {commentList?.length > 0 && (
          <h2 className=" tradex-text-[24px] tradex-leading-[32px] !tradex-text-title">
            {t("Comments")} {commentList?.length}
          </h2>
        )}
        {commentList?.length > 0 &&
          commentList?.map((comment: any, index: number) => (
            <div className=" tradex-space-y-4" key={index}>
              <div className=" tradex-space-y-1">
                <p className=" tradex-text-base tradex-leading-6 tradex-font-bold tradex-text-title">
                  {comment.name}
                </p>
                <div className=" tradex-flex tradex-items-center tradex-gap-2">
                  <p className=" tradex-text-sm tradex-leading-[18px] tradex-text-body">
                    {comment?.email}
                  </p>
                  <a
                    href={comment.website}
                    rel="noreferrer"
                    target="_blank"
                    className=" tradex-text-sm tradex-leading-[18px] tradex-text-body"
                  >
                    <u>{comment.website}</u>
                  </a>
                </div>
              </div>
              <p className="tradex-text-base tradex-leading-6 tradex-text-body">
                {comment.message}
              </p>
            </div>
          ))}
      </div>
      {/* <p>{comment_allow}</p> */}
      {parseInt(comment_allow) === 1 && (
        <div className=" tradex-mt-6 tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-py-8 tradex-px-4 tradex-space-y-4">
          <h2 className=" tradex-text-2xl tradex-leading-[32px] !tradex-text-title">
            {t("Leave a Comment")}
          </h2>
          <form onSubmit={onSubmit}>
            <div className=" tradex-grid tradex-grid-cols-2 tradex-gap-6">
              <div>
                <input
                  type="text"
                  className=" tradex-min-h-12 tradex-flex tradex-items-center tradex-px-3 tradex-text-sm tradex-text-body !tradex-bg-transparent !tradex-border !tradex-border-background-primary tradex-rounded tradex-w-full"
                  id="name"
                  placeholder={t("Enter name")}
                  value={postComment.name}
                  onChange={(e) => {
                    setPostComment({
                      ...postComment,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <input
                  type="email"
                  className=" tradex-min-h-12 tradex-flex tradex-items-center tradex-px-3 tradex-text-sm tradex-text-body !tradex-bg-transparent !tradex-border !tradex-border-background-primary tradex-rounded tradex-w-full"
                  id="email"
                  placeholder={t("Enter email")}
                  value={postComment.email}
                  onChange={(e) => {
                    setPostComment({
                      ...postComment,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              <div className=" tradex-col-span-2">
                <input
                  type="text"
                  className=" tradex-min-h-12 tradex-flex tradex-items-center tradex-px-3 tradex-text-sm tradex-text-body !tradex-bg-transparent !tradex-border !tradex-border-background-primary tradex-rounded tradex-w-full"
                  id="website"
                  placeholder={t("Enter website")}
                  value={postComment.website}
                  onChange={(e) => {
                    setPostComment({
                      ...postComment,
                      website: e.target.value,
                    });
                  }}
                />
              </div>
              <div className=" tradex-col-span-2">
                <textarea
                  className=" tradex-py-2 tradex-min-h-20 tradex-flex tradex-items-center tradex-px-3 tradex-text-sm tradex-text-body !tradex-bg-transparent !tradex-border !tradex-border-background-primary tradex-rounded tradex-w-full"
                  id="message"
                  rows={6}
                  value={postComment.message}
                  placeholder={t("Enter message")}
                  onChange={(e) => {
                    setPostComment({
                      ...postComment,
                      message: e.target.value,
                    });
                  }}
                ></textarea>
              </div>
            </div>

            <button
              className="tradex-mt-6 tradex-px-7 tradex-py-4 tradex-bg-primary !tradex-text-white tradex-cursor-pointer tradex-text-base tradex-leading-[22px] tradex-font-bold tradex-rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? t("Please wait..") : t("Submit")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
