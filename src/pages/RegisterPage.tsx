import React from "react";
import { useNavigate } from "react-router-dom";
import * as localAuth from "../services/localAuthService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email bắt buộc"),
  password: yup
    .string()
    .min(6, "Tối thiểu 6 ký tự")
    .required("Mật khẩu bắt buộc"),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    const ok = localAuth.register(data.email, data.password);
    if (!ok) return alert("Email đã tồn tại!");
    alert("Đăng ký thành công. Mời đăng nhập!");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-400 p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Đăng ký</h2>

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
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          title="Đăng ký"
        >
          Đăng ký
        </button>

        <p className="text-sm text-center">
          Đã có tài khoản?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
