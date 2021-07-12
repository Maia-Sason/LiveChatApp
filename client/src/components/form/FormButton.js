import { Button, withStyles } from "@material-ui/core";

const FormButton = ({ button, handleClick, clr, bgc, type }) => {
  const FButton = withStyles((theme) => ({
    root: {
      backgroundColor: bgc,
      color: clr,
      // padding: "15px 30px",
      width: "12em",
      height: "4em",
      whiteSpace: "nowrap",
      fontWeight: "bold",
      boxShadow: "0px 0px 13px 0px rgba(200,200,200,0.65)",
    },
  }))(Button);

  return (
    <FButton
      size={"large"}
      variant="contained"
      onClick={handleClick}
      type={type}
    >
      {button}
    </FButton>
  );
};

export default FormButton;
