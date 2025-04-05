import style from "./loader.module.css";

// Loader component
const Loader = () => {
  return (
    <div className={style?.loader}>
      <span className={style?.crossLoader}></span>
    </div>
  );
};

export default Loader;
