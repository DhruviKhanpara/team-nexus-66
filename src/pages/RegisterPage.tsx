/**
 * RegisterPage — react-hook-form + Zod + usePersistRegister use case.
 *
 * Errors are surfaced via the centralized toast layer in baseApi.
 */

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePersistRegister } from "@/domain/auth";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/features/authSlice";
import { MessageSquare } from "lucide-react";
import { TextField, PasswordField } from "@/components/forms";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading } = usePersistRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // TODO: Replace mock with: await registerUser(data);
    dispatch(
      setUser({
        id: "mock-id",
        name: data.name,
        email: data.email,
        iconUrl: "",
      }),
    );
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get started with your team
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Full name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label="Username"
            placeholder="johndoe"
            error={errors.username?.message}
            {...register("username")}
          />
          <TextField
            label="Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordField
            label="Password"
            placeholder="Min 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
