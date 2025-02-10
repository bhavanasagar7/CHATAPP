import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Baseurl } from "../../services/Api_Endpoint";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/Slice/authSlice";

export default function Login() {
  const usegatReg = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userlogin, setuserlogin] = useState({
    email: "",
    password: "",
  });

  const hadleuserlogin = (e) => {
    const { name, value } = e.target;
    setuserlogin({ ...userlogin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: userlogin.email,
      password: userlogin.password,
    };

    try {
      const resp = await axios.post(`${Baseurl}/api/auth/login`, userData);
      const data = resp.data;

      if (resp.status === 200) {
        toast.success(data.message);
        setuserlogin({
          email: "",
          password: "",
        });
        dispatch(setCredentials({ user: data.user, token: data.token }));
        navigate("/");
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  };

  const handlReister = () => {
    usegatReg("/register");
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
            Chat Login
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-700 text-lg mb-2 block">Email</label>
              <input
                name="email"
                value={userlogin.email}
                onChange={hadleuserlogin}
                type="email"
                required
                className="w-full text-gray-800 text-sm px-4 py-3 rounded-md border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 placeholder:text-gray-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-gray-700 text-lg mb-2 block">Password</label>
              <input
                name="password"
                value={userlogin.password}
                onChange={hadleuserlogin}
                type="password"
                required
                className="w-full text-gray-800 text-sm px-4 py-3 rounded-md border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 placeholder:text-gray-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 text-base font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:from-purple-600 hover:to-blue-700 focus:ring-4 focus:ring-indigo-300 transition duration-300 shadow-md"
              >
                Login
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-6 text-center">
              Don't have an account?{" "}
              <a
                href="javascript:void(0);"
                className="text-indigo-600 hover:underline font-semibold"
                onClick={handlReister}
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        /* Floating Pattern Animations */
        .floating-symbol {
          position: absolute;
          animation: float 12s infinite ease-in-out alternate,
            moveHorizontal 8s infinite ease-in-out alternate;
        }

        /* Customize Symbols */
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

        /* Keyframes for Vertical Floating */
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(15deg);
          }
        }

        /* Keyframes for Horizontal Movement */
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
