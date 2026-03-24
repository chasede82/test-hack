import LoginForm from "@/features/auth/ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            M
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MeetSync</h1>
          <p className="mt-2 text-sm text-gray-500">
            AI 회의 협업 도구에 로그인하세요
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
