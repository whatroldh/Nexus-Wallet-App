const STORAGE_KEY = 'nexus-wallet-state';
const DEFAULT_BALANCE = 5000000;

let balance = loadBalance();

function loadBalance() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_BALANCE;
    const parsed = JSON.parse(saved);
    return Number.isFinite(parsed?.balance) ? parsed.balance : DEFAULT_BALANCE;
  } catch (error) {
    return DEFAULT_BALANCE;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      balance,
      updatedAt: new Date().toISOString(),
    })
  );
}

function updateBalanceDisplay() {
  const balanceElement = document.getElementById('currentBalance');
  if (balanceElement) {
    balanceElement.innerText = balance.toLocaleString('en-US') + ' د.ع';
  }
  saveState();
}

function setSystemLog(message) {
  const logElement = document.getElementById('systemLog');
  if (logElement) {
    logElement.innerText = message;
  }
}

function parseAmount(value) {
  if (value === null || value === undefined || value === '') {
    return NaN;
  }

  const cleaned = String(value).replace(/,/g, '').trim();
  const num = parseInt(cleaned, 10);
  return Number.isFinite(num) ? num : NaN;
}

function sendMoney() {
  const amount = prompt('أدخل المبلغ المراد إرساله:', '25000');
  if (amount === null) return;

  const num = parseAmount(amount);
  if (Number.isNaN(num) || num <= 0) {
    alert('الرجاء إدخال مبلغ صحيح!');
    return;
  }

  if (num > balance) {
    alert('عذراً، رصيدك غير كافٍ لإتمام عملية الإرسال!');
    return;
  }

  balance -= num;
  updateBalanceDisplay();
  setSystemLog('[System] : تم إرسال مبلغ ' + num.toLocaleString('en-US') + ' د.ع بنجاح إلى الطرف الثاني.');
}

function requestMoney() {
  const amount = prompt('أدخل المبلغ المطلوب استلامه:', '50000');
  if (amount === null) return;

  const num = parseAmount(amount);
  if (Number.isNaN(num) || num <= 0) {
    alert('الرجاء إدخال مبلغ صحيح!');
    return;
  }

  balance += num;
  updateBalanceDisplay();
  setSystemLog('[System] : تم استلام تحويل فوري بقيمة ' + num.toLocaleString('en-US') + ' د.ع من الطرف الثاني بنجاح وصار برصيدك!');
}

function depositMoney() {
  const amount = prompt('أدخل مبلغ الإيداع في المحفظة:', '100000');
  if (amount === null) return;

  const num = parseAmount(amount);
  if (Number.isNaN(num) || num <= 0) {
    alert('الرجاء إدخال مبلغ صحيح!');
    return;
  }

  balance += num;
  updateBalanceDisplay();
  setSystemLog('[System] : تم إيداع ' + num.toLocaleString('en-US') + ' د.ع في المحفظة بنجاح.');
}

function withdrawMoney() {
  const amount = prompt('أدخل مبلغ السحب من المحفظة:', '50000');
  if (amount === null) return;

  const num = parseAmount(amount);
  if (Number.isNaN(num) || num <= 0) {
    alert('الرجاء إدخال مبلغ صحيح!');
    return;
  }

  if (num > balance) {
    alert('عذراً، رصيد السحب يتجاوز رصيدك الحالي!');
    return;
  }

  balance -= num;
  updateBalanceDisplay();
  setSystemLog('[System] : تم سحب مبلغ ' + num.toLocaleString('en-US') + ' د.ع من بطاقة السوبر كي بنجاح.');
}

function resetSystem() {
  if (!confirm('هل تريد مسح وإعادة تعيين البيانات؟')) return;

  balance = DEFAULT_BALANCE;
  updateBalanceDisplay();
  setSystemLog('[System] : تم إعادة ضبط النظام ومسح البيانات بين الطرفين.');
}

updateBalanceDisplay();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
