"use client";

import BoxIcon from "../BoxIcon";
import { signOut } from "next-auth/react";

export const ActionButtons = () => {
  return (
    <div className="mt-4 mt-sm-0 d-flex align-items-center justify-content-sm-end">
      <div className="mb-2 me-2">
        <div className="dropdown gap-2 d-flex">
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
          <div className="dropdown-menu dropdown-menu-end">
            <a className="dropdown-item" href="#">
              <i className="mdi mdi-folder-outline me-1"></i> Folder
            </a>
            <a className="dropdown-item" href="#">
              <i className="mdi mdi-file-outline me-1"></i> File
            </a>
          </div>
        </div>
      </div>
      <div className="dropdown mb-0">
        <a
          className="btn btn-link text-muted dropdown-toggle p-1 mt-n2"
          role="button"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
        >
          <BoxIcon name="dots-vertical-rounded" size={20} />
        </a>
        <div className="dropdown-menu dropdown-menu-end">
          <a className="dropdown-item" href="#">
            Share Files
          </a>
          <a className="dropdown-item" href="#">
            Share with me
          </a>
          <a className="dropdown-item" href="#">
            Other Actions
          </a>
        </div>
      </div>
    </div>
  );
};
