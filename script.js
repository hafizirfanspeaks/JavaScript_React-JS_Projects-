document.getElementById("username").addEventListener("keydown", function (e) {
  if (e.key === "Enter") getProfile();
});

async function getProfile() {
  const username = document.getElementById("username").value.trim();
  const card = document.getElementById("profileCard");
  card.innerHTML = "";

  if (!username) {
    card.innerHTML = `<div class="message">Please enter a GitHub username.</div>`;
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error("User not found");

    const user = await response.json();

    const twitter = user.twitter_username ? `https://twitter.com/${user.twitter_username}` : null;
    const blog = user.blog && user.blog.startsWith("http") ? user.blog : user.blog ? `https://${user.blog}` : null;
    const github = user.html_url;
    const now = new Date();
    const pkTime = now.toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

    card.innerHTML = `
      <div class="card" id="downloadableCard">
        <img src="${user.avatar_url}" alt="Avatar" crossorigin="anonymous" />
        <div class="info">
          <h2>${user.name || user.login}</h2>
          <p><strong>Username:</strong> ${user.login}</p>
          <p><strong>Bio:</strong> ${user.bio || "No bio provided"}</p>
          <p><strong>Location:</strong> ${user.location || "N/A"}</p>
          <p><strong>Company:</strong> ${user.company || "N/A"}</p>
          <p><strong>Public Repos:</strong> ${user.public_repos}</p>
          <p><strong>Followers:</strong> ${user.followers} | <strong>Following:</strong> ${user.following}</p>
          <p><strong>Time:</strong> ${pkTime}</p>

          <div class="social-icons">
            <a href="${github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
            ${twitter ? `<a href="${twitter}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>` : ""}
            ${blog ? `<a href="${blog}" target="_blank" title="Website"><i class="fas fa-link"></i></a>` : ""}
          </div>

          <p class="urdu-link">🔗 GitHub profile link: <a href="${github}" target="_blank">${github}</a></p>
        </div>
      </div>
    `;
  } catch (error) {
    card.innerHTML = `<div class="message">Oops! GitHub user not found. Please try again.</div>`;
  }
}

function downloadCard() {
  const card = document.getElementById("downloadableCard");
  if (!card) {
    alert("No profile loaded to download.");
    return;
  }

  html2canvas(card, {
    useCORS: true,
    allowTaint: false,
    scale: 2
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "github-profile.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
