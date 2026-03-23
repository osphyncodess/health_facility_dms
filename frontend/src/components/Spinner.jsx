const Spinner = ({ Message = "hello" }) => {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
      <div
        className="spinner-message"
        // style="display: block; margin-top: 20px; background: white; padding: 5px; border-radius: 3px;"
      >
        {Message}
      </div>
    </div>
  );
};

export default Spinner;
