// import { useState } from "react";
// import axios from "axios";

// function Form({ setUser }) {
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:3000/users", {
//         userId: Number(userId),
//         password,
//       });

//       setUser(res.data.user);
//     } catch (err) {
//       alert(err.response?.data?.message || "Login Failed");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <h2>Login</h2>

//       <input
//         type="number"
//         placeholder="User ID"
//         value={userId}
//         onChange={(e) => setUserId(e.target.value)}
//       />

//       <br />
//       <br />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <br />
//       <br />

//       <button type="submit">
//         Login
//       </button>
//     </form>
//   );
// }

// export default Form;





