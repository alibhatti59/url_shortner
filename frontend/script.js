const urlInput = document.getElementById("long-url-input");
const longurlbtn = document.getElementById("long-url-btn");
const urlList = document.getElementById("url-list");
const codeInput = document.getElementById("short-url-input");
const Findbtn = document.getElementById("short-url-btn");
const result = document.getElementById("result");
const CopyBtn = document.querySelector(".copy");
const shortCodeOutput = document.getElementById("short-code");
const urlcount = document.getElementById("url-count");
const qrinput = document.getElementById("qr_input");
const qrcodebtn = document.getElementById("qr_code_btn");
const qrdisplay = document.getElementById("qr_display");

const API = "http://127.0.0.1:8000";

longurlbtn.addEventListener("click", async () => {
    const longUrl = urlInput.value.trim();
    if (!longUrl) {
        alert("Enter URL");
        return;
    }

    const response = await fetch(
        `${API}/shortner?longUrl=${encodeURIComponent(longUrl)}`,
        {
            method: "POST"
        }
    );

    const data = await response.json();
    document.querySelector(".short-code").textContent = data.short_url;

    await loadUrls();

    urlInput.value = "";
});

Findbtn.addEventListener("click", async () => {

    const code = codeInput.value.trim();

    if (!code)
        return;

    const response = await fetch(
        `${API}/expand?short_url=${encodeURIComponent(code)}`
    );

    const data = await response.json();

    if (data.error) {
        result.textContent = data.error;
    } else {
        result.textContent = "Long URL : " + data.long_url;
    }
    codeInput.value = "";
});

CopyBtn.addEventListener("click", async () => {
    const code = shortCodeOutput.textContent.trim();
    if (!code) {
        alert("No short code to copy!");
        return;
    }
    try {
        await navigator.clipboard.writeText(code);
        alert("Short code copied!");
    } catch (err) {
        console.error(err);
        alert("Failed to copy.");
    }
});

qrcodebtn.addEventListener("click", async () => {

    const qr = qrinput.value.trim();
    if (!qr) return;

    const qrUrl = `${API}/Qr?short_url=${encodeURIComponent(qr)}`;

    qrdisplay.innerHTML = ""; // clear previous QR if any

    const img = document.createElement("img");
    img.src = qrUrl;
    img.alt = "QR Code";

    qrdisplay.appendChild(img);
});

async function loadUrls() {
    const response = await fetch(`${API}/urls`);
    const data = await response.json();

    urlcount.textContent = data.length;

    urlList.innerHTML = "";
    data.forEach(item => {

        const li = document.createElement("li");

        // Left cell: the short code
        const codeBlock = document.createElement("div");
        codeBlock.className = "link-code-block";
        codeBlock.innerHTML = `<span class="link-code">/${item.short_url}</span>`;

        // Right cell: the original long URL
        const urlText = document.createElement("div");
        urlText.className = "link-url";
        urlText.textContent = item.long_url;
        urlText.title = item.long_url; // full URL on hover, since long ones are truncated

        const copyBtn = document.createElement("button");
        copyBtn.className = "copycode";
        copyBtn.innerHTML = `<ion-icon name="copy-outline"></ion-icon>`;

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(item.short_url);
            alert("Short URL copied!");
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;

        deleteBtn.addEventListener("click", async () => {
            await fetch(
                `${API}/Delete?long_url=${encodeURIComponent(item.long_url)}`,
                {
                    method: "DELETE"
                }
            );
            loadUrls();
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(deleteBtn);

        li.appendChild(codeBlock);
        li.appendChild(urlText);
        li.appendChild(buttonContainer);

        urlList.appendChild(li);

    });
}
loadUrls();