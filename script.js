// ===== Switch Tab =====
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelector(`.tab-btn[onclick*="${tabId}"]`).classList.add("active");
}

// ===== Affordability =====
function calculateAfford() {
  const salary = parseFloat(document.getElementById("salary").value);
  const debt = parseFloat(document.getElementById("debt").value);
  const percent = parseFloat(document.getElementById("loanPercent").value);

  if (isNaN(salary) || isNaN(debt)) {
    document.getElementById("resultsAfford").innerHTML = "";
    return;
  }

  const ratio = (debt / salary) * 100;
  let multiplier = 3;
  let tahap = "Hutang tinggi";
  if (ratio === 0) {
    multiplier = 5;
    tahap = "Tiada hutang";
  } else if (ratio <= 20) {
    multiplier = 4;
    tahap = "Hutang sederhana";
  }

  const maxPrice = salary * 12 * multiplier;
  const loanMonthly = (maxPrice * (percent / 100)) * 0.0055;
  const safeLimit = salary * 0.3;
  const status = loanMonthly <= safeLimit ? "✅ Selamat" : "❌ Overcommit";

  document.getElementById("resultsAfford").innerHTML = `
    <p><strong>Debt Ratio:</strong> ${ratio.toFixed(1)}%</p>
    <small>Debt Ratio = Jumlah Hutang ÷ Gaji × 100</small>

    <p><strong>Tahap Hutang:</strong> ${tahap}</p>
    <small>0% → Tiada, 1–20% → Sederhana, >20% → Tinggi. Multiplier: ${multiplier}x gaji tahunan</small>

    <p><strong>Harga Maksimum Rumah:</strong> RM${maxPrice.toLocaleString()}</p>
    <small>Formula: Gaji × 12 × multiplier</small>

    <p><strong>Anggaran Bayaran Bulanan:</strong> RM${loanMonthly.toFixed(0)}</p>
    <small>Formula: (Harga × %Loan) × 0.0055</small>

    <p><strong>30% dari Gaji:</strong> RM${safeLimit.toFixed(0)}</p>
    <small>Bayaran bulanan sepatutnya tidak lebih 30% dari gaji</small>

    <p><strong>Status:</strong> ${status}</p>
  `;
}

function clearAfford() {
  document.getElementById("salary").value = "";
  document.getElementById("debt").value = "";
  document.getElementById("loanPercent").value = "90";
  document.getElementById("resultsAfford").innerHTML = "";
}

// ===== Anggaran Loan Rumah =====
function calculateLoanEstimate() {
  const price = parseFloat(document.getElementById("loanPrice").value);
  const monthly = parseFloat(document.getElementById("monthlyPay").value);
  const percent = parseFloat(document.getElementById("loanPercentEstimate").value);

  let output = "";

  if (!isNaN(price)) {
    const loanAmount = price * (percent / 100);
    const monthlyPayment = loanAmount * 0.0055;

    output += `
      <p><strong>Jumlah Pinjaman:</strong> RM${loanAmount.toFixed(0)}</p>
      <small>Formula: Harga Rumah × ${percent}%</small>

      <p><strong>Anggaran Bayaran Bulanan:</strong> RM${monthlyPayment.toFixed(0)}</p>
      <small>Formula: Loan × 0.0055 (30 tahun, ~5.5% interest)</small>
    `;
  }

  if (!isNaN(monthly)) {
    const maxLoan = monthly / 0.0055;
    const maxPrice = maxLoan / (percent / 100);

    output += `
      <p><strong>Loan Maksimum:</strong> RM${maxLoan.toFixed(0)}</p>
      <small>Formula: Bulanan ÷ 0.0055</small>

      <p><strong>Harga Rumah Maksimum:</strong> RM${maxPrice.toFixed(0)}</p>
      <small>Formula: Loan ÷ (${percent}% ÷ 100)</small>
    `;
  }

  document.getElementById("resultsLoanEstimate").innerHTML = output;
}

function clearLoanEstimate() {
  document.getElementById("loanPrice").value = "";
  document.getElementById("monthlyPay").value = "";
  document.getElementById("loanPercentEstimate").value = "90";
  document.getElementById("resultsLoanEstimate").innerHTML = "";
}

