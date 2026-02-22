const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const strengthBar = document.getElementById("strengthBar");
const passwordError = document.getElementById("passwordError");
const dobInput = document.getElementById("dob");
const ageError = document.getElementById("ageError");
const signupForm = document.getElementById("signupForm");
const verificationSection = document.getElementById("verification");
const formMessage = document.getElementById("formMessage");
const verifyForm = document.getElementById("verifyForm");
const verifyMessage = document.getElementById("verifyMessage");
const logoUpload = document.getElementById("logoUpload");
const logoSlots = document.querySelectorAll(".logo-slot");

const strengthColors = ["#ef4444", "#f59e0b", "#a3e635", "#22c55e"];

function calculateStrength(value) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, 4);
}

function updateStrength() {
  const score = calculateStrength(passwordInput.value);
  const percent = (score / 4) * 100;
  strengthBar.style.width = `${percent}%`;
  strengthBar.style.background = strengthColors[Math.max(score - 1, 0)] || strengthColors[0];
}

function checkPasswordMatch() {
  if (!confirmPasswordInput.value) {
    passwordError.style.display = "none";
    return;
  }
  const matches = passwordInput.value === confirmPasswordInput.value;
  passwordError.style.display = matches ? "none" : "block";
}

function checkAge() {
  if (!dobInput.value) {
    ageError.style.display = "none";
    return;
  }
  const dob = new Date(dobInput.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  const isAdult = age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
  ageError.style.display = isAdult ? "none" : "block";
  return isAdult;
}

passwordInput.addEventListener("input", () => {
  updateStrength();
  checkPasswordMatch();
});

confirmPasswordInput.addEventListener("input", checkPasswordMatch);

dobInput.addEventListener("change", checkAge);

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isAdult = checkAge();
  const passwordsMatch = passwordInput.value === confirmPasswordInput.value;

  if (!isAdult || !passwordsMatch) {
    formMessage.textContent = "Please fix the highlighted errors before submitting.";
    formMessage.style.color = "#e11d48";
    return;
  }

  formMessage.textContent = "Form submitted successfully. Please verify your email.";
  formMessage.style.color = "#14b8a6";
  verificationSection.classList.remove("hidden");
  verificationSection.scrollIntoView({ behavior: "smooth" });
});

verifyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  verifyMessage.textContent = "Verification complete! Your application was submitted.";
  verifyMessage.style.color = "#22c55e";
});

logoUpload.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const imageUrl = loadEvent.target.result;
    logoSlots.forEach((slot) => {
      slot.style.backgroundImage = `url(${imageUrl})`;
      slot.textContent = "";
    });
  };
  reader.readAsDataURL(file);
});
