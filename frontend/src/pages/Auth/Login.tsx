import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../../components/loading-animation";

// Shared interface for input props
interface InputProps {
  value: string;
  touched: boolean;
}

interface EmailInputProps {
  email: InputProps;
  setEmail: React.Dispatch<React.SetStateAction<InputProps>>;
  showError: boolean;
}

interface PasswordInputProps {
  password: InputProps;
  setPassword: React.Dispatch<React.SetStateAction<InputProps>>;
  showError: boolean;
}

interface RememberMeProps {
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
}

function EmailInput({ email, setEmail, showError }: EmailInputProps) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block mb-2 text-sm font-medium text-textcolor"
      >
        Your email
      </label>
      <input
        type="email"
        id="email"
        value={email.value}
        placeholder="name@company.com"
        onBlur={() => setEmail((prev) => ({ ...prev, touched: true }))}
        onChange={(e) =>
          setEmail((prev) => ({ ...prev, value: e.target.value }))
        }
        className={`bg-primary text-textcolor border rounded-lg block w-full p-2.5 ${
          showError ? "border-red-500" : "border-accent"
        }`}
        required
      />
      {showError && (
        <p className="mt-1 text-sm text-red-500">
          Please enter a valid email address.
        </p>
      )}
    </div>
  );
}

function PasswordInput({
  password,
  setPassword,
  showError,
}: PasswordInputProps) {
  return (
    <div>
      <label
        htmlFor="password"
        className="block mb-2 text-sm font-medium text-textcolor"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        placeholder="••••••••"
        value={password.value}
        onBlur={() => setPassword((prev) => ({ ...prev, touched: true }))}
        onChange={(e) =>
          setPassword((prev) => ({ ...prev, value: e.target.value }))
        }
        className={`bg-primary text-textcolor border rounded-lg block w-full p-2.5 ${
          showError ? "border-red-500" : "border-accent"
        }`}
        required
      />
      {showError && (
        <p className="mt-1 text-sm text-red-500">
          Password must be at least 8 characters.
        </p>
      )}
    </div>
  );
}

function RememberMe({ rememberMe, setRememberMe }: RememberMeProps) {
  return (
    <div className="flex items-start">
      <input
        id="remember"
        type="checkbox"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
        className="w-4 h-4 rounded accent-accent"
      />
      <label htmlFor="remember" className="ml-2 text-sm text-textcolor">
        Remember me
      </label>
    </div>
  );
}

function ForgotPasswordLink() {
  return (
    <a
      href="#"
      className="text-sm font-medium text-accent hover:underline"
      onClick={() => console.log("Forgot Password clicked")}
    >
      Forgot password?
    </a>
  );
}

function SignUpLink() {
  const navigate = useNavigate();
  return (
    <p className="text-sm font-light text-textcolor">
      Don’t have an account yet?{" "}
      <a
        href="#"
        className="font-medium text-accent hover:underline"
        onClick={(e) => {
          e.preventDefault();
          navigate("/register");
        }}
      >
        Sign up
      </a>
    </p>
  );
}

function GoogleSignIn() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href =
        "http://localhost:8000/auth/oauth/login/?provider=google";
    }, 500);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center w-full gap-2 py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
      disabled={loading}
    >
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </>
      )}
    </button>
  );
}

function SubmitButton() {
  return (
    <button
      type="submit"
      className="w-full text-black bg-accent hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
    >
      Sign in
    </button>
  );
}

function InLineFunctions({ rememberMe, setRememberMe }: RememberMeProps) {
  return (
    <div className="flex items-center justify-between">
      <RememberMe rememberMe={rememberMe} setRememberMe={setRememberMe} />
      <ForgotPasswordLink />
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState<InputProps>({ value: "", touched: false });
  const [password, setPassword] = useState<InputProps>({
    value: "",
    touched: false,
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPassword = (value: string) => value.length >= 8;

  const emailError = email.touched && !isValidEmail(email.value);
  const passwordError = password.touched && !isValidPassword(password.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email.value) || !isValidPassword(password.value)) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });

      const data = await response.json();

      if (response.ok) {
        const { access_token, user_id } = data;
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("access_token", access_token);
        storage.setItem("user_id", user_id);
        setUserId(user_id);
        console.log("Login successful. user_id:", user_id);
        navigate("/homepage");
      } else {
        console.error("Login failed:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center min-h-screen transition-all ${
          isLoading ? "blur-sm pointer-events-none" : ""
        } bg-base`}
      >
        <div className="bg-secondary shadow-xl shadow-indigo-500/50 w-full rounded-lg sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-textcolor md:text-4xl">
                AthNest
              </h1>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-textcolor md:text-xl">
              Sign in to your account
            </h2>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <EmailInput
                email={email}
                setEmail={setEmail}
                showError={emailError}
              />
              <PasswordInput
                password={password}
                setPassword={setPassword}
                showError={passwordError}
              />
              <InLineFunctions
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
              />
              <SubmitButton />
              <GoogleSignIn />
              <SignUpLink />
            </form>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
}

export default LoginPage;
