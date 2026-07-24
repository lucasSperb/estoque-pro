import "./Button.css";

function Button({

    children,

    icon,

    variant="primary",

    type="button",

    onClick,

    disabled=false,

}){

    return(

        <button

            type={type}

            onClick={onClick}

            disabled={disabled}

            className={`btn btn--${variant}`}

        >

            {icon}

            <span>

                {children}

            </span>

        </button>

    );

}

export default Button;