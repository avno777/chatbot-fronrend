import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as localAuth from "../services/localAuthService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email bắt buộc"),
  password: yup.string().required("Mật khẩu bắt buộc"),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    const result = localAuth.login(data.email, data.password);
    if (!result) return alert("Sai email hoặc mật khẩu!");
    login(result.token, result.user);
    navigate("/chat");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Đăng nhập</h2>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            className="w-full border px-3 py-2 rounded mt-1"
            type="email"
            placeholder="you@example.com"
          />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <input
            {...register("password")}
            className="w-full border px-3 py-2 rounded mt-1"
            type="password"
            placeholder="••••••••"
          />
          <p className="text-red-500 text-xs">{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          title="Đăng nhập"
        >
          Đăng nhập
        </button>

        <p className="text-sm text-center">
          Chưa có tài khoản?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
