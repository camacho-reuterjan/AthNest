import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../../components/loading-animation";

interface InputProps {
  value: string;
  touched: boolean;
}

function TextInput({
  label,
  id,
  type = "text",
  state,
  setState,
  placeholder,
  showError,
  errorMsg,
  onBlur,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  state: InputProps;
  setState: React.Dispatch<React.SetStateAction<InputProps>>;
  showError: boolean;
  errorMsg: string;
  onBlur?: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-textcolor"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={state.value}
        placeholder={placeholder}
        onBlur={() => {
          setState((prev) => ({ ...prev, touched: true }));
          onBlur?.();
        }}
        onChange={(e) =>
          setState((prev) => ({ ...prev, value: e.target.value }))
        }
        className={`bg-primary text-textcolor border rounded-lg block w-full p-2.5 ${
          showError ? "border-red-500" : "border-accent"
        }`}
        required
      />
      {showError && <p className="mt-1 text-sm text-red-500">{errorMsg}</p>}
    </div>
  );
}

function GoogleSignUp() {
  const [loading, setLoading] = useState(false);
  const handleGoogleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href =
        "http://localhost:8000/auth/oauth/login/?provider=google";
    }, 500);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignUp}
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
          Sign up with Google
        </>
      )}
    </button>
  );
}

function LoginLink() {
  const navigate = useNavigate();
  return (
    <p className="text-sm font-light text-textcolor">
      Already have an account?{" "}
      <a
        href="#"
        className="font-medium text-accent hover:underline"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        Log in
      </a>
    </p>
  );
}

function RegisterPage() {
  const [email, setEmail] = useState<InputProps>({ value: "", touched: false });
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [username, setUsername] = useState<InputProps>({
    value: "",
    touched: false,
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [password, setPassword] = useState<InputProps>({
    value: "",
    touched: false,
  });
  const [name, setName] = useState<InputProps>({ value: "", touched: false });
  const [grade, setGrade] = useState<InputProps>({ value: "", touched: false });
  const [strand, setStrand] = useState<InputProps>({
    value: "",
    touched: false,
  });
  const [section, setSection] = useState<InputProps>({
    value: "",
    touched: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidPassword = (val: string) => val.length >= 8;
  const isFilled = (val: string) => val.trim().length > 0;

  const checkEmailAvailability = async () => {
    if (!isValidEmail(email.value)) return;
    setCheckingEmail(true);
    try {
      const res = await fetch(
        `http://localhost:8000/users/check-email/?email=${email.value}`
      );
      const data = await res.json();
      setEmailAvailable(data.available);
    } catch (err) {
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const checkUsernameAvailability = async () => {
    if (!isFilled(username.value)) return;
    try {
      const res = await fetch(
        `http://localhost:8000/users/check-username/?username=${username.value}`
      );
      const data = await res.json();
      setUsernameAvailable(!data.exists);
    } catch (err) {
      setUsernameAvailable(null);
    }
  };

  console.log(checkingEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !isValidEmail(email.value) ||
      !isValidPassword(password.value) ||
      !isFilled(name.value) ||
      !isFilled(username.value) ||
      !isFilled(grade.value) ||
      !isFilled(strand.value) ||
      emailAvailable === false ||
      usernameAvailable === false
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const supabaseRes = await fetch("http://localhost:8000/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          full_name: name.value,
          username: username.value,
          section: section.value,
          strand: strand.value,
          grade: grade.value,
        }),
      });

      const supabaseData = await supabaseRes.json();
      console.log("Supabase response:", supabaseData);

      if (!supabaseRes.ok) {
        throw new Error(supabaseData.error || "Registration failed.");
      }

      navigate("/");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong during registration."
      );
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
        <div className="bg-secondary shadow-xl shadow-indigo-500/50 w-full rounded-lg sm:max-w-4xl xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-textcolor">AthNest</h1>
              <p className="text-md text-textcolor">Create your account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
                {/* Left: Account Info */}
                <div className="space-y-4">
                  <TextInput
                    label="Full Name"
                    id="name"
                    state={name}
                    setState={setName}
                    placeholder="Juan Dela Cruz"
                    showError={name.touched && !isFilled(name.value)}
                    errorMsg="Name is required."
                  />
                  <TextInput
                    label="Username"
                    id="username"
                    state={username}
                    setState={setUsername}
                    placeholder="juandc23"
                    showError={
                      username.touched &&
                      (!isFilled(username.value) || usernameAvailable === false)
                    }
                    errorMsg={
                      !isFilled(username.value)
                        ? "Username is required."
                        : usernameAvailable === false
                        ? "Username is already taken."
                        : ""
                    }
                    onBlur={checkUsernameAvailability}
                  />
                  <TextInput
                    label="Email"
                    id="email"
                    type="email"
                    state={email}
                    setState={setEmail}
                    placeholder="name@company.com"
                    showError={
                      email.touched &&
                      (!isValidEmail(email.value) || emailAvailable === false)
                    }
                    errorMsg={
                      !isValidEmail(email.value)
                        ? "Invalid email format."
                        : emailAvailable === false
                        ? "Email is already taken."
                        : ""
                    }
                    onBlur={checkEmailAvailability}
                  />
                  <TextInput
                    label="Password"
                    id="password"
                    type="password"
                    state={password}
                    setState={setPassword}
                    placeholder="••••••••"
                    showError={
                      password.touched && !isValidPassword(password.value)
                    }
                    errorMsg="Password must be at least 8 characters."
                  />
                </div>

                {/* Divider */}
                <div className="w-full h-full flex justify-center">
                  <div className="w-px bg-accent" />
                </div>

                {/* Right: School Info */}
                <div className="space-y-4">
                  <TextInput
                    label="Grade Level"
                    id="grade"
                    state={grade}
                    setState={setGrade}
                    placeholder="11"
                    showError={grade.touched && !isFilled(grade.value)}
                    errorMsg="Grade level is required."
                  />
                  <TextInput
                    label="Strand"
                    id="strand"
                    state={strand}
                    setState={setStrand}
                    placeholder="STEM"
                    showError={strand.touched && !isFilled(strand.value)}
                    errorMsg="Strand is required."
                  />
                  <TextInput
                    label="Section"
                    id="section"
                    state={section}
                    setState={setSection}
                    placeholder="Ignatius"
                    showError={false}
                    errorMsg=""
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  type="submit"
                  className="w-full text-black bg-accent hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-accent font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                >
                  Create Account
                </button>
                <GoogleSignUp />
                <LoginLink />
              </div>
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

export default RegisterPage;
