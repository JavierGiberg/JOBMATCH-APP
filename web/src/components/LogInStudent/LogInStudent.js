import React, { useState } from "react";
import "./LogInStudent.css";

const LogInStudent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGithubUsernameChange = (e) => {
    setGithubUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:8000/api/login?username=${username}&password=${password}&gitgubUsername=${githubUsername}`
    )
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gitgubUsername">GitHub Username</label>
          <input
            type="text"
            id="gitgubUsername"
            value={githubUsername}
            onChange={handleGithubUsernameChange}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogInStudent;
