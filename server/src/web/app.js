function register() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  fetch("https://example.com/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Registration successful!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during registration.");
    });
}

function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch("https://example.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Login successful!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during login.");
    });
}
