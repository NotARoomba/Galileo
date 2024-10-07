import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="m-auto flex flex-col gap-y-4">
        <p className="text-center text-8xl font-bold text-white">404</p>
        <Link
          to={"/"}
          className="text-black font-semibold px-5 py-2 bg-white hover:bg-black hover:outline outline-2 hover:outline-white outline-black hover:text-white transition-all duration-300  rounded-xl text-center"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
