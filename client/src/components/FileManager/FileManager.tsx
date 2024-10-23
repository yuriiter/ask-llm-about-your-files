import { ActionButtons } from "./ActionButtons";
import { FileTable } from "./FileTable";
import { FileInfo } from "./types";

export const FileManager: React.FC = () => {
  const files: FileInfo[] = [
    {
      id: "243-fdsff23jf-sdbvn",
      name: "index.html",
      icon: "mdi mdi-file-document",
      uploaded: "12-10-2020, 09:45",
      size: "09 KB",
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-lg-12 col-sm-6">
                  <ActionButtons />
                </div>
              </div>

              <div className="d-flex flex-wrap">
                <h5 className="font-size-16 me-3">Files</h5>
                <div className="ms-auto">
                  <a href="#" className="fw-medium text-reset">
                    View All
                  </a>
                </div>
              </div>
              <hr className="mt-2" />
              <FileTable files={files} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
