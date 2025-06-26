// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../contexts/userContexts"; 
// import bgImage from '../assets/huggingPatient.jpg';
// import appIcon from '../assets/boss.gif';

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loginSource, setLoginSource] = useState("Sales");
//     const [passwordType, setPasswordType] = useState("password");
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [rememberMe, setRememberMe] = useState(false);
//     const navigate = useNavigate();
//     const { loginUser } = useUser(); // Use the context

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (!email || !password) {
//             setError("Email and password are required");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await fetch(
//                 "https://prognosis-api.leadwayhealth.com/api/Account/ExternalPortalLogin", 
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                     body: JSON.stringify({
//                         Email: email,
//                         Password: password,
//                         LoginSource: loginSource
//                     })
//                 }
//             );

//             const data = await response.json();
//             console.log("API Response:", data);

//             if (response.ok && data.status === 200 && data.result && data.result.length > 0) {
//                 const userData = data.result[0];
//                 loginUser({
//                     email: userData.Email,
//                     userName: userData.UserName,
//                     providerId: userData.provider_id,
//                     group_name: userData.group_name,
//                     unit: userData.group_name, // Also store as unit for backward compatibility
//                     fullName: userData.surname, // Fixing typo in original code (was sumame)
//                     firstname: userData.firstname,
//                     surname: userData.surname,
//                     isAdmin: userData.IsAdministrator
//                 });

//                 if (rememberMe) {
//                     localStorage.setItem('rememberMe', 'true');
//                 }

//                 navigate('/roleDashboard');
//             } else {
//                 const errorMessage = data.message || "Login failed. Please check your credentials.";
//                 setError(errorMessage);
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setError("Network error. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex bg-[#F0F2FA] w-full h-[100vh]">
//             <div className="pt-[3rem] pl-[5rem] w-[45%]">
//                 <img src="/LeadwayLogo.svg" alt="Leadway Logo" />
//                 <div>
//                     <h1 className="text-[#585858] mt-[5rem] font-bold text-[32px]">
//                         LeadWay Approval System
//                     </h1>
//                     <p className="text-[#AFB0B1] text-[15px]">
//                         Much better than the traditional Zoho.
//                     </p>
//                 </div>
                
//                 <form onSubmit={handleLogin} className="w-[80%]">
//                     {/* Email Input */}
//                     <div className="w-full mt-8">
//                         <div 
//                             className="bg-white p-[10px] px-7 py-5 flex justify-between items-center w-full rounded-[4px]"
//                             style={{ boxShadow: "#0000000F" }}
//                         >
//                             <div className="w-full">
//                                 <label className="block">Email</label>
//                                 <input
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => {
//                                         setEmail(e.target.value);
//                                         if (error) setError("");
//                                     }}
//                                     placeholder="Enter your email"
//                                     className="outline-none w-full mt-[10px]"
//                                     required
//                                 />
//                             </div>
//                             <img src="/Loginicons@3x.svg" alt="User Icon" />
//                         </div>
//                     </div>

//                     {/* Password Input */}
//                     <div className="w-full mt-7">
//                         <div 
//                             className="bg-white p-[10px] px-7 py-5 flex justify-between items-center w-full rounded-[4px]"
//                             style={{ boxShadow: "#0000000F" }}
//                         >
//                             <div className="w-full">
//                                 <label className="block">Password</label>
//                                 <input
//                                     type={passwordType}
//                                     value={password}
//                                     onChange={(e) => {
//                                         setPassword(e.target.value);
//                                         if (error) setError("");
//                                     }}
//                                     placeholder="************"
//                                     className="outline-none w-full mt-[10px]"
//                                     required
//                                 />
//                             </div>
//                             <div className="text-center flex flex-col items-center">
//                                 {passwordType === "password" ? (
//                                     <p
//                                         className="mb-3 text-[#C61531] cursor-pointer"
//                                         onClick={() => setPasswordType("text")}
//                                     >
//                                         SHOW
//                                     </p>
//                                 ) : (
//                                     <p
//                                         className="mb-3 text-[#C61531] cursor-pointer"
//                                         onClick={() => setPasswordType("password")}
//                                     >
//                                         HIDE
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Error Message */}
//                     {error && (
//                         <div className="text-red-500 mt-2 text-sm">
//                             {error}
//                         </div>
//                     )}

//                     {/* Remember Me and Reset Password */}
//                     <div className="flex justify-between mt-8">
//                         <div className="flex gap-1">
//                             <input
//                                 type="checkbox"
//                                 checked={rememberMe}
//                                 onChange={(e) => setRememberMe(e.target.checked)}
//                                 className="accent-[#C61531] w-4 h-4"
//                                 id="rememberMe"
//                             />
//                             <label htmlFor="rememberMe">Keep me logged in</label>
//                         </div>
//                         <button 
//                             type="button"
//                             onClick={() => navigate('/reset-password')}
//                             className="text-blue-950 hover:underline"
//                         >
//                             Reset Password
//                         </button>
//                     </div>

//                     {/* Login Button */}
//                     <button 
//                         type="submit" 
//                         disabled={isLoading}
//                         className="w-full bg-blue-950 hover:bg-[#C61531] mt-8 py-4 rounded-[5px] text-white disabled:opacity-50"
//                     >
//                         {isLoading ? "Logging in..." : "Login"}
//                     </button>
//                 </form>
//             </div>

//             {/* Right Side Image Section */}
//             <div className="w-[55%] relative">
//                 <img
//                     src={bgImage}
//                     alt="Background"
//                     className="h-full w-full object-cover"
//                 />

//                 <div className="cursor-pointer absolute top-[40px] right-[60px] flex gap-3">
//                     <img src="questionMark.svg" alt="Help" />
//                     <p>Help</p>
//                 </div>

//                 <div className="flex rounded-lg absolute bottom-[30px] justify-center w-full">
//                     <div className="bg-white rounded-l-lg items-center justify-items-center py-2">
//                         <img
//                             src={appIcon}
//                             alt="App Icon"
//                             className="w-12 h-12"
//                         />
//                     </div>
//                     <div className="bg-gray-200 w-[45%] rounded-r-lg py-2">
//                         <p className="font-500 cursor-pointer ml-2 text-blue-950">
//                             Approval Level System
//                         </p>
//                         <p className="font-500 cursor-pointer mt-2 ml-2 text-gray-500">
//                             Modulate Payments and Transactions
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../contexts/userContexts"; 
// import bgImage from '../assets/huggingPatient.jpg';
// import appIcon from '../assets/boss.gif';

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loginSource, setLoginSource] = useState("Sales");
//     const [passwordType, setPasswordType] = useState("password");
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [rememberMe, setRememberMe] = useState(false);
//     const navigate = useNavigate();
//     const { loginUser } = useUser(); // Use the context

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");
//         if (!email || !password) {
//             setError("Email and password are required");
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const response = await fetch(
//                 "https://prognosis-api.leadwayhealth.com/api/Account/ExternalPortalLogin", 
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Accept": "application/json"
//                     },
//                     body: JSON.stringify({
//                         Email: email,
//                         Password: password,
//                         LoginSource: loginSource
//                     })
//                 }
//             );
//             const data = await response.json();
//             console.log("API Response:", data);
//             if (response.ok && data.status === 200 && data.result && data.result.length > 0) {
//                 loginUser(data); // Pass the entire API response to loginUser
//                 if (rememberMe) {
//                     localStorage.setItem('rememberMe', 'true');
//                 }
//                 navigate('/roleDashboard');
//             } else {
//                 const errorMessage = data.message || "Login failed. Please check your credentials.";
//                 setError(errorMessage);
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setError("Network error. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex bg-[#F0F2FA] w-full h-[100vh]">
//             <div className="pt-[3rem] pl-[5rem] w-[45%]">
//                 <img src="/LeadwayLogo.svg" alt="Leadway Logo" />
//                 <div>
//                     <h1 className="text-[#585858] mt-[5rem] font-bold text-[32px]">
//                         LeadWay Approval System
//                     </h1>
//                     <p className="text-[#AFB0B1] text-[15px]">
//                         Much better than the traditional Zoho.
//                     </p>
//                 </div>
//                 <form onSubmit={handleLogin} className="w-[80%]">
//                     {/* Email Input */}
//                     <div className="w-full mt-8">
//                         <div 
//                             className="bg-white p-[10px] px-7 py-5 flex justify-between items-center w-full rounded-[4px]"
//                             style={{ boxShadow: "#0000000F" }}
//                         >
//                             <div className="w-full">
//                                 <label className="block">Email</label>
//                                 <input
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => {
//                                         setEmail(e.target.value);
//                                         if (error) setError("");
//                                     }}
//                                     placeholder="Enter your email"
//                                     className="outline-none w-full mt-[10px]"
//                                     required
//                                 />
//                             </div>
//                             <img src="/Loginicons@3x.svg" alt="User Icon" />
//                         </div>
//                     </div>
//                     {/* Password Input */}
//                     <div className="w-full mt-7">
//                         <div 
//                             className="bg-white p-[10px] px-7 py-5 flex justify-between items-center w-full rounded-[4px]"
//                             style={{ boxShadow: "#0000000F" }}
//                         >
//                             <div className="w-full">
//                                 <label className="block">Password</label>
//                                 <input
//                                     type={passwordType}
//                                     value={password}
//                                     onChange={(e) => {
//                                         setPassword(e.target.value);
//                                         if (error) setError("");
//                                     }}
//                                     placeholder="************"
//                                     className="outline-none w-full mt-[10px]"
//                                     required
//                                 />
//                             </div>
//                             <div className="text-center flex flex-col items-center">
//                                 {passwordType === "password" ? (
//                                     <p
//                                         className="mb-3 text-[#C61531] cursor-pointer"
//                                         onClick={() => setPasswordType("text")}
//                                     >
//                                         SHOW
//                                     </p>
//                                 ) : (
//                                     <p
//                                         className="mb-3 text-[#C61531] cursor-pointer"
//                                         onClick={() => setPasswordType("password")}
//                                     >
//                                         HIDE
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     {/* Error Message */}
//                     {error && (
//                         <div className="text-red-500 mt-2 text-sm">
//                             {error}
//                         </div>
//                     )}
//                     {/* Remember Me and Reset Password */}
//                     <div className="flex justify-between mt-8">
//                         <div className="flex gap-1">
//                             <input
//                                 type="checkbox"
//                                 checked={rememberMe}
//                                 onChange={(e) => setRememberMe(e.target.checked)}
//                                 className="accent-[#C61531] w-4 h-4"
//                                 id="rememberMe"
//                             />
//                             <label htmlFor="rememberMe">Keep me logged in</label>
//                         </div>
//                         <button 
//                             type="button"
//                             onClick={() => navigate('/reset-password')}
//                             className="text-blue-950 hover:underline"
//                         >
//                             Reset Password
//                         </button>
//                     </div>
//                     {/* Login Button */}
//                     <button 
//                         type="submit" 
//                         disabled={isLoading}
//                         className="w-full bg-blue-950 hover:bg-[#C61531] mt-8 py-4 rounded-[5px] text-white disabled:opacity-50"
//                     >
//                         {isLoading ? "Logging in..." : "Login"}
//                     </button>
//                 </form>
//             </div>
//             {/* Right Side Image Section */}
//             <div className="w-[55%] relative">
//                 <img
//                     src={bgImage}
//                     alt="Background"
//                     className="h-full w-full object-cover"
//                 />
//                 <div className="cursor-pointer absolute top-[40px] right-[60px] flex gap-3">
//                     <img src="questionMark.svg" alt="Help" />
//                     <p>Help</p>
//                 </div>
//                 <div className="flex rounded-lg absolute bottom-[30px] justify-center w-full">
//                     <div className="bg-white rounded-l-lg items-center justify-items-center py-2">
//                         <img
//                             src={appIcon}
//                             alt="App Icon"
//                             className="w-12 h-12"
//                         />
//                     </div>
//                     <div className="bg-gray-200 w-[45%] rounded-r-lg py-2">
//                         <p className="font-500 cursor-pointer ml-2 text-blue-950">
//                             Approval Level System
//                         </p>
//                         <p className="font-500 cursor-pointer mt-2 ml-2 text-gray-500">
//                             Modulate Payments and Transactions
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; 
import bgImage from '../assets/huggingPatient.jpg';
import appIcon from '../assets/boss.gif';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginSource, setLoginSource] = useState("Sales");
    const [passwordType, setPasswordType] = useState("password");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(
                "https://prognosis-api.leadwayhealth.com/api/Account/ExternalPortalLogin", 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        Email: email,
                        Password: password,
                        LoginSource: loginSource
                    })
                }
            );
            const data = await response.json();
            if (response.ok && data.status === 200 && data.result && data.result.length > 0) {
                loginUser(data);
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                navigate('/roleDashboard');
            } else {
                const errorMessage = data.message || "Login failed. Please check your credentials.";
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex bg-[#F0F2FA] w-full h-[100vh]">
            <div className="pt-[3rem] pl-[5rem] w-[45%]">
                <img src="/LeadwayLogo.svg" alt="Leadway Logo" />
                <div>
                    <h1 className="text-[#585858] mt-[5rem] font-bold text-[32px]">
                        LeadWay Approval System
                    </h1>
                    <p className="text-[#AFB0B1] text-[15px]">
                        Much better than the traditional Zoho.
                    </p>
                </div>
                <form onSubmit={handleLogin} className="w-[80%]">
                    <div className="w-full mt-8">
                        <div 
                            className="bg-white p-[10px] px-7 py-5 flex justify-between items-center w-full rounded-[4px]"
                            style={{ boxShadow: "#0000000F" }}
                        >
                            <div className="w-full">
                                <label className="block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="Enter your email"
                                    className="outline-none w-full mt-[10px]"
                                    required
                                />
                            </div>
                            <img src="/Loginicons@3x.svg" alt="User Icon" />
                        </div>
                    </div>
                    <div className="w-full mt-7">
                        <div 
                            className="bg-white p-[10px] px-7 py-5 flex justify-between items-center w-full rounded-[4px]"
                            style={{ boxShadow: "#0000000F" }}
                        >
                            <div className="w-full">
                                <label className="block">Password</label>
                                <input
                                    type={passwordType}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="************"
                                    className="outline-none w-full mt-[10px]"
                                    required
                                />
                            </div>
                            <div className="text-center flex flex-col items-center">
                                {passwordType === "password" ? (
                                    <p
                                        className="mb-3 text-[#C61531] cursor-pointer"
                                        onClick={() => setPasswordType("text")}
                                    >
                                        SHOW
                                    </p>
                                ) : (
                                    <p
                                        className="mb-3 text-[#C61531] cursor-pointer"
                                        onClick={() => setPasswordType("password")}
                                    >
                                        HIDE
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-500 mt-2 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-between mt-8">
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="accent-[#C61531] w-4 h-4"
                                id="rememberMe"
                            />
                            <label htmlFor="rememberMe">Keep me logged in</label>
                        </div>
                        <button 
                            type="button"
                            onClick={() => navigate('/reset-password')}
                            className="text-blue-950 hover:underline"
                        >
                            Reset Password
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-950 hover:bg-[#C61531] mt-8 py-4 rounded-[5px] text-white disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
            <div className="w-[55%] relative">
                <img
                    src={bgImage}
                    alt="Background"
                    className="h-full w-full object-cover"
                />
                <div className="cursor-pointer absolute top-[40px] right-[60px] flex gap-3">
                    <img src="questionMark.svg" alt="Help" />
                    <p>Help</p>
                </div>
                <div className="flex rounded-lg absolute bottom-[30px] justify-center w-full">
                    <div className="bg-white rounded-l-lg items-center justify-items-center py-2">
                        <img
                            src={appIcon}
                            alt="App Icon"
                            className="w-12 h-12"
                        />
                    </div>
                    <div className="bg-gray-200 w-[45%] rounded-r-lg py-2">
                        <p className="font-500 cursor-pointer ml-2 text-blue-950">
                            Approval Level System
                        </p>
                        <p className="font-500 cursor-pointer mt-2 ml-2 text-gray-500">
                            Modulate Payments and Transactions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;