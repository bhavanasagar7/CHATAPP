import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Baseurl } from "../../services/Api_Endpoint";

export default function Register() {
  const usenagi = useNavigate();
  const [user, setuser] = useState({
    name: "",
    email: "",
    password: "",
    profile: null,
  });

  const handlsubmit = async (e) => {
    e.preventDefault();
    try {
      const formadata = new FormData();
      formadata.append("name", user.name);
      formadata.append("email", user.email);
      formadata.append("password", user.password);
      formadata.append("profile", user.profile);

      const res = await axios.post(`${Baseurl}/api/auth/register`, formadata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.data;

      if (res.status === 200) {
        toast.success(data.message);
        setuser({
          name: "",
          email: "",
          password: "",
          profile: null,
        });
        usenagi("/login");
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  };

  const handlinput = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      setuser({ ...user, [name]: files[0] });
    } else {
      setuser({ ...user, [name]: value });
    }
  };

  const hanldloign = () => {
    usenagi("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-indigo-600 relative overflow-hidden">
      {/* Floating Pattern Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-symbol bg-blue-100 opacity-70 w-12 h-12 rounded-full"></div>
        <div className="floating-symbol bg-indigo-200 opacity-60 w-8 h-8 rounded-full"></div>
        <div className="floating-symbol bg-purple-300 opacity-50 w-16 h-16 rounded-full"></div>
        <div className="floating-symbol bg-teal-300 opacity-40 w-10 h-10 rounded-full"></div>
      </div>

      <div className="z-10 max-w-md w-full">
        <div className="p-10 rounded-2xl bg-white shadow-xl border border-opacity-20 border-gray-300">
          <h2 className="text-gray-800 text-center text-4xl font-bold mb-8">
            Register
          </h2>
          <form className="space-y-6" onSubmit={handlsubmit}>
            <div className="text-center">
              <label
                htmlFor="profile"
                className="flex text-white text-base px-5 py-0 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
              >
                <img
                  src={
                    user.profile
                      ? URL.createObjectURL(user.profile)
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_aZ5dsa-PRx_4ozdsfmRi6kNoZdG18gCv8Em9EtWrHCYJD3OT5sKer3_UfZ4c2uc8lrg&usqp=CAU"
                  }
                  alt="Profile"
                  className="rounded-[50%] w-[95px] h-[95px] object-cover"
                />
                <input
                  type="file"
                  id="profile"
                  name="profile"
                  onChange={handlinput}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label
                htmlFor="text"
                className="block mb-3 text-lg font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handlinput}
                id="name"
                className="w-full text-gray-800 text-sm px-4 py-3 rounded-md border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 placeholder:text-gray-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-3 text-lg font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handlinput}
                id="email"
                className="w-full text-gray-800 text-sm px-4 py-3 rounded-md border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 placeholder:text-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-3 text-lg font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handlinput}
                id="password"
                className="w-full text-gray-800 text-sm px-4 py-3 rounded-md border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 placeholder:text-gray-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 text-base font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:from-purple-600 hover:to-blue-700 focus:ring-4 focus:ring-indigo-300 transition duration-300 shadow-md"
              >
                Register
              </button>
            </div>

            <p className="text-gray-600 text-sm mt-6 text-center">
              Already have an account?{" "}
              <a
                href="javascript:void(0);"
                className="text-indigo-600 hover:underline font-semibold"
                onClick={hanldloign}
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        .floating-symbol {
          position: absolute;
          animation: float 12s infinite ease-in-out alternate,
            moveHorizontal 8s infinite ease-in-out alternate;
        }

        .floating-symbol:nth-child(1) {
          top: 10%;
          left: 5%;
          animation-duration: 6s;
        }
        .floating-symbol:nth-child(2) {
          top: 40%;
          right: 15%;
          animation-duration: 9s;
        }
        .floating-symbol:nth-child(3) {
          bottom: 20%;
          left: 30%;
          animation-duration: 12s;
        }
        .floating-symbol:nth-child(4) {
          bottom: 5%;
          right: 40%;
          animation-duration: 10s;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(15deg);
          }
        }

        @keyframes moveHorizontal {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(15px);
          }
        }
      `}</style>
    </div>
  );
}
