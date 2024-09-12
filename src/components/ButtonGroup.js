const ButtonGroup = ({title, buttons, width}) => {
  const getButtonClass = (color) => {
    return color ? "" : "radius";
  };
  return (
      <div className="block" style={{width: width}}>
        <h3 className="title">{title}</h3>
        <span></span>
        {buttons.map((button, index) => (
          <button key={index} onClick={button.onClick} className="btn">
            {
              button.color ? (
                <div
                  className="circle"
                  style={{background: button.color}}
                ></div>
              ) : null
            }
            <div className={getButtonClass(button.color)}>
              {button.label}
            </div>
          </button>
        ))}
      </div>
  );
};

export default ButtonGroup;
