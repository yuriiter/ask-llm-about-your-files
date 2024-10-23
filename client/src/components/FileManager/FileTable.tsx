import { MdDelete } from "react-icons/md";
import { FileInfo } from "./types";

export const FileTable: React.FC<{ files: FileInfo[] }> = ({ files }) => {
  return (
    <div className="table-responsive">
      <table className="table align-middle table-nowrap table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Date uploaded</th>
            <th scope="col">Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>
                <a href="#" className="text-dark fw-medium">
                  <i
                    className={`${file.icon} font-size-16 align-middle text-primary me-2`}
                  ></i>
                  {file.name}
                </a>
              </td>
              <td>{file.uploaded}</td>
              <td>{file.size}</td>
              <td>
                <div className="dropdown">
                  <a className="text-muted" role="button">
                    <MdDelete size={20} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
