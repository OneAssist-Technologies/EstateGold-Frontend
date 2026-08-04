import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
     <AuthLayout
      title="Where Dreams Find Their Address"
      description="Create your account and begin a journey toward exceptional living and endless possibilities."
    >
      <RegisterForm />
    </AuthLayout>
  );
}