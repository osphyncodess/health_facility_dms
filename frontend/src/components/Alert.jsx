import { MdError, MdInfo, MdWarning } from "react-icons/md";

const Alert = ({ message, type }) => {
  return (
    <>
      {type === "error" && (
        <div className="alert alert-error">
          <MdError size={30} />
          <span>{message}!</span>
        </div>
      )}

      {type === "warning" && (
        <div className="alert alert-warning">
          <MdWarning size={30} />
          <span>{message}!</span>
        </div>
      )}

      {type === "info" && (
        <div className="alert alert-info">
          <MdInfo size={30} />
          <span>{message}!</span>
        </div>
      )}
    </>
  );
};

export default Alert;
