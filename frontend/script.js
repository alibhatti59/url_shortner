const shortenForm = document.getElementById("shorten-form");
const urlInput = document.getElementById("url");
const shortenResult = document.getElementById("shorten-result");
const shortLinkText = document.getElementById("short-link-text");
const shortenError = document.getElementById("shorten-error");
const copyBtn = document.getElementById("copy-btn");

let currentShortUrl = "";

shortenForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    shortenResult.classList.add("hidden");
    shortenError.classList.add("hidden");

    const longUrl = urlInput.value;

    try {
        const response = await fetch("/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ long_url: longUrl })
        });

        if (!response.ok) {
            throw new Error("Something went wrong. Try again.");
        }

        const data = await response.json();
        currentShortUrl = window.location.origin + "/" + data.short_code;

        shortLinkText.textContent = currentShortUrl;
        shortenResult.classList.remove("hidden");

        urlInput.value = "";
        loadAllLinks();

    } catch (error) {
        shortenError.textContent = error.message;
        shortenError.classList.remove("hidden");
    }
});

copyBtn.addEventListener("click", async function () {
    try {
        await navigator.clipboard.writeText(currentShortUrl);
        copyBtn.textContent = "Copied!";
        setTimeout(function () {
            copyBtn.textContent = "Copy";
        }, 1500);
    } catch (error) {
        copyBtn.textContent = "Failed";
    }
});


const lookupForm = document.getElementById("lookup-form");
const lookupCodeInput = document.getElementById("lookup-code");
const lookupResult = document.getElementById("lookup-result");
const lookupError = document.getElementById("lookup-error");

lookupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    lookupResult.classList.add("hidden");
    lookupError.classList.add("hidden");

    const code = lookupCodeInput.value;

    try {
        const response = await fetch("/api/stats/" + code);
        if (!response.ok) {
            throw new Error("Short URL not found.");
        }
        const data = await response.json();

        lookupResult.textContent = data.long_url + " — " + data.clicks + " clicks";
        lookupResult.classList.remove("hidden");

    } catch (error) {
        lookupError.textContent = error.message;
        lookupError.classList.remove("hidden");
    }
});


const linksList = document.getElementById("links-list");
const linkCount = document.getElementById("link-count");

async function loadAllLinks() {
    const response = await fetch("/api/urls");
    const urls = await response.json();

    linkCount.textContent = urls.length;
    linksList.innerHTML = "";

    urls.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "link-row";

        row.innerHTML = `
            <span class="code-col">/${item.short_code}</span>
            <span class="long-col">${item.long_url}</span>
            <span class="actions">
                <button class="copy-row-btn" data-code="${item.short_code}">⧉</button>
                <button class="delete-row-btn" data-code="${item.short_code}">🗑</button>
            </span>
        `;

        linksList.appendChild(row);
    });

    document.querySelectorAll(".copy-row-btn").forEach(function (btn) {
        btn.addEventListener("click", async function () {
            const code = btn.getAttribute("data-code");
            const fullUrl = window.location.origin + "/" + code;
            await navigator.clipboard.writeText(fullUrl);
            btn.textContent = "✓";
            setTimeout(function () { btn.textContent = "⧉"; }, 1000);
        });
    });

    document.querySelectorAll(".delete-row-btn").forEach(function (btn) {
        btn.addEventListener("click", async function () {
            const code = btn.getAttribute("data-code");
            await fetch("/api/urls/" + code, { method: "DELETE" });
            loadAllLinks();
        });
    });
}

loadAllLinks();