// ===== Loan Breakdown =====
function calculateLoanBreakdown() {
  const loan = parseFloat(document.getElementById("loanAmountCalc").value);
  const rate = parseFloat(document.getElementById("interestRate").value);
  const years = parseFloat(document.getElementById("loanTenure").value);

  if (isNaN(loan) || isNaN(rate) || isNaN(years)) {
    document.getElementById("resultsLoanBreakdown").innerHTML = "";
    return;
  }

  const monthlyRate = rate / 100 / 12;
  const totalPayments = years * 12;
  const monthlyPayment =
    (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  const totalInterest = monthlyPayment * totalPayments - loan;
  const totalPayment = monthlyPayment * totalPayments;

  document.getElementById("resultsLoanBreakdown").innerHTML = `
    <p><strong>Bayaran Bulanan:</strong> RM${monthlyPayment.toFixed(2)}</p>
    <small>Formula: Amortized Loan — standard mortgage formula</small>

    <p><strong>Total Interest:</strong> RM${totalInterest.toFixed(0)}</p>
    <small>Jumlah faedah sepanjang tempoh loan</small>

    <p><strong>Total Bayaran:</strong> RM${totalPayment.toFixed(0)}</p>
    <small>Jumlah bayaran termasuk prinsipal + interest</small>
  `;
}

function clearLoanBreakdown() {
  document.getElementById("loanAmountCalc").value = "";
  document.getElementById("interestRate").value = "";
  document.getElementById("loanTenure").value = "";
  document.getElementById("resultsLoanBreakdown").innerHTML = "";
}

// ===== Kos Permulaan =====
function calculateOneTimeCosts() {
  const price = parseFloat(document.getElementById("rumahHarga").value);
  if (isNaN(price)) {
    document.getElementById("resultsOneTime").innerHTML = "";
    return;
  }

  const deposit = price * 0.10;
  const legal = price * 0.01;
  const stamp = price > 500000 ? price * 0.03 : price * 0.02;
  const mrta = price * 0.01;
  const total = deposit + legal + stamp + mrta;

  document.getElementById("resultsOneTime").innerHTML = `
    <p><strong>Deposit 10%:</strong> RM${deposit.toFixed(0)}</p>
    <small>10% × Harga Rumah</small>

    <p><strong>Yuran Guaman (1%):</strong> RM${legal.toFixed(0)}</p>
    <small>Anggaran 1% dari harga rumah</small>

    <p><strong>Duti Setem:</strong> RM${stamp.toFixed(0)}</p>
    <small>±2%–3% ikut harga rumah</small>

    <p><strong>MRTA (Anggaran):</strong> RM${mrta.toFixed(0)}</p>
    <small>±1% dari harga rumah, bergantung umur dan tempoh loan</small>

    <p><strong><u>Total Kos Permulaan:</u></strong> RM${total.toFixed(0)}</p>
  `;
}

function clearOneTime() {
  document.getElementById("rumahHarga").value = "";
  document.getElementById("resultsOneTime").innerHTML = "";
}

// ===== DSR =====
function calculateDSR() {
  const salary = parseFloat(document.getElementById("dsrSalary").value);
  const debt = parseFloat(document.getElementById("dsrDebt").value);
  const loan = parseFloat(document.getElementById("dsrLoan").value);

  if (isNaN(salary) || isNaN(debt) || isNaN(loan)) {
    document.getElementById("resultsDSR").innerHTML = "";
    return;
  }

  const totalDebt = debt + loan;
  const dsr = (totalDebt / salary) * 100;
  const status = dsr <= 70 ? "✅ Lulus (DSR OK)" : "❌ Mungkin Gagal (DSR tinggi)";
  const minSalary = totalDebt / 0.7;

  document.getElementById("resultsDSR").innerHTML = `
    <p><strong>Jumlah Komitmen Termasuk Loan:</strong> RM${totalDebt.toFixed(0)}</p>
    <p><strong>DSR (Debt Service Ratio):</strong> ${dsr.toFixed(1)}%</p>
    <small>Formula: (Semua hutang ÷ Gaji) × 100</small>

    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Gaji Minimum Untuk Lulus DSR:</strong> RM${minSalary.toFixed(0)}</p>
    <small>DSR biasanya perlu <70% untuk lulus bank</small>
  `;
}

function clearDSR() {
  document.getElementById("dsrSalary").value = "";
  document.getElementById("dsrDebt").value = "";
  document.getElementById("dsrLoan").value = "";
  document.getElementById("resultsDSR").innerHTML = "";
}

// ===== Komitmen Bulanan =====
function calculateMonthlyCommitment() {
  const loan = parseFloat(document.getElementById("loanMonthly").value) || 0;
  const maintenance = parseFloat(document.getElementById("maintenance").value) || 0;
  const cukai = parseFloat(document.getElementById("cukai").value) || 0;
  const utiliti = parseFloat(document.getElementById("utiliti").value) || 0;
  const total = loan + maintenance + cukai + utiliti;

  document.getElementById("resultsMonthly").innerHTML = `
    <p><strong>Total Komitmen Bulanan:</strong> RM${total.toFixed(0)}</p>
  `;
}

function clearMonthly() {
  document.getElementById("loanMonthly").value = "";
  document.getElementById("maintenance").value = "";
  document.getElementById("cukai").value = "";
  document.getElementById("utiliti").value = "";
  document.getElementById("resultsMonthly").innerHTML = "";
}
