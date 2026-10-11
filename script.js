/* =========================================================
   1) LOGIN
   ========================================================= */
(function () {
  var VALID_USERID = "25UCS540";
  var VALID_PASSWORD = "12345678";

  var loginForm = document.getElementById("loginForm");
  var loginError = document.getElementById("loginError");
  var loginScreen = document.getElementById("loginScreen");
  var mainApp = document.getElementById("mainApp");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var uid = document.getElementById("login_userid").value.trim();
    var pwd = document.getElementById("login_password").value.trim();

    if (uid === VALID_USERID && pwd === VALID_PASSWORD) {
      loginError.classList.remove("show");
      loginScreen.style.display = "none";
      mainApp.style.display = "block";
      window.scrollTo(0, 0);
    } else {
      loginError.classList.add("show");
    }
  });
})();

/* =========================================================
   2) FIELD-BY-FIELD VALIDATION
   Each field is validated as soon as the user finishes typing;
   the NEXT field only becomes enabled once the current one
   passes a logical check.
   ========================================================= */
(function () {

  function setMsg(msgEl, text, ok) {
    msgEl.textContent = text;
    msgEl.className = "field-msg " + (ok ? "success" : "error");
  }

  function markField(el, ok) {
    el.classList.remove("field-valid", "field-invalid");
    el.classList.add(ok ? "field-valid" : "field-invalid");
  }

  function enable(el) {
    if (el) el.disabled = false;
  }
  function disable(el) {
    if (el) el.disabled = true;
  }

  function todayISO() {
    var d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function ageFromDOB(dobStr) {
    var dob = new Date(dobStr);
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  /* ---- element refs ---- */
  var nameEl = document.getElementById("student_name");
  var nameMsg = document.getElementById("student_name_msg");

  var dobEl = document.getElementById("dob");
  var dobMsg = document.getElementById("dob_msg");

  var mobileEl = document.getElementById("mobile_no");
  var mobileMsg = document.getElementById("mobile_no_msg");

  var genderRadios = document.querySelectorAll('input[name="gender"]');
  var genderMsg = document.getElementById("gender_msg");

  var addressEl = document.getElementById("address");
  var addressMsg = document.getElementById("address_msg");

  var deptEl = document.getElementById("department");
  var deptMsg = document.getElementById("department_msg");

  var yearSemEl = document.getElementById("year_semester");
  var yearSemMsg = document.getElementById("year_semester_msg");

  var regNoEl = document.getElementById("registration_no");
  var regNoMsg = document.getElementById("registration_no_msg");

  var eventsFieldset = document.getElementById("eventsFieldset");
  var declarationFieldset = document.getElementById("declarationFieldset");

  var declDateEl = document.getElementById("declaration_date");
  var declDateMsg = document.getElementById("declaration_date_msg");

  var studentSigEl = document.getElementById("student_signature");
  var studentSigMsg = document.getElementById("student_signature_msg");

  var submitBtn = document.getElementById("submitBtn");

  /* ---- individual validators ---- */
  function validateName() {
    var v = nameEl.value.trim();
    var ok = /^[A-Za-z][A-Za-z\s.'-]{2,59}$/.test(v);
    markField(nameEl, ok);
    setMsg(nameMsg, ok ? "Looks good." : "Enter a valid name (letters only, at least 3 characters).", ok);
    if (ok) enable(dobEl); else disable(dobEl);
    if (!ok) cascadeLock("dob");
    return ok;
  }

  function validateDOB() {
    var v = dobEl.value;
    var ok = false;
    if (v) {
      if (v > todayISO()) {
        setMsg(dobMsg, "Date of birth cannot be in the future.", false);
      } else {
        var age = ageFromDOB(v);
        if (age < 15 || age > 30) {
          setMsg(dobMsg, "Age must be between 15 and 30 years for this event.", false);
        } else {
          ok = true;
          setMsg(dobMsg, "Looks good.", true);
        }
      }
    } else {
      setMsg(dobMsg, "Date of birth is required.", false);
    }
    markField(dobEl, ok);
    if (ok) enable(mobileEl); else disable(mobileEl);
    if (!ok) cascadeLock("mobile_no");
    return ok;
  }

  function validateMobile() {
    var v = mobileEl.value.trim();
    var ok = /^[6-9][0-9]{9}$/.test(v);
    markField(mobileEl, ok);
    setMsg(mobileMsg, ok ? "Looks good." : "Enter a valid 10-digit mobile number (starting 6-9).", ok);
    if (ok) { genderRadios.forEach(enable); } else { genderRadios.forEach(disable); }
    if (!ok) cascadeLock("gender");
    return ok;
  }

  function validateGender() {
    var ok = false;
    genderRadios.forEach(function (r) { if (r.checked) ok = true; });
    setMsg(genderMsg, ok ? "Looks good." : "Please select a gender.", ok);
    if (ok) enable(addressEl); else disable(addressEl);
    if (!ok) cascadeLock("address");
    return ok;
  }

  function validateAddress() {
    var v = addressEl.value.trim();
    var ok = v.length >= 10;
    markField(addressEl, ok);
    setMsg(addressMsg, ok ? "Looks good." : "Enter a fuller address (at least 10 characters).", ok);
    if (ok) enable(deptEl); else disable(deptEl);
    if (!ok) cascadeLock("department");
    return ok;
  }

  function validateDept() {
    var v = deptEl.value.trim();
    var ok = /^[A-Za-z][A-Za-z\s&.\-]{1,59}$/.test(v);
    markField(deptEl, ok);
    setMsg(deptMsg, ok ? "Looks good." : "Enter a valid department name (letters only).", ok);
    if (ok) enable(yearSemEl); else disable(yearSemEl);
    if (!ok) cascadeLock("year_semester");
    return ok;
  }

  function validateYearSem() {
    var v = yearSemEl.value.trim();
    var ok = /^[A-Za-z0-9\s/.-]{1,20}$/.test(v) && v.length > 0;
    markField(yearSemEl, ok);
    setMsg(yearSemMsg, ok ? "Looks good." : "Enter a valid year / semester (e.g. II / IV).", ok);
    if (ok) enable(regNoEl); else disable(regNoEl);
    if (!ok) cascadeLock("registration_no");
    return ok;
  }

  function validateRegNo() {
    var v = regNoEl.value.trim();
    var ok = /^[A-Za-z0-9]{6,20}$/.test(v);
    markField(regNoEl, ok);
    setMsg(regNoMsg, ok ? "Looks good." : "Enter a valid registration number (6-20 letters/digits).", ok);
    if (ok) {
      eventsFieldset.disabled = false;
    } else {
      eventsFieldset.disabled = true;
      declarationFieldset.disabled = true;
      submitBtn.disabled = true;
    }
    return ok;
  }

  /* Locks everything downstream of a given field id when an
     earlier field becomes invalid again after being valid. */
  function cascadeLock(fromId) {
    var order = ["mobile_no", "gender", "address", "department", "year_semester", "registration_no"];
    var start = order.indexOf(fromId);
    if (start === -1) return;
    for (var i = start; i < order.length; i++) {
      var id = order[i];
      if (id === "gender") { genderRadios.forEach(disable); }
      else { var el = document.getElementById(id); disable(el); }
    }
    eventsFieldset.disabled = true;
    declarationFieldset.disabled = true;
    submitBtn.disabled = true;
  }

  function checkEventsSelected() {
    var checked = document.querySelectorAll('#eventsFieldset input[type="checkbox"]:checked');
    var ok = checked.length > 0;
    if (ok) {
      declarationFieldset.disabled = false;
    } else {
      declarationFieldset.disabled = true;
      submitBtn.disabled = true;
    }
    return ok;
  }

  function validateDeclDate() {
    var v = declDateEl.value;
    var ok = v && v <= todayISO();
    markField(declDateEl, !!ok);
    setMsg(declDateMsg, ok ? "Looks good." : "Enter a valid date (not in the future).", !!ok);
    updateSubmitState();
    return ok;
  }

  function validateStudentSig() {
    var v = studentSigEl.value.trim();
    var ok = v.length >= 3;
    markField(studentSigEl, ok);
    setMsg(studentSigMsg, ok ? "Looks good." : "Type your full name as signature.", ok);
    updateSubmitState();
    return ok;
  }

  function updateSubmitState() {
    var declDateOk = declDateEl.value && declDateEl.value <= todayISO();
    var sigOk = studentSigEl.value.trim().length >= 3;
    submitBtn.disabled = !(declDateOk && sigOk);
  }

  /* ---- wire up events ---- */
  nameEl.addEventListener("input", validateName);
  dobEl.addEventListener("change", validateDOB);
  mobileEl.addEventListener("input", validateMobile);
  genderRadios.forEach(function (r) { r.addEventListener("change", validateGender); });
  addressEl.addEventListener("input", validateAddress);
  deptEl.addEventListener("input", validateDept);
  yearSemEl.addEventListener("input", validateYearSem);
  regNoEl.addEventListener("input", validateRegNo);
  document.querySelectorAll('#eventsFieldset input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener("change", checkEventsSelected);
  });
  declDateEl.addEventListener("change", validateDeclDate);
  studentSigEl.addEventListener("input", validateStudentSig);

  /* initial lock-down state */
  disable(dobEl);
  disable(mobileEl);
  genderRadios.forEach(disable);
  disable(addressEl);
  disable(deptEl);
  disable(yearSemEl);
  disable(regNoEl);
  eventsFieldset.disabled = true;
  declarationFieldset.disabled = true;
  submitBtn.disabled = true;
})();
