const BlockComponent = ({ gradientClass, icon }: any) => {
  return (
    <div className={`block-container ${gradientClass}`}>
      <div className="btn-back"></div>
      <div className="btn-front">
        <svg className="frame">
          <rect rx="32" stroke={`url(#${gradientClass})`} />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
        >
          {icon}
        </svg>
      </div>
    </div>
  );
};

export default BlockComponent;

//