"use client";

import { signOut } from "next-auth/react";
import { FaCommentAlt } from "react-icons/fa";

export const ActionButtons = () => {
  return (
    <div className="mt-4 mt-sm-0 d-flex align-items-center justify-content-between">
      <button
        className="btn btn-primary d-flex justify-content-center align-items-center rounded-circle"
        style={{ width: "40px", height: "40px" }}
      >
        <FaCommentAlt />
      </button>
      <div className="mb-2 me-2">
        <div className="gap-2 d-flex">
          <button className="btn btn-primary" type="button">
            <i className="mdi mdi-plus me-1"></i> Upload new file
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => signOut({ redirect: true, redirectTo: "/sign-in" })}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
