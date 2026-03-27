function Button({ onClick, title }) {
  return (<button onClick={onClick}>{title}</button>)
}

export default Button;


/* export default function Button({ onClick, title }) {

  return (

    <button

      className="inline-flex items-center text-white bg-blue-500 px-4 py-2 hover:bg-blue-600 mt-2"

      onClick={onClick}

    >

      {title}

    </button>

  );

} */