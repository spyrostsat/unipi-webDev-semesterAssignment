function isGreekString(str)
{
    return /^[\u0391-\u03C9\u03AC-\u03CE\s]+$/u.test(str);
}

function isValidZipCode(str) {
    return /^[0-9]{1,5}$/.test(str);
  }

function isValidNDigitString(str, n) {
    const regex = new RegExp(`^\\d{${n}}$`);
    return regex.test(str);
  }

function isValidPhoneNumber(str) {
    return /^\+30210\d{7}$/.test(str);
}

function isValidAddress(str)
{
    return /^[0-9\u0391-\u03C9\u03AC-\u03CE\s]+$/u.test(str);
}

module.exports.isGreekString = isGreekString;
module.exports.isValidZipCode = isValidZipCode;
module.exports.isValidNDigitString = isValidNDigitString;
module.exports.isValidPhoneNumber = isValidPhoneNumber;
module.exports.isValidAddress = isValidAddress;
