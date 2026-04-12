import { MdError, MdInfo, MdWarning } from "react-icons/md";

const Alert = ({ message, type }) => {
  return (
    <>
      {type === "error" && (
        <div className="alerts alerts-error">
          <MdError size={30} />
          <span>{message}!</span>
        </div>
      )}

      {type === "warning" && (
        <div className="alerts alerts-warning">
          <MdWarning size={30} />
          <span>{message}!</span>
        </div>
      )}

      {type === "info" && (
        <div className="alerts alerts-info">
          <MdInfo size={30} />
          <span>{message}!</span>
        </div>
      )}
    </>
  );
};

export default Alert;